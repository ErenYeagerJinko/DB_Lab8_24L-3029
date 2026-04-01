const express = require('express');
const sql = require('mssql/msnodesqlv8');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const dbConfig = {
    server: 'DESKTOP-F2J5J18',
    database: 'RozgarDB',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true,
        instanceName: 'SERVER'
    }
};

let pool;

async function connectToDatabase() {
    try {
        pool = await sql.connect(dbConfig);
        console.log('Connected to SQL Server successfully!');
        console.log('Database:', dbConfig.database);
        return true;
    } catch (err) {
        console.error('Database connection failed:', err.message);
        return false;
    }
}

app.get('/', (req, res) => {
    res.json({ 
        message: 'Rozgar Pakistan API is running!',
        endpoints: [
            'POST /api/login',
            'GET /api/getExp/:userId',
            'POST /api/addExp',
            'PUT /api/updateExp/:expId',
            'DELETE /api/deleteExp/:expId'
        ]
    });
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }
        const result = await pool.request()
            .input('Email', sql.VarChar(100), email)
            .input('Password', sql.VarChar(100), password)
            .execute('sp_LoginUser');
        if (result.recordset.length > 0) {
            res.json({ success: true, message: 'Login successful!', user: result.recordset[0] });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, message: 'Server error during login', error: err.message });
    }
});

app.get('/api/getExp/:userId', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const result = await pool.request()
            .input('UserID', sql.Int, userId)
            .query(`
                SELECT ExpID as id, JobTitle as title, CompanyName as company, 
                       YearsWorked as years, IsCurrentJob as current
                FROM Experience 
                WHERE UserID = @UserID
                ORDER BY YearsWorked DESC
            `);
        res.json({ success: true, data: result.recordset });
    } catch (err) {
        console.error('Get experience error:', err);
        res.status(500).json({ success: false, message: 'Error fetching experiences', error: err.message });
    }
});

app.post('/api/addExp', async (req, res) => {
    try {
        const { UserID, JobTitle, CompanyName, YearsWorked } = req.body;
        
        if (!UserID || !JobTitle || !CompanyName || !YearsWorked) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        
        const duplicateCheck = await pool.request()
            .input('UserID', sql.Int, UserID)
            .input('JobTitle', sql.VarChar(100), JobTitle)
            .input('CompanyName', sql.VarChar(100), CompanyName)
            .query(`
                SELECT ExpID FROM Experience 
                WHERE UserID = @UserID 
                AND JobTitle = @JobTitle 
                AND CompanyName = @CompanyName
            `);
        
        if (duplicateCheck.recordset.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Duplicate experience! This job title and company combination already exists for this user.' 
            });
        }
        
        await pool.request()
            .input('UserID', sql.Int, UserID)
            .input('JobTitle', sql.VarChar(100), JobTitle)
            .input('CompanyName', sql.VarChar(100), CompanyName)
            .input('YearsWorked', sql.Int, YearsWorked)
            .input('IsCurrentJob', sql.Bit, 0)
            .query(`
                INSERT INTO Experience (UserID, JobTitle, CompanyName, YearsWorked, IsCurrentJob)
                VALUES (@UserID, @JobTitle, @CompanyName, @YearsWorked, @IsCurrentJob)
            `);
        
        res.json({ success: true, message: 'Experience added successfully!' });
    } catch (err) {
        console.error('Add experience error:', err);
        res.status(500).json({ success: false, message: 'Error adding experience', error: err.message });
    }
});

app.put('/api/updateExp/:expId', async (req, res) => {
    try {
        const expId = parseInt(req.params.expId);
        const { JobTitle, CompanyName, YearsWorked, IsCurrentJob } = req.body;
        await pool.request()
            .input('ExpID', sql.Int, expId)
            .input('JobTitle', sql.VarChar(100), JobTitle)
            .input('CompanyName', sql.VarChar(100), CompanyName)
            .input('YearsWorked', sql.Int, YearsWorked)
            .input('IsCurrentJob', sql.Bit, IsCurrentJob ? 1 : 0)
            .query(`
                UPDATE Experience 
                SET JobTitle = @JobTitle, 
                    CompanyName = @CompanyName, 
                    YearsWorked = @YearsWorked,
                    IsCurrentJob = @IsCurrentJob
                WHERE ExpID = @ExpID
            `);
        res.json({ success: true, message: 'Experience updated successfully!' });
    } catch (err) {
        console.error('Update experience error:', err);
        res.status(500).json({ success: false, message: 'Error updating experience', error: err.message });
    }
});

app.delete('/api/deleteExp/:expId', async (req, res) => {
    try {
        const expId = parseInt(req.params.expId);
        await pool.request()
            .input('ExpID', sql.Int, expId)
            .query('DELETE FROM Experience WHERE ExpID = @ExpID');
        res.json({ success: true, message: 'Experience deleted successfully!' });
    } catch (err) {
        console.error('Delete experience error:', err);
        res.status(500).json({ success: false, message: 'Error deleting experience', error: err.message });
    }
});

const PORT = 5000;

async function startServer() {
    const connected = await connectToDatabase();
    if (!connected) {
        console.log('Warning: Server started without database connection. API endpoints will not work until database is connected.');
    }
    app.listen(PORT, () => {
        console.log(`Rozgar Pakistan Backend Server running at http://localhost:${PORT}`);
    });
}

startServer();
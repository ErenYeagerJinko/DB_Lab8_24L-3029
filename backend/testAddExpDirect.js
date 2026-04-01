const sql = require('mssql/msnodesqlv8');

const dbConfig = {
    server: 'DESKTOP-F2J5J18',
    database: 'RozgarDB',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true,
        instanceName: 'SERVER'
    }
};

async function addDummyExperience() {
    try {
        const pool = await sql.connect(dbConfig);

        const result = await pool.request()
            .input('UserID', sql.Int, 1)
            .input('JobTitle', sql.VarChar(100), 'Software Engineer')
            .input('CompanyName', sql.VarChar(100), 'Systems Ltd')
            .input('YearsWorked', sql.Int, 3)
            .execute('sp_AddExperience');

        console.log('Experience added successfully:');
        console.log(result.recordset[0]);

        pool.close();
    } catch (err) {
        console.error('Error adding experience:', err.message);
    }
}

addDummyExperience();
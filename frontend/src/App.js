import React, { useState, useEffect } from "react";
import Login from "./Login";
import ExperienceTable from "./ExperienceTable";
import "./App.css";

function AddExperience({ userId, onAdded, experiences }) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [years, setYears] = useState("");
  const [alert, setAlert] = useState("");
  const [saving, setSaving] = useState(false);

  const checkDuplicate = (jobTitle, companyName) => {
    return experiences.some(exp => 
      exp.title.toLowerCase() === jobTitle.toLowerCase() && 
      exp.company.toLowerCase() === companyName.toLowerCase()
    );
  };

  const saveExp = async () => {
    if (!title || !company || !years) {
      setAlert("All fields are required");
      return;
    }
    
    if (checkDuplicate(title, company)) {
      setAlert("This experience already exists! You cannot add duplicate entries.");
      return;
    }
    
    setSaving(true);
    setAlert("");
    try {
      const res = await fetch("http://localhost:5000/api/addExp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          UserID: userId,
          JobTitle: title,
          CompanyName: company,
          YearsWorked: parseInt(years),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTitle("");
        setCompany("");
        setYears("");
        onAdded();
      } else {
        if (data.message && data.message.includes("duplicate")) {
          setAlert("This experience already exists in the database!");
        } else {
          setAlert(data.message || "Failed to add experience");
        }
      }
    } catch {
      setAlert("Error connecting to server");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/addExp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          JobTitle: "Software Engineer",
          CompanyName: "Systems Ltd",
        }),
      });
      const data = await res.json();
      console.log("Response from backend:", data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div className="add-form-container">
      <h3>Add Experience</h3>
      <div className="add-form">
        <input
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <input
          type="number"
          placeholder="Years"
          value={years}
          onChange={(e) => setYears(e.target.value)}
        />
        <button disabled={saving} className="btn-add" onClick={saveExp}>
          {saving ? "Saving..." : "Add"}
        </button>
        <button className="btn-add" onClick={handleSave}>
          Handle Save (Software Engineer)
        </button>
      </div>
      {alert && <p className={`message error`}>{alert}</p>}
    </div>
  );
}

function Dashboard({ user, onLogout }) {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExps();
  }, [user.UserID]);

  const fetchExps = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/getExp/${user.UserID}`);
      const data = await res.json();
      console.log("Fetched experiences:", data);
      if (data.success) setExperiences(data.data);
    } catch {}
    setLoading(false);
  };

  const removeExp = async (id) => {
    if (!window.confirm("Delete this experience?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/deleteExp/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) fetchExps();
    } catch {}
  };

  const editExp = async (exp) => {
    const newTitle = prompt("Title:", exp.title);
    if (!newTitle) return;
    const newCompany = prompt("Company:", exp.company);
    if (!newCompany) return;
    const newYears = prompt("Years:", exp.years);
    if (!newYears) return;

    try {
      const res = await fetch(`http://localhost:5000/api/updateExp/${exp.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          JobTitle: newTitle,
          CompanyName: newCompany,
          YearsWorked: parseInt(newYears),
          IsCurrentJob: exp.current,
        }),
      });
      const data = await res.json();
      if (data.success) fetchExps();
    } catch {}
  };

  return (
    <div className="dashboard">
      <header className="header">
        <h1>Rozgar Pakistan</h1>
        <div className="user-info">
          <span>{user.FullName}</span>
          <button className="btn-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>
      <main className="main-content">
        <div className="card">
          <div className="card-header">
            <h2>Experience</h2>
            <button className="btn-refresh" onClick={fetchExps}>
              Refresh
            </button>
          </div>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <ExperienceTable
              experiences={experiences}
              removeExp={removeExp}
              editExp={editExp}
            />
          )}
        </div>
        <div className="card">
          <AddExperience 
            userId={user.UserID} 
            onAdded={fetchExps}
            experiences={experiences}
          />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const savedUser = localStorage.getItem('loggedInUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('loggedInUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('loggedInUser');
  };

  return (
    <div className="App">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}
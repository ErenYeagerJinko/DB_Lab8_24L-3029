import React, { useState, useEffect } from 'react';

function ResumeTable() {
  const [experience, setExperience] = useState([]);
  const [newJob, setNewJob] = useState({ jobTitle: '', companyName: '' });
  const [error, setError] = useState('');

  const fetchExperience = () => {
    fetch('http://localhost:3000/api/getExperience')
      .then(response => response.json())
      .then(data => setExperience(data))
      .catch(err => console.error('Error fetching data:', err));
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  const checkDuplicate = (jobTitle, companyName) => {
    return experience.some(job => 
      job.JobTitle.toLowerCase() === jobTitle.toLowerCase() && 
      job.CompanyName.toLowerCase() === companyName.toLowerCase()
    );
  };

  const handleAddExperience = () => {
    if (!newJob.jobTitle || !newJob.companyName) {
      setError('Please fill in all fields');
      return;
    }

    if (checkDuplicate(newJob.jobTitle, newJob.companyName)) {
      setError('This experience already exists');
      return;
    }

    fetch('http://localhost:3000/api/addExperience', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobTitle: newJob.jobTitle,
        companyName: newJob.companyName
      })
    })
      .then(response => response.json())
      .then(() => {
        setNewJob({ jobTitle: '', companyName: '' });
        setError('');
        fetchExperience();
      })
      .catch(err => console.error('Error adding experience:', err));
  };

  return (
    <div>
      <h2>Work Experience</h2>
      <div>
        <input
          type="text"
          placeholder="Job Title"
          value={newJob.jobTitle}
          onChange={(e) => setNewJob({ ...newJob, jobTitle: e.target.value })}
        />
        <input
          type="text"
          placeholder="Company Name"
          value={newJob.companyName}
          onChange={(e) => setNewJob({ ...newJob, companyName: e.target.value })}
        />
        <button onClick={handleAddExperience}>Add Experience</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      <ul>
        {experience.map((job) => (
          <li key={job.ExpID}>
            {job.JobTitle} at {job.CompanyName}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ResumeTable;
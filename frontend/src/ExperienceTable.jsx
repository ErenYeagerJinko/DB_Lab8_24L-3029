import React from "react";
import "./App.css";

export default function ExperienceTable({ experiences, removeExp, editExp }) {
  if (!experiences.length) {
    return <div className="empty-state">No experiences yet</div>;
  }

  return (
    <table className="experience-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Company</th>
          <th>Years</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {experiences.map((exp) => (
          <tr key={exp.id}>
            <td>{exp.title}</td>
            <td>{exp.company}</td>
            <td>{exp.years}</td>
            <td>
              <span className={`badge ${exp.current ? "current" : "past"}`}>
                {exp.current ? "Current" : "Past"}
              </span>
            </td>
            <td>
              <button className="btn-edit" onClick={() => editExp(exp)}>
                Edit
              </button>
              <button className="btn-delete" onClick={() => removeExp(exp.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
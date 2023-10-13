import React, { useState } from "react";
import "./UnionAgreement.css";

const UnionAgreement = () => {
  const [agreements, setAgreements] = useState([
    "Example Agreement 1",
    "Example Agreement 2",
    "Example Agreement 3",
  ]);

  const addAgreement = () => {
    // Placeholder for admin check
    // if (!isAdmin) return;

    const agreement = window.prompt("Enter the union agreement:");
    if (agreement) {
      setAgreements([...agreements, agreement]);
    }
  };

  const editAgreement = (index) => {
    // Placeholder for admin check
    // if (!isAdmin) return;

    const updatedAgreement = window.prompt(
      "Edit the union agreement:",
      agreements[index]
    );
    if (updatedAgreement) {
      const newAgreements = [...agreements];
      newAgreements[index] = updatedAgreement;
      setAgreements(newAgreements);
    }
  };

  const deleteAgreement = (index) => {
    // Placeholder for admin check
    // if (!isAdmin) return;

    if (window.confirm("Are you sure you want to delete this agreement?")) {
      const newAgreements = [...agreements];
      newAgreements.splice(index, 1);
      setAgreements(newAgreements);
    }
  };

  return (
    <div className="union-container">
      <h2>Union Agreements</h2>
      <ul>
        {agreements.map((agreement, index) => (
          <li key={index}>
            {agreement}
            {/* Example CRUD buttons for each agreement */}
            <button onClick={() => editAgreement(index)}>Edit</button>
            <button onClick={() => deleteAgreement(index)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={addAgreement}>Add Agreement</button>
    </div>
  );
};

export default UnionAgreement;

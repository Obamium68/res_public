// components/SignUpForm.tsx
"use client";
import React, { useState } from "react";

interface FormData {
  nome: string;
  cognome: string;
  codiceFiscale: string;
  dataNascita: string;
}

export default function SignUpForm() {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    cognome: "",
    codiceFiscale: "",
    dataNascita: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dati inviati:", formData);
    alert("Dati inviati con successo!");
  };

  return (
    <form onSubmit={handleSubmit} className="w-1/3" style={formStyle}>
      <label style={labelStyle}>Name:</label>
      <input
        className="border-1 rounded-sm"
        type="text"
        name="nome"
        value={formData.nome}
        onChange={handleChange}
        required
        style={inputStyle}
      />

      <label style={labelStyle}>Surname:</label>
      <input
        className="border-1 rounded-sm"
        type="text"
        name="cognome"
        value={formData.cognome}
        onChange={handleChange}
        required
        style={inputStyle}
      />

      <label style={labelStyle}>Tax Number:</label>
      <input
        className="border-1 rounded-sm"
        type="text"
        name="codiceFiscale"
        value={formData.codiceFiscale}
        onChange={handleChange}
        pattern="[A-Za-z0-9]{16}"
        title="Inserire un codice fiscale valido (16 caratteri alfanumerici)"
        maxLength={16}
        required
        style={inputStyle}
      />

      <label style={labelStyle}>Birth date:</label>
      <input
        className="border-1 rounded-sm"
        type="date"
        name="dataNascita"
        max={new Date().toISOString().split("T")[0]}
        value={formData.dataNascita}
        onChange={handleChange}
        required
        style={inputStyle}
      />

      <button type="submit" style={buttonStyle}>
        Sign up
      </button>
    </form>
  );
}

// Semplice stile inline
const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  maxWidth: "400px",
  margin: "0 auto",
  padding: "20px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontFamily: "Arial, sans-serif",
};

const labelStyle: React.CSSProperties = {
  marginTop: "10px",
  marginBottom: "5px",
  fontWeight: "bold",
};

const inputStyle: React.CSSProperties = {
  padding: "8px",
  fontSize: "16px",
};

const buttonStyle: React.CSSProperties = {
  marginTop: "20px",
  padding: "10px 15px",
  fontSize: "16px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  cursor: "pointer",
  borderRadius: "4px",
};

import logo from './logo.svg';
import './App.css';

// Import necessary libraries
import React, { useState } from "react";
import axios from "axios";

const App = () => {
  // State variables
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // New loading state

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous results and errors, and set loading
    setResult(null);
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/api/test", { input });
      const data = response.data;

      if (data.success) {
        setResult(data.result);
      } else {
        setError("The operation was unsuccessful. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "An unexpected error occurred."
      );
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: "20px", maxWidth: "100%" }}>
      <h1 style={{ textAlign: "center" }}>Search Specs</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto" }}>
        <div>
          <label htmlFor="input" style={{ display: "block", marginBottom: "8px" }}>
            Enter Input:
          </label>
          <input
            id="input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter input here"
            style={{
              padding: "8px",
              width: "100%",
              boxSizing: "border-box",
              marginBottom: "12px",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            width: "100%",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Submit
        </button>
      </form>

      {loading && (
        <div style={{ marginTop: "20px", textAlign: "center", color: "blue" }}>
          <h2>Loading...</h2>
        </div>
      )}

      {!loading && result && (
        <div style={{ marginTop: "20px", color: "green", wordBreak: "break-word" }}>
          <h2>Result:</h2>
          <ul style={{ paddingLeft: "0", listStyleType: "none" }}>
            {Object.entries(result).map(([key, value]) => (
              <li key={key} style={{ marginBottom: "8px" }}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && error && (
        <div style={{ marginTop: "20px", color: "red", wordBreak: "break-word" }}>
          <h2>Error:</h2>
          <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
            {error}
          </pre>
        </div>
      )}
    </div>
  );
};

export default App;

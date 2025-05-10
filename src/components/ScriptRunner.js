import React, { useState } from 'react';
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ScriptRunner = () => {
  const navigate = useNavigate();
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  
  const presetScripts = [
    {
      name: "Initialize PostgreSQL Schema",
      command: "psql -U postgres -d patientqueue -f src/main/resources/schema.sql",
      description: "Create all tables for Patient Queue application (bookings, hospitals, services, etc.)"
    },
    {
      name: "Backup Database",
      command: "pg_dump -U postgres -d patientqueue > backup_$(date +%Y%m%d).sql",
      description: "Backup the patientqueue database to a date-stamped file"
    },
    {
      name: "List PostgreSQL Databases",
      command: "psql -U postgres -l",
      description: "Show all PostgreSQL databases on the server"
    }
  ];

  const runScript = async () => {
    if (!command.trim()) {
      setError('Please enter a command');
      return;
    }

    setIsLoading(true);
    setOutput('');
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/scripts/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
      });

      const result = await response.json();
      
      if (result.success) {
        setOutput(result.output || 'Command executed successfully.');
      } else {
        setError(result.error || 'Failed to execute command.');
        if (result.output) {
          setOutput(result.output);
        }
      }
    } catch (err) {
      setError(`Error connecting to server: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      {}
      <header className="queue-header" style={{ backgroundColor: "#8B0000", color: "white", padding: "16px" }}>
        <div className="back-arrow" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <ArrowLeft size={24} color="white" />
        </div>
        <h1 style={{ marginLeft: "16px", fontSize: "1.5rem" }}>Script Runner</h1>
      </header>

      <div className="script-runner" style={{
        padding: "20px",
      }}>
        {}
        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ marginBottom: "16px", color: "#333", fontSize: "18px" }}>Preset Scripts</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {presetScripts.map((script, index) => (
              <div 
                key={index}
                style={{ 
                  backgroundColor: "#f8f8f8",
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0",
                  padding: "16px"
                }}
              >
                <h4 style={{ marginBottom: "8px", color: "#333" }}>{script.name}</h4>
                <p style={{ fontSize: "14px", marginBottom: "12px", color: "#666" }}>{script.description}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <code style={{ fontSize: "13px", backgroundColor: "#f1f1f1", padding: "6px", borderRadius: "4px", display: "block", maxWidth: "70%", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {script.command}
                  </code>
                  <button
                    onClick={() => setCommand(script.command)}
                    style={{
                      backgroundColor: "#8B0000",
                      color: "white",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      fontSize: "13px",
                      cursor: "pointer"
                    }}
                  >
                    Use
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {}
        <div style={{ marginBottom: "16px" }}>
          <h3 style={{ marginBottom: "16px", color: "#333", fontSize: "18px" }}>Custom Command</h3>
          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="command" style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
              Command:
            </label>
            <input
              type="text"
              id="command"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Enter command to run"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px"
              }}
            />
          </div>
          
          <button
            onClick={runScript}
            disabled={isLoading}
            style={{
              backgroundColor: "#8B0000",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "4px",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "500",
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? "Running..." : "Run Script"}
          </button>
        </div>
        
        {}
        {error && (
          <div style={{
            marginTop: "16px",
            padding: "12px",
            backgroundColor: "#FFF5F5",
            borderRadius: "4px",
            color: "#E53E3E",
            border: "1px solid #FED7D7"
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {output && (
          <div style={{ marginTop: "16px" }}>
            <h3 style={{ marginBottom: "8px", color: "#333", fontSize: "16px" }}>Output:</h3>
            <pre style={{
              backgroundColor: "#F7FAFC",
              padding: "12px",
              borderRadius: "4px",
              overflow: "auto",
              maxHeight: "300px",
              border: "1px solid #EDF2F7",
              fontSize: "14px",
              color: "#2D3748",
              whiteSpace: "pre-wrap"
            }}>
              {output}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScriptRunner; 
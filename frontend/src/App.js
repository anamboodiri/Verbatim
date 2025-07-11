import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const allStates = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota",
  "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming"
];

function App() {
  const [query, setQuery] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');
    try {
      const res = await axios.post('http://127.0.0.1:5000/query', {
        query,
        jurisdiction
      });
      setResponse(res.data.response);
    } catch (error) {
      setResponse('❌ Error fetching response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Verbatim</h1>
      <p className="subtitle">
        Verbatim is an AI-Platform designed to assist law enforcement professionals in quickly retrieving case law, legal statutes, and actionable guidance based on jurisdiction-specific questions. Select your state, enter a legal query, and receive a response tailored to your region’s legal framework.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="query">Legal Query:</label>
          <textarea
            id="query"
            rows="4"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Can I search a vehicle if I smell marijuana?"
          />
        </div>

        <div className="form-group">
          <label htmlFor="jurisdiction">Jurisdiction:</label>
          <select
            id="jurisdiction"
            value={jurisdiction}
            onChange={(e) => setJurisdiction(e.target.value)}
          >
            <option value="">Select a state</option>
            <option value="Federal">Federal</option>
            {allStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={!query || !jurisdiction || loading}>
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </form>

      {response && (
        <div
          className="response"
          dangerouslySetInnerHTML={{ __html: response }}
        ></div>
      )}
    </div>
  );
}

export default App;
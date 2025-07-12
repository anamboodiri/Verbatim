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
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query || !jurisdiction) return;

    setLoading(true);
    const userMessage = { role: 'user', text: `<strong>Legal Query:</strong> ${query}` };
    setConversation((prev) => [...prev, userMessage]);

    try {
      const res = await axios.post('http://127.0.0.1:5000/query', {
        query,
        jurisdiction
      });

      const aiText = res.data.response;
      const isFollowUp = /clarify|do you mean|more detail|unsure|unclear/i.test(aiText);
      const aiMessage = {
        role: isFollowUp ? 'followup' : 'ai',
        text: `<strong>Response:</strong> ${aiText}`
      };

      setConversation((prev) => [...prev, aiMessage]);
    } catch (error) {
      const status = error.response?.status;
      const message =
        status === 529 || status === 503
          ? '🚦 Our servers are temporarily overloaded. Please wait a moment and try again.'
          : '❌ An unexpected error occurred. Please try again later.';

      setConversation((prev) => [...prev, { role: 'error', text: message }]);
    } finally {
      setLoading(false);
      setQuery('');
    }
  };

  const handleReset = () => {
    setConversation([]);
    setQuery('');
    setJurisdiction('');
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
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div className="button-row">
          <button type="submit" disabled={!query || !jurisdiction || loading} className="submit" style={{ marginRight: '10px' }}>
            {loading ? 'Processing...' : 'Submit'}
          </button>
          <button type="button" className="reset" onClick={handleReset}>
            Start Over
          </button>
        </div>
      </form>

      <div className="response">
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={
              msg.role === 'user' ? 'user-msg' :
              msg.role === 'followup' ? 'followup-msg' :
              msg.role === 'error' ? 'error-msg' : 'ai-msg'
            }
            dangerouslySetInnerHTML={{ __html: msg.text }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default App;

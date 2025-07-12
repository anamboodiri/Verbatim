# Verbatim

**Verbatim** is an AI-powered legal assistant designed for law enforcement professionals. It provides natural language answers based on state-specific or federal case law and legal statutes.

---

##  Features

- Ask legal questions in plain English (e.g. “Can I search a vehicle if I smell marijuana?”)
- Filters results by jurisdiction (50 states + federal)
- Summarizes relevant case law, actionable insights, and legal citations
- Clarifies vague queries only when necessary
- Clean, modern frontend (React)
- Backend API powered by Claude 3.5 via Anthropic API

---

## Tech Stack

- **Frontend:** React + CSS
- **Backend:** Flask (Python) + Anthropic API
- **Environment:** `.env` for API keys
- **Deployment:** Localhost (can be configured for production)

---

## 🧪 Running Locally

### 1. Clone the repo

```bash
git clone https://github.com/your-username/verbatim-legal-ai.git
cd verbatim-legal-ai


## 1. Backend Setup

Follow the steps below to set up the backend:

1. Navigate to the backend directory:
    ```bash
    cd backend
    ```

2. Create and activate a virtual environment:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

3. Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4. Create a `.env` file:
    ```bash
    touch .env
    ```

5. Add your API key to the `.env` file:
    ```ini
    ANTHROPIC_API_KEY=your-key-here
    ```

6. Run the backend server:
    ```bash
    python app.py
    ```

## 2. Frontend Setup

Follow the steps below to set up the frontend:

1. Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2. Install the required dependencies:
    ```bash
    npm install
    ```

3. Start the frontend development server:
    ```bash
    npm start
    ```

Now your backend and frontend should be running. You can interact with both via the respective servers.



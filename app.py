from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import re
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

if not ANTHROPIC_API_KEY:
    print("❌ ERROR: ANTHROPIC_API_KEY not found in environment variables")
    exit(1)

@app.route('/')
def home():
    return "✅ Flask app is running!"

@app.route('/query', methods=['POST'])
def query_legal_ai():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No JSON data provided"}), 400

    query = data.get("query")
    jurisdiction = data.get("jurisdiction", "Federal")

    if not query:
        return jsonify({"error": "Query is required"}), 400

    prompt = f"""
You are a legal assistant for police officers. The user asked:

"{query}"

They want an answer based on **{jurisdiction}** law. Provide:

1. A summary of relevant case law
2. 2–3 actionable insights based on that case
3. Proper legal citation and a link if available
4. Related statutes from:
   - https://codes.findlaw.com/
   - https://www.ncsl.org/civil-and-criminal-justice/policing-legislation-database

Only ask a clarifying question if the query is genuinely too vague to determine applicable law. 
If the user's question contains a specific scenario or clearly refers to a known legal doctrine or fact pattern, answer it directly using case law and statutes. Avoid unnecessary clarifying questions.
"""

    headers = {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }

    payload = {
        "model": "claude-3-5-sonnet-20241022",
        "max_tokens": 1024,
        "messages": [{"role": "user", "content": prompt}]
    }

    try:
        response = requests.post("https://api.anthropic.com/v1/messages", headers=headers, json=payload)

        if response.status_code == 529:
            return jsonify({"response": "🚦 Our servers are temporarily overloaded. Please wait a moment and try again."}), 503

        if response.status_code != 200:
            print(f"❌ API Error: {response.status_code} - {response.text}")
            return jsonify({
                "error": f"API request failed with status {response.status_code}",
                "details": response.text
            }), 500

        result = response.json()
        print("🔍 RAW Anthropic response:", result)

        if "content" in result and len(result["content"]) > 0:
            raw_text = result["content"][0]["text"]

            # Clean formatting
            formatted = raw_text.replace("\n\n", "<br><br>").replace("\n- ", "<br>• ").replace("\n", "<br>")
            formatted = formatted.replace("1. ", "<br><strong>1. ").replace("2. ", "</strong><br><strong>2. ")
            formatted = formatted.replace("3. ", "</strong><br><strong>3. ").replace("4. ", "</strong><br><strong>4. ")
            formatted += "</strong>"

            # Make URLs clickable
            formatted = re.sub(r'(https?://[^\s<]+)', r'<a href="\1" target="_blank">\1</a>', formatted)

            formatted = formatted.replace(
                "Unfortunately I'm unable to directly access the provided links at this time.", ""
            )

            ai_response = f'<div class="legal-response">{formatted}</div>'
        else:
            ai_response = "No response content available"

        return jsonify({
            "query": query,
            "jurisdiction": jurisdiction,
            "response": ai_response
        })

    except Exception as e:
        print("❌ Error during API call:", str(e))
        return jsonify({
            "error": "Failed to fetch response",
            "details": str(e)
        }), 500

if __name__ == '__main__':
    print("🚀 Starting Flask app...")
    print(f"🔑 API Key loaded: {'✅ Yes' if ANTHROPIC_API_KEY else '❌ No'}")
    app.run(debug=True)

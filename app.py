from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return "✅ Flask app is running!"

@app.route('/query', methods=['POST'])
def query_legal_ai():
    data = request.get_json()
    query = data.get("query")
    jurisdiction = data.get("jurisdiction")

    # Placeholder for now
    return jsonify({
        "query": query,
        "jurisdiction": jurisdiction,
        "response": "This is a placeholder response from the API."
    })

if __name__ == '__main__':
    app.run(debug=True)

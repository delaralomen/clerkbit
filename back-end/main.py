from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
load_dotenv()
from premai import PremAI

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Initialize PremAI client
API_KEY = os.getenv("PREMAI_API_KEY")
client = PremAI(api_key=API_KEY)
MODEL_ID = os.getenv("PREMAI_MODEL_ID")  # Replace with your model ID

@app.route('/')
def home():
    return "Hello!"

@app.route('/chat', methods=['POST'])
def model_response():
    data = request.get_json()
    user_message = data.get('message')

    # Build conversation
    messages = [
        {"role": "system", "content": "You are a helpful AI assistant who greets and assists customers through the choice of the items to purchase at the cafeteria / bar. You propose the products depending on the time of the day and weather. You respond depending on the language you are interacted with. You take questions and answer to them accordingly to your knowledge of the store menu like a real waiter. You state allergies and ingredients if needed. You also present prices when the user asks or when it is finalizing the order. You will handles payments too. If you can't fulfill the request you need to state that a human is needed."},
        {"role": "user", "content": user_message}
    ]

    try:
        # Call PremAI model using SDK
        response = client.chat.completions(
            model=MODEL_ID,
            messages=messages
        )

        # Extract assistant reply
        assistant_reply = response.choices[0].message.content
        return jsonify(message=assistant_reply)

    except Exception as e:
        print("Error:", e)
        return jsonify(message="Error connecting to the model."), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5050, debug=True)

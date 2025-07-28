from flask import Flask, request, jsonify
from flask_cors import CORS
from anthropic import Anthropic, HUMAN_PROMPT, AI_PROMPT
from dotenv import load_dotenv
import os

# ========== ENV / CONFIG ==========
load_dotenv()
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

# ========== INIT ==========
app = Flask(__name__)
CORS(app, supports_credentials=True)
anthropic = Anthropic(api_key=ANTHROPIC_API_KEY)

# ========== MEMORY ==========
conversation_memory = {}  # Dict[conversation_id] = list of messages

# ========== ROUTES ==========
@app.route('/')
def home():
    return "Hello from Claude!"

@app.route('/chat', methods=['POST'])
@app.route('/chat', methods=['POST'])
def model_response():
    data = request.get_json()
    user_message = data.get('message')
    conv_id = data.get('conversation_id', 'default')  # Use 'default' if no ID provided

    # Retrieve or initialize conversation
    history = conversation_memory.get(conv_id, [])

    if not history:
        system_prompt = (
            "You are a helpful AI assistant who greets and assists customers through the choice of the items to purchase at the cafeteria / bar. You propose the products depending on the time of the day and weather. You respond depending on the language you are interacted with. You take questions and answer to them accordingly to your knowledge of the store menu like a real waiter. You state allergies and ingredients if needed. You also present prices when the user asks or when it is finalizing the order. You will handle payments too. If you can't fulfill the request you need to state that a human is needed. When displaying a price make sure it is in CHF."
        )
        history.append({"role": "user", "content": system_prompt})
        history.append({"role": "assistant", "content": "Understood!"})

    # Add user message
    history.append({"role": "user", "content": user_message})

    try:
        response = anthropic.messages.create(
         model = "claude-3-5-sonnet-20241022",
            max_tokens=400,
            temperature=0.7,
            messages=history
        )

        assistant_reply = response.content[0].text.strip()

        # Add to memory
        history.append({"role": "assistant", "content": assistant_reply})
        conversation_memory[conv_id] = history

        return jsonify(message=assistant_reply)

    except Exception as e:
        print("Error:", e)
        return jsonify(message="Error calling Claude API."), 500


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5050, debug=True)

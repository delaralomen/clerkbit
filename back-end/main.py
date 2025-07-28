from flask import Flask, request
from flask_cors import CORS
from flask import jsonify
import random



app = Flask(__name__)
CORS(app, supports_credentials=True)

@app.route('/')
def home():
    return "Hello!"



@app.route('/chat', methods=['POST'])
def model_response():
    data = request.get_json()
    user_message = data.get('message')
    print(user_message)
    messages = [
        "Good morning! How can I help you today?",
        "Welcome! Would you like to start with something to drink?",
        "Are you ready to order, or do you need a few more minutes?",
        "Can I get you anything to start?",
        "Would you like to hear the specials?",
        "What can I get for you today?",
        "Would you like that for here or to go?",
        "How would you like your coffee?",
        "Do you have any allergies or dietary restrictions I should know about?",
        "Would you like cream or sugar with that?",
        "I'll be right back with your order.",
        "Is everything okay with your meal?",
        "Can I get you anything else?",
        "Would you like to see the dessert menu?",
        "Can I clear these plates for you?",
        "Would you like the check?",
        "Thank you! Have a great day!",
        "Let me know if you need anything else.",
        "Take your time, no rush.",
        "I'll be with you in just a moment."
    ]
    return jsonify(message=random.choice(messages))

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)

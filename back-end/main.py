from flask import Flask, request, jsonify
from flask_cors import CORS
from anthropic import Anthropic
from dotenv import load_dotenv
import os
import json
import requests

# ===== Setup =====
load_dotenv()
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
anthropic = Anthropic(api_key=ANTHROPIC_API_KEY)

app = Flask(__name__)
CORS(app, supports_credentials=True)
conversation_memory = {}
order_total = None

# ===== Tool Definition =====
tool_definitions = [
    {
        "name": "get_menu",
        "description": "Get the current cafe menu with categories and prices in CHF",
        "input_schema": {
            "type": "object",
            "properties": {},
            "required": []
        }
    },
    {
        "name": "create_order",
        "description": "Submit the customer's final order in structured format.",
        "input_schema": {
            "type": "object",
            "properties": {
                "items": {
                    "type": "object",
                    "description": "A dictionary of menu item names (in singular form) and their quantities",
                    "additionalProperties": { "type": "integer", "minimum": 1 }
                },
                "total_chf": {
                    "type": "number",
                    "description": "Total cost in CHF with two decimal places"
                }
            },
            "required": ["items", "total_chf"]
        }
    }
]


# ====== Helper: Initialize conversation ======
def initialize_conversation(conv_id):
    # system_prompt = (
    #     "You are a polite restaurant assistent. You will only answer questions about the restaurants menu and will not make anything up. If you dont have information about an item requested by the user you will tell them you cannot answer the question nicely. You will answer questions only based on information provided in the stores menu. You will provide all monetary prices and write 'CHF' afterwards. If you dont have specific information to a question of the customer you will say that you don't have this information. You will reason if the request is a call to action or information request. When displaying a price make sure it is in CHF."
    # )
    # system_prompt = ("You are a polite and helpful restaurant assistant. You only answer questions about the restaurant's menu. You are not allowed to guess or make up any information. For any question involving items, categories, ingredients, allergens, availability, or prices, you must use the `get_menu` tool to fetch accurate information from the official menu system. You are not allowed to answer menu-related questions from memory or training — always use the tool. If you do not have access to the `get_menu` tool, or the information is missing, reply kindly: 'I'm sorry, I currently don't have access to the correct menu information.' You must provide all prices and write 'CHF' after the amount. The amount should be shown with 2 decimal places. If the customer makes a request or order, you should identify it as a call to action and assist accordingly. You must never invent menu items or prices. You only answer based on the data returned from the `get_menu` tool.")
#     system_prompt = (
#     "You are a polite and helpful restaurant assistant. "
#     "You only answer questions about the restaurant's menu. "
#     "You are not allowed to guess or make up any information. "
#     "For any question involving items, categories, ingredients, allergens, availability, or prices, "
#     "you must use the `get_menu` tool to fetch accurate information from the official menu system. "
#     "You are not allowed to answer menu-related questions from memory or training — always use the tool. "
#     "If you do not have access to the `get_menu` tool, or the information is missing, reply kindly: "
#     "'I'm sorry, I currently don't have access to the correct menu information.' "

#     "You must provide all prices and write 'CHF' after the amount. "
#     "Prices must be shown with 2 decimal places. "

#     "When a customer places an order, you must determine if it's a **new order** or **an update to a previous order**. "
#     "You should only use the `create_order` tool if the order includes **at least one item**, and it is **different from the last submitted order**. "

#     "Do not call the `create_order` tool just to repeat, summarize, or confirm the same order again. "
#     "If the customer is still deciding or asks a follow-up question, continue assisting without using the tool. "
#     "If you're unsure whether an order is new or changed, politely ask the user for confirmation before calling the tool. "

#     "Never invent menu items or prices. You only answer based on the data returned from the `get_menu` tool."
#     "You must never invent menu items or prices. You only answer based on the data returned from the get_menu tool. "
# "After executing any tool, always return a natural language message to the customer summarizing what happened."

# )
    system_prompt = (
    "You are a polite and helpful restaurant assistant. "
    "You only answer questions about the restaurant's menu and never guess or invent information. "

    "To answer questions about items, ingredients, allergens, prices, or availability, you must always use the `get_menu` tool. "
    "Do not answer based on memory or training — always rely on the `get_menu` results. "

    "When the customer places or updates an order, call the `create_order` tool **only if** the order includes one or more valid items AND the order is different from any previous one. "
    "Do not use `create_order` just to confirm or summarize. Wait for a new or changed order. "

    "To call `create_order`, send a JSON object with:\n"
    "- `items`: a dictionary where each key is a valid menu item (in singular form) and the value is the ordered quantity (integer >= 1)\n"
    "- `total_chf`: the correct total cost for the full order, using prices from the `get_menu` tool, shown with 2 decimal places. "

    "Example input for `create_order`:\n"
    "{\n"
    '  "items": {\n'
    '    "Cappuccino": 2,\n'
    '    "Vegan Brownie": 1\n'
    "  },\n"
    '  "total_chf": 14.10\n'
    "} "

    "Never submit an order with made-up items or prices. Use exact matches from the menu. "
    "After tool execution, always return a friendly message summarizing the outcome to the user."
)


    history = [
        {"role": "user", "content": system_prompt},
        {"role": "assistant", "content": "Understood!"}
    ]
    conversation_memory[conv_id] = history
    return history

# ====== Helper: Send to Claude ======
def call_claude(history, model="claude-3-5-sonnet-20241022"):
    try:
        response = anthropic.messages.create(
            model=model,
            max_tokens=400,
            temperature=0.7,
            messages=history,
            tools=tool_definitions
        )
        return response
    except Exception as e:
        print("Error calling Claude:", e)
        return None


def handle_get_menu():
    print("➡️  Calling MCP /menu")
    resp = requests.get("http://localhost:6060/menu")
    resp.raise_for_status()
    data = resp.json()
    print("⬅️  Menu received.")
    return data

# def handle_create_order(input_data):
#     print("➡️  Calling MCP /order")
#     resp = requests.post("http://localhost:6060/order", json=input_data)
#     resp.raise_for_status()
#     data = resp.json()
#     print("⬅️  Order confirmed.")
#     return data


def handle_create_order(input_data):
    global order_total  # to assign to the global variable

    print("➡️  Calling MCP /order")
    resp = requests.post("http://localhost:6060/order", json=input_data)
    resp.raise_for_status()
    data = resp.json()
    print("⬅️  Order confirmed.")

    # Fetch total from MCP and assign globally
    try:
        total_resp = requests.get("http://localhost:6060/total")
        total_resp.raise_for_status()
        total_data = total_resp.json()
        order_total = total_data.get("total_chf")
        print(f"💰 Global order_total updated: {order_total}")
    except Exception as e:
        print(f"⚠️ Failed to update order_total: {e}")
        order_total = None

    return data


# ====== Helper: Handle Tool Use ======
def handle_tool_use(block, history):
    tool_use_id = block.id
    tool_name = block.name
    tool_input = block.input

    print(f"🛠 Tool requested: {tool_name} with ID: {tool_use_id}")

    # Save the tool_use block into the assistant message
    history.append({
        "role": "assistant",
        "content": [
            {
                "type": "tool_use",
                "id": tool_use_id,
                "name": tool_name,
                "input": tool_input
            }
        ]
    })

    try:
        # Dispatch by tool name
        if tool_name == "get_menu":
            result = handle_get_menu()

        elif tool_name == "create_order":
            result = handle_create_order(tool_input)

        else:
            raise ValueError(f"No handler for tool: {tool_name}")

        # Append user message with tool result
        history.append({
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": tool_use_id,
                    "content": json.dumps(result)
                }
            ]
        })

        # Follow-up Claude call
        followup = call_claude(history)
        if followup:
            for block in followup.content:
                if block.type == "text":
                    return block.text.strip()

    except Exception as e:
        print(f"❌ Tool handling failed: {e}")
        return "There was an error executing the tool."

    return "Tool executed, but no text response received."


# ====== Main Endpoint ======
@app.route('/chat', methods=['POST'])
def model_response():
    data = request.get_json()
    user_message = data.get('message')
    conv_id = data.get('conversation_id', 'default')
    model = data.get('model', 'claude-3-5-sonnet-20241022')

    history = conversation_memory.get(conv_id)
    if not history:
        history = initialize_conversation(conv_id)

    history.append({"role": "user", "content": user_message})

    response = call_claude(history, model=model)
    if not response:
        return jsonify({"message": "Error calling Claude API."}), 500

    # Check for tool use
    for block in response.content:
        if block.type == "tool_use":
            assistant_reply = handle_tool_use(block, history)
            conversation_memory[conv_id] = history
            return jsonify({"message": assistant_reply})

    # Otherwise return normal reply
    for block in response.content:
        if block.type == "text":
            assistant_reply = block.text.strip()
            history.append({"role": "assistant", "content": assistant_reply})
            conversation_memory[conv_id] = history
            return jsonify({"message": assistant_reply})

    return jsonify({"message": "No valid reply received."}), 500

# ====== Run Server ======
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5050, debug=True)

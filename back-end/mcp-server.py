from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import re
import json

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Endpoint of your existing Claude backend
CLAUDE_BACKEND_URL = "http://localhost:5050/chat"

# Store latest order as a dict
basket = {}

cafe_menu_chf = {
    "Hot Beverages": {
        "Espresso": 3.50,
        "Double Espresso": 4.80,
        "Cappuccino": 4.80,
        "Caffè Latte": 5.20,
        "Flat White": 5.00,
        "Hot Chocolate": 4.50,
        "Chai Latte": 5.00,
        "Tea (variety of blends)": 3.80
    },
    "Cold Drinks": {
        "Iced Latte": 5.50,
        "Iced Americano": 4.80,
        "Fresh Orange Juice": 5.80,
        "Homemade Lemonade": 4.50,
        "Sparkling Water (50cl)": 3.00,
        "Local Apple Juice": 4.50
    },
    "Pastries & Sweets": {
        "Butter Croissant": 2.80,
        "Pain au Chocolat": 3.20,
        "Cinnamon Roll": 4.00,
        "Seasonal Fruit Tart": 5.20,
        "Vegan Brownie": 4.80,
        "Slice of Carrot Cake": 5.50
    },
    "Light Bites": {
        "Mozzarella & Tomato Ciabatta": 8.50,
        "Ham & Cheese Croissant": 7.90,
        "Vegan Hummus Wrap": 9.20,
        "Quiche Lorraine (slice)": 6.80,
        "Mixed Salad Bowl": 9.50
    }
}

@app.route('/menu', methods=['GET'])
def get_menu():
    return jsonify(cafe_menu_chf)

@app.route('/basket', methods=['GET'])
def view_basket():
    return jsonify(basket)

@app.route('/total', methods=['GET'])
def get_total():
    if not basket or "items" not in basket:
        return jsonify({"error": "No order found"}), 400

    total = 0.0
    for item, qty in basket["items"].items():
        for category in cafe_menu_chf.values():
            if item in category:
                total += category[item] * qty

    return jsonify({
        "basket": basket["items"],
        "total_chf": f"{total:.2f} CHF"
    })

@app.route('/order', methods=['POST'])
def create_order():
    global basket

    data = request.get_json()
    items = data.get('items')
    total = data.get('total_chf')

    if not items or not isinstance(items, dict):
        return jsonify({"error": "Missing or invalid 'items' in request"}), 400
    if not isinstance(total, (int, float)):
        return jsonify({"error": "Missing or invalid 'total_chf' in request"}), 400

    # Optional: validate item names
    valid_items = {item for category in cafe_menu_chf.values() for item in category}
    for item in items:
        if item not in valid_items:
            return jsonify({"error": f"Invalid item in order: {item}"}), 400

    # ✅ Store basket as dict, not list
    basket = {
        "items": items,
        "total_chf": round(float(total), 2)
    }

    print(f"🧺 Structured order saved: {json.dumps(basket, indent=2)}")
    return jsonify({
        "status": "success",
        "message": "Structured order saved.",
        "basket": basket
    })

if __name__ == '__main__':
    app.run(port=6060, debug=True)

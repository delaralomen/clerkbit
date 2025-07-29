from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import re
import json

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Endpoint of your existing Claude backend
CLAUDE_BACKEND_URL = "http://localhost:5050/chat"


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
    total = 0.0
    for item, qty in basket.items():
        for category in cafe_menu_chf.values():
            if item in category:
                total += category[item] * qty
    return jsonify({
        "basket": basket,
        "total_chf": f"{total:.2f} CHF"
    })



# @app.route('/order', methods=['POST'])
# def create_order():
#     data = request.get_json()
#     order_summary = data.get('order')

#     if not order_summary:
#         return jsonify({"error": "Missing 'order' in request"}), 400

#     # Save the order to the basket
#     # basket.append(order_summary)
#     basket = [order_summary]

#     print(f"🧺 Order added to basket: {basket}")
#     return jsonify({"status": "success", "message": "Order has been added to the basket."})


# @app.route('/order', methods=['POST'])
# def create_order():
#     global basket  # ensure we're updating the global variable

#     data = request.get_json()
#     order_summary = data.get('order')

#     if not order_summary:
#         return jsonify({"error": "Missing 'order' in request"}), 400

#     print(f"📦 Raw order input: {order_summary}")

#     # Flatten the menu
#     all_menu_items = {}
#     for category in cafe_menu_chf.values():
#         all_menu_items.update(category)

#     item_lookup = {item.lower(): item for item in all_menu_items.keys()}

#     matches = re.findall(r'(\d+)[xX]?\s+([A-Za-zÀ-ÿ0-9&\s\-\(\)]+?)(?:\s*\(.*?\))?(?=,|$)', order_summary)

#     parsed_order = {}

#     for quantity_str, raw_item in matches:
#         quantity = int(quantity_str)
#         item_name = raw_item.strip().lower()

#         canonical_name = item_lookup.get(item_name)
#         if canonical_name:
#             parsed_order[canonical_name] = parsed_order.get(canonical_name, 0) + quantity
#         else:
#             print(f"⚠️ Unrecognized item skipped: {raw_item.strip()}")

#     if not parsed_order:
#         return jsonify({"error": "No valid menu items found in the order."}), 400

#     # ✅ Overwrite the basket
#     basket = parsed_order

#     print(f"🧺 Basket replaced with: {basket}")
#     return jsonify({
#         "status": "success",
#         "message": "Basket has been overwritten with the new order.",
#         "basket": basket
#     })



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

    # Optional: verify items are valid
    valid_items = {item for category in cafe_menu_chf.values() for item in category}
    for item in items:
        if item not in valid_items:
            return jsonify({"error": f"Invalid item in order: {item}"}), 400

    # Set basket (overwrite, not append)
    basket = [{ "items": items, "total_chf": round(float(total), 2) }]

    print(f"🧺 Structured order saved: {json.dumps(basket, indent=2)}")
    return jsonify({
        "status": "success",
        "message": "Structured order saved.",
        "basket": basket
    })



if __name__ == '__main__':
    app.run(port=6060, debug=True)

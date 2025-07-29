from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import re
import json

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Endpoint of your existing Claude backend
CLAUDE_BACKEND_URL = "http://localhost:5050/chat"


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




if __name__ == '__main__':
    app.run(port=6060, debug=True)

from flask import Flask, jsonify

app = Flask(__name__)

# Define a list of menu items
menu_items = [
    {"id": 1, "name": "Mocca", "price": 3.5},
    {"id": 2, "name": "Americano", "price": 2.5},
    {"id": 3, "name": "Espresso", "price": 2.0},
    {"id": 4, "name": "Cappuccino", "price": 3.0},
    {"id": 5, "name": "Latte", "price": 3.0}
]

# Endpoint to get menu items
@app.route('/api/menu', methods=['GET'])
def get_menu():
    return jsonify(menu_items)

if __name__ == '__main__':
    app.run(debug=True)
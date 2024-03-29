from flask import Flask,jsonify,request
from flask_cors import CORS, cross_origin
from pymongo.mongo_client import MongoClient
import pymongo

uri = "mongodb+srv://Phakin1824:Geng_100104@cluster0.pzjda8i.mongodb.net/"
client = MongoClient(uri)
db = client["CoffeeShop"]
collection = db["coffee"]
p_in_DB = collection.find()
coffee=[]
for p in p_in_DB:
        coffee.append(p)

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/coffee",methods=["GET"])
def get_all_coffee():
    return jsonify(coffee),200



@app.route("/bill", methods=["POST"])    #register_account
@cross_origin()
def bill():
    data = request.get_json()
    print("oak")
    
    count = len(coffee)
    cof = 0
    if count != 0:
        cof = coffee[-1]["_id"] + 1
    
    new_coffee = {
        "_id": cof,
        "name": data["username"],
        "sweetness": data["sweetness"],
        "price": data["price"],
        "temp": data["temp"]
    }
    
    coffee.append(new_coffee)
    
    try:
        # Insert into MongoDB
        collection.insert_one(new_coffee)
    except pymongo.errors.PyMongoError as e:
        return jsonify({"error": str(e)}), 500  # Internal Server Error
    
    return jsonify(coffee), 200




if __name__ == "__main__":
    app.run(host="0.0.0.0",port=5000,debug=True)

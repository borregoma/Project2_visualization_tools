from flask import Flask, render_template, jsonify
import pymongo

app = Flask(__name__)

conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)

db = client.auto_industry
geojsons = db.geojsons


@app.route("/")
def index():
    return render_template("index.html")
@app.route('/json')
def geojsonData():
    data = list(geojsons.find())
    for day in data:
        day.pop("_id")
    print(len(data))
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
from flask import Flask, render_template, url_for
from flask_pymongo import PyMongo
from config import mongo_uri


app = Flask(__name__)
app.config["MONGO_URI"]= mongo_uri
mongo = PyMongo(app)

@app.route("/")
def index():
    return render_template("index.html")

if __name__=="__main__":
    app.run()
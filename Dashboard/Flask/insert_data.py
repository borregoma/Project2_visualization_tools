import pymongo
import json

balance = json.load(open('Data/balance.geojson'))
balanceM = json.load(open('Data/balanceM.geojson'))
exports = json.load(open('Data/exports.geojson',))
exportsM = json.load(open('Data/exportsM.geojson',))
sales = json.load(open('Data/sales.geojson',))
salesM = json.load(open('Data/salesM.geojson',))

conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)

db = client.auto_industry
geojsons = db.geojsons


geojsons.insert_many(
    [balance, balanceM, exports, exportsM, sales, salesM]
)
print("Data Uploaded!")

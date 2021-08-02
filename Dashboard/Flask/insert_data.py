import pymongo
import json
import pandas as pd

conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)

db = client.auto_industry
geojsons = db.geojsons
brandBalance = db.brandBalance
brandExports = db.brandExports
brandSales = db.brandSales

balance = json.load(open('Data/balance.geojson'))
balanceM = json.load(open('Data/balanceM.geojson'))
exports = json.load(open('Data/exports.geojson'))
exportsM = json.load(open('Data/exportsM.geojson'))
sales = json.load(open('Data/sales.geojson'))
salesM = json.load(open('Data/salesM.geojson'))
brandBalanceData = json.load(open('Data/brandbalance.json'))
brandExportsData = json.load(open('Data/brandexports.json'))
brandSalesData = json.load(open('Data/brandsales.json'))

geojsons.insert_many(
    [balance, balanceM, exports, exportsM, sales, salesM]
)
print("Geojsons1 Uploaded!")


brandBalance.insert_many(brandBalanceData)
brandExports.insert_many(brandExportsData)
brandSales.insert_many(brandSalesData)
print("Tables2 Uploaded!")

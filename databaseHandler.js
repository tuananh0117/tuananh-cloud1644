
var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://0.0.0.0:27017'
const { Int32, ObjectId } = require('bson')

async function login(user,pass){
    let client = await MongoClient.connect(url)
    let db = client.db("GCH1002")
    let userDB = await db.collection("websiteUsers").
            findOne({$and:[{userName:user},{password:pass}]})
     console.log(user)
    return userDB
}

async function insertProduct(newProduct) {
    let client = await MongoClient.connect(url)
    let db = client.db("GCH1002")
    let newId = await db.collection("products").insertOne(newProduct)
    return newId
}
async function getAllProducts() {
    let client = await MongoClient.connect(url)
    let db = client.db("GCH1002")
    const results = await db.collection("products").find().toArray()
    return results
}
async function deleteProductById(id) {
    let client = await MongoClient.connect(url)
    let db = client.db("GCH1002")
    await db.collection("products").deleteOne({ _id: ObjectId(id) })
}
async function updateProduct(id, name, price, picture) {
    let client = await MongoClient.connect(url)
    let db = client.db("GCH1002")
    await db.collection("products").updateOne({ _id: ObjectId(id) },
        { $set: { "name": name, "price": price, "pictureURL": picture } })
}
async function findProductById(id) {
    let client = await MongoClient.connect(url)
    let db = client.db("GCH1002")
    const productToEdit = await db.collection("products").findOne({ _id: ObjectId(id) })
    return productToEdit
}
async function searchProductByName(name){
    let client = await MongoClient.connect(url)
    let db = client.db("GCH1002")
    const results = await db.collection("products").find({ name: new RegExp(name,'i') }).toArray()
    return results
}
module.exports = {login,insertProduct,getAllProducts,deleteProductById,updateProduct,
    findProductById,searchProductByName}
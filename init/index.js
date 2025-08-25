const mongoose = require('mongoose')
const initData = require("./Data.js")
const Listing = require('../models/listing.js')
const Mongoose_url = "mongodb://127.0.0.1:27017/wanderlust"

main().then((res) => {
    console.log(res)
}).catch((err) =>{
    console.log(err)
})


async function main(){
    await mongoose.connect(Mongoose_url)
}

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner: "68a2cc05b0e5c1a40c762918"}))
    await Listing.insertMany(initData.data)
    console.log("Data was insilized")
}
initDB()
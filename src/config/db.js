const mongoose = require('mongoose');

const dns = require("dns") //DNS module taaki hum manually reliable DNS servers set kar saken

dns.setServers(['8.8.8.8', '8.8.4.4']) //SRV record lookup ke liye Google DNS force karna, kyunki system ka default DNS block ho raha tha



async function connectDB() {

    try{
        await mongoose.connect(process.env.MONGO_URI)

        console.log("Database connected successfully");
    }catch (err) {
        console.error("Database connection error:", err);
    }
}

module.exports = connectDB

// const mongoose = require("mongoose");

// async function connectDB() {
//     try {
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log("Database connected successfully");
//     } catch (err) {
//         console.error("Database connection error:", err);
//     }
// }

// module.exports = connectDB;
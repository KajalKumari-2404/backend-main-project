// const dns = require('dns');
// dns.setServers(["8.8.8.8", "1.1.1.1"]);

require('dotenv').config(); 


const app = require("./src/app");
const connectDB = require("./src/config/db");

connectDB();



app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
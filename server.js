const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = require('./src/app');
const connectDB = require('./src/db/db');

connectDB()
    .then(() => {
        app.listen(3000,()=>{
            console.log("Server is running on port 3000");
        })
    })
    .catch((err) => {
        console.log("Error in connecting to DB");
        console.log(err);
        process.exit(1);
    })
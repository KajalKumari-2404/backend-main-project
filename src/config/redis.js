const Redis = require("ioredis");

const redisConnection = new Redis({
    host: "127.0.0.1",
    port: 6379,
});

redisConnection.on("connect", () => {
    console.log("Redis Connected Successfully");
});

redisConnection.on("error", (err) => {
    console.log("Redis Error:", err);
});

module.exports = redisConnection;
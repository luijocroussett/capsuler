const {createClient} = require('redis');
const {REDIS_URL} = process.env;

const redisClient = createClient({
    url: REDIS_URL,
});

redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});

(async () => {
    await redisClient.connect();
})();

module.exports = redisClient;
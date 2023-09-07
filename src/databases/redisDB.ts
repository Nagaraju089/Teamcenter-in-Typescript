import Redis from "ioredis"
import dotenv from "dotenv"
dotenv.config({ path: './config.env' });


const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379;

const client = new Redis({
  host: redisHost,
  port: redisPort,
});

client.on('error', (error) => {
  console.error('Failed to connect to Redis server:', error);
});



export async function connect() {
  try {
    await client.ping();
    console.log('Connected to Redis');
    return true;
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    return false;
  }
}

export async function setKey(key: any, value: any) {
  try {
    console.log(key);
    await client.set(key, value, 'EX', 10 * 24 * 60 * 60);

    return 'OK';

  } catch (error) {
    console.error('Failed to set Redis key:', error);
    throw error;
  }
}


export async function getKey(key: any) {
  try {
    return await client.get(key);
  }
  catch (error) {
    console.error('Failed to get Redis key:', error);
  }
}


export async function deleteKey(key: any) {
  try {
    return await client.del(key);
  } catch (error) {
    console.error('Failed to delete Redis key:', error);
    throw error;
  }
}





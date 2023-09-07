import { MongoClient } from 'mongodb'


export let Mongodbclient = new MongoClient(process.env.MONGO_URL as string);

export async function connectToMongoDB() {

  try {
    await Mongodbclient.connect();
    console.log('Connected to MongoDB');
    return Mongodbclient
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}








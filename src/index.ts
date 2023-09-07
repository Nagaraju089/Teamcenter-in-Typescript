import express from "express";
import dotenv from "dotenv";
import path from "path";

import * as mysqlDB from './databases/mysqlDB';
import * as redisDB from './databases/redisDB';
import * as mongoDB from './databases/mongoDB';
import { closeConn } from "./databases/mysqlDB";

import loginRoutes from './routes/loginRoutes';
import userRoutes from './routes/userRoutes';
import clientRoutes from './routes/clientRoutes';
import productsRoutes from './routes/productRoutes';
import docRoutes from './routes/docRoutes';



const app = express()
app.use(express.json());

interface ExpressUrlEncodedOptions {
    extended: boolean;
    limit: number;
    parameterLimit: number;
}

const urlEncodedOptions: ExpressUrlEncodedOptions = {
    extended: false,
    limit: 100,
    parameterLimit: 50,
};

app.use(express.urlencoded(urlEncodedOptions))

// Cross-Origin Resource Sharing 
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "*");

    res.header('Access-Control-Allow-Credentials', "true");
    next();
});

app.use(express.static(path.join(__dirname, 'public')))


app.use('/api/otp', loginRoutes);
app.use('/api', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/documents', docRoutes);

dotenv.config({ path: './.env' });
mysqlDB.connect(process.env.MYSQL_DB_NAME, process.env.MYSQL_DB_USERNAME, process.env.MYSQL_DB_PASSWORD).then((mysqlState: any) => {

    if (mysqlState) {
        redisDB.connect().then((redisState: any) => {
            if (redisState) {
                mongoDB.connectToMongoDB().then((mongoState: any) => {

                    if (mongoState) {

                        const port = process.env.PORT
                        app.listen(port, () => {

                            console.log(`App running on port ${port}...`);
                        })
                    }
                })
            }

        })

    }
})

function signalHandler() {
    closeConn()
}

process.on('SIGINT', signalHandler)
process.on('SIGTERM', signalHandler)
process.on('SIGQUIT', signalHandler)





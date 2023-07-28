import express from "express";
import dotenv from "dotenv"
let mysqlDB = require('./databases/mysqlDB')
import { closeConn } from "./databases/mysqlDB"
let redisDB = require('./databases/redisDB')
import loginRoutes from './routes/loginRoutes'
import userRoutes from './routes/userRoutes'


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
//
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");   //allowing requests from any origin(domai) 
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "*");    /*Sets the value of the Access-Control-Allow-Headers header 
                                                          /to allow any headers in the request*/

    res.header('Access-Control-Allow-Credentials', "true"); //This allows credentials (e.g., cookies, HTTP authentication) to be sent in cross-origin requests
    next();
});

app.use('/api/otp', loginRoutes);
app.use('/api', userRoutes);

dotenv.config({ path: './.env' });
mysqlDB.connect(process.env.MYSQL_DB_NAME, process.env.MYSQL_DB_USERNAME, process.env.MYSQL_DB_PASSWORD).then((mysqlState: any) => {

    if (mysqlState) {
        redisDB.connect(process.env.REDIS_HOST, process.env.REDIS_PORT).then((redisState: any) => {
            if (redisState) {

                const port = process.env.PORT
                app.listen(port, () => {

                    console.log(`App running on port ${port}...`);
                })
            }

        })



    }
})

function signalHandler() {
    closeConn()
    //process.exit()
}

process.on('SIGINT', signalHandler)
process.on('SIGTERM', signalHandler)
process.on('SIGQUIT', signalHandler)





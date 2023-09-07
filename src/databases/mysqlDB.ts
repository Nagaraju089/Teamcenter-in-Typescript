import { Sequelize } from "sequelize"
import dotenv from "dotenv"
import * as users from '../models/users'
import * as clients from '../models/clients'
import * as products from '../models/products'
import * as documents from '../models/documents'

dotenv.config({ path: './.env' })
let sequelize: Sequelize | null
let mysqlConnection: any = null;



const models: { [key: string]: any } = {};

export function connect(databaseName: any, username: any, password: any) {
    return new Promise((resolve) => {
        sequelize = new Sequelize(databaseName, username, password, {
            dialect: 'mysql',
            //syncOnAssociation: true,
            pool: {
                max: 10,
                min: 0
            },
            define: {
                timestamps: false
            }
        })

        models.users = sequelize.define('users', users.getSchema(), users.getTableName())
        models.clients = sequelize.define('clients', clients.getSchema(models.users), clients.getTableName())
        models.products = sequelize.define('products', products.getSchema(models.users), products.getTableName())
        models.documents = sequelize.define('documents', documents.getSchema(models.users), documents.getTableName())


        sequelize.sync({ alter: false }).then((resp) => {
            mysqlConnection = sequelize;
            console.log('Connected to Mysql');
            resolve(true);
        }).catch((error) => {
            console.error('Unable to connect to the mysql db: ', error);
            resolve(false);
        });
    })
}


export function getModels() {
    return models;
};
export function mysqlconn() {
    return mysqlConnection;
};


export function closeConn() {
    return new Promise((resolve) => {
        let conn = mysqlConnection.close();
        console.log("Connection closed successfully")
        resolve(conn ? true : false);
    })
}









import { Sequelize } from "sequelize"
import dotenv from "dotenv"
import User from "../models/users"
import Client from "../models/clients"

dotenv.config({path: './.env'})
let sequelize: Sequelize | null

let mysqlConnection: any = null;

// interface DatabaseModels {
//     users?: typeof User; 
//     clients?: typeof Client
//   }
 
  
let models: { [key: string]: any } = {};
  //let models = {}
 function connect(databaseName: any, username: any, password: any) {
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
        // models.users = User.initModel();
        // models.clients = Client.initModel()
        models.users = sequelize.define('users', User.getSchema())
        models.clients = sequelize.define('cleints', Client.getSchema()) 


        sequelize.sync({ alter: true }).then((resp) => {
            mysqlConnection = resp;
            console.log('Connected to Mysql');
            resolve(true);
        }).catch((error) => {
            console.error('Unable to connect to the mysql db: ', error);
            resolve(false);
        });
    })
}

 function getModels () {
    return models;
};
 function mysqlconn() {
    return mysqlConnection;
};

export function getSequelize() {
   
    return sequelize;
  }

 export function closeConn () {
    return new Promise((resolve) => {
        let conn = mysqlConnection.close();
        console.log("Connection closed successfully")
        resolve(conn ? true : false);
    })
}

module.exports = { connect, getModels, mysqlconn, closeConn, getSequelize }


























// const sequelize = new Sequelize(process.env.MYSQL_DB_NAME, process.env.MYSQL_DB_USERNAME, process.env.MYSQL_DB_PASSWORD, {
//     host: 'localhost',
//     dialect: 'mysql',
//     pool : {
//       max:10,
//       min:0
//     }
//   });
  
//   async function connect() {
//     try {
//       await sequelize.authenticate();
//       console.log('Connected to MySQL database');
//       return true;
//     } catch (error) {
//       console.error('Failed to connect to MySQL database:', error);
//       return false;
//     }
//   }
  
// //   function closeConnection() {
// //     sequelize.close((err) => {
// //       if (err) {
// //         console.error('Error closing MySQL connection:', err);
// //       } else {
// //         console.log('MySQL connection closed.');
// //       }
// //       process.exit(); // Exit the Node.js application
// //     });
// //   }
  
//   module.exports = {
//     connect,sequelize
//   };

  



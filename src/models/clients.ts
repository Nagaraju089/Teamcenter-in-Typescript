import { DataTypes, Model } from 'sequelize';
import { getSequelize } from '../databases/mysqlDB';
import User from './users'

interface ClientAttributes {
  client_id: number;
  client_name: string;
  no_of_products: number | null | undefined;
  created_At: Date;
  created_By: string;
 
}

class Client extends Model<ClientAttributes> implements ClientAttributes {
  
  public client_id!: number;
  public client_name!: string;
  public no_of_products!: number | null;
  public created_At!: Date;
  public created_By!: string;



  public static getSchema() {
    return {
        client_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      client_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      no_of_products: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      created_At: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      created_By: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id'
        }
      },
    };
  }
  static initModel() {
    const sequelize = getSequelize();

    if (!sequelize) {
      throw new Error('Sequelize has not been initialized. Call connect() first.');
    }

    const options = {
      sequelize,
      tableName: 'clients',
      timestamps: false,
    };

    return this.init(this.getSchema(), options);
  }

 
}

export default Client;

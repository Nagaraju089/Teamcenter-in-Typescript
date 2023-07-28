import { DataTypes, Model } from 'sequelize';
import { getSequelize } from '../databases/mysqlDB';

interface UserAttributes {
  user_id: string;
  email: string;
  name: string;
  Role: string;
  isActive?: boolean;
  userType: string;
  photo: string | null;
  token: string | null


}

class User extends Model<UserAttributes> implements UserAttributes {

  public user_id!: string;
  public name!: string;
  public email!: string;
  public isActive?: boolean;
  public Role!: string;
  public userType!: string;
  public photo!: string | null;
  public token!: string | null



  public static getSchema() {
    return {
      user_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1
      },
      Role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      photo: {
        type: DataTypes.STRING,
        defaultValue: false,
      },
      userType: {
        type: DataTypes.STRING,
        defaultValue: 'user',
      },
      token: {
        type: DataTypes.STRING
      },
    };
  }

  // static initModel() {
  //   const sequelize = getSequelize();

  //   if (!sequelize) {
  //     throw new Error('Sequelize has not been initialized. Call connect() first.');
  //   }

  //   const options = {
  //     sequelize,
  //     tableName: 'users',
  //     timestamps: false,
  //   };

  //   return this.init(this.getSchema(), options);
  // }
}
// export async function getTableName() {
//   return { "tablename": 'users'}
// }

export default User;

import { DataTypes } from 'sequelize';

export function getSchema(User: any) {
  return {
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    onBoarding_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    client_id: {
      type: DataTypes.INTEGER,

    },
    created_By: {
      type: DataTypes.STRING,
      references: {
        model: User,
        key: 'name',
        as: "User"
      }
    },
  };

}

export function getTableName() {
  return {
    tableName: 'products'
  };
}


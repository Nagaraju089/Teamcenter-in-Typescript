import { DataTypes } from 'sequelize';

export function getSchema(User: any) {
  return {
    document_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    document_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.STRING,
      allowNull: false,

    },
    released_date: {
      type: DataTypes.DATE,
      allowNull: false

    },

    released_by: {
      type: DataTypes.STRING,
      allowNull: false

    },

    file_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: User,
        key: 'user_id',
        as: "Users"
      },
    },
  };

}

export function getTableName() {
  return { tableName: 'documents' };
}


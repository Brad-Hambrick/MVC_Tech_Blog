const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Post extends Model {}

Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Used data type TEXT in order to have less limit on the characters
        post_content: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        user_id: {
            type: DataTypes.INTEGER,
            references: {
                Model: 'user',
                key: 'id'
            }
        }
    },

    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'post',
    }
);

module.exports = Post;
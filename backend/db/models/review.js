'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(
        models.Spot,
        {
          foreignKey: 'spotId'
        }
      )
      Review.belongsTo(
        models.User,
        {
          foreignKey: 'userId'
        }
      )
      Review.hasMany(
        models.ReviewImage,
        {
          foreignKey: 'reviewId',
          onDelete: 'CASCADE',
          hooks: true
        }
      )
    }
  };
  Review.init({
    id: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      primaryKey: true,
      autoIncrement: true 
    }, 
    spotId: {
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER
    },
    review: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Review text is required"
        }
      }
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        max: {
          args: 5,
          msg: "Stars must be an integer from 1 to 5"
        },
        min: {
          args: 1,
          msg: "Stars must be an integer from 1 to 5"
        },
        isInt: {
          msg: "Stars must be an integer from 1 to 5"
        },
        notNull: {
          msg: "Stars is required"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
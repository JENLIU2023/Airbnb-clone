'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.hasMany(
        models.Review,
        {
          foreignKay: 'spotId',
          onDelete: 'CASCADE',
        }
      )
      Spot.hasMany(
        models.SpotImage,
        {
          foreignKay: 'spotId',
          onDelete: 'CASCADE',
        }
      )
      Spot.hasMany(
        models.Booking,
        {
          foreignKay: 'spotId',
          onDelete: 'CASCADE',
        }
      )
      Spot.belongsTo(
        models.User,
        {
          foreignKey: 'ownerId',
        }
      )
    }
  };
  Spot.init({
    id: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      primaryKey: true,
      autoIncrement: true 
    }, 
    ownerId: {
      type: DataTypes.INTEGER,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Street address is required"
        }
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "City is required"
        }
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "State is required"
        }
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Country is required"
        }
      }
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        max: {
          args: 90,
          msg: "Latitude is not valid"
        },
        min: {
          args: -90,
          msg: "Latitude is not valid"
        },
        isDecimal: {
          msg: "Latitude is not valid"
        },
        notNull: {
          msg: "Latitude is required"
        }
      }
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        max: {
          args: 180,
          msg: "Longitude is not valid"
        },
        min: {
          args: -180,
          msg: "Longitude is not valid"
        },
        isDecimal: {
          msg: "Longitude is not valid"
        },
        notNull: {
          msg: "Longitude is required"
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 50],
          msg: "Name must be less than 50 characters"
        },
        notNull: {
          msg: "Name is required"
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Description is required"
        }
      }
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Price per day is required"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
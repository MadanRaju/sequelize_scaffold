const bcrypt = require('bcrypt-nodejs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emailId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Invalid Email ID',
        },
      },
    },
    mobileNumber: {
      type: DataTypes.STRING,
      validate: {
        isMobilePhone: {
          args: ['any'],
          msg: 'Invalid mobile number',
        },
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [4, 20],
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.VIRTUAL,
      set(value) {
        this.setDataValue('password', value);
        this.setDataValue('passwordHash', value);
      },
      validate: {
        len: {
          args: { min: 8 },
          msg: 'Password must be at least eight characters long.',
        },
        is: {
          args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[`~!@#$%^&*()[\]{}"'<>?])[A-Za-z\d`~!@#$%^&*()[\]{}"'<>?]{8,}$/,
          msg: 'Password must contain at least one uppercase letter,\n'
          + 'contain at least one lowercase letter,\n'
          + 'contain at least one number,\n'
          + 'contain at least one special character from `~!@#$%^&*()[]{}"\'<>?.',
        },
      },
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      enumConfig: {
        name: 'Role',
      },
    },
  }, {
    tableName: 'Users',
    defaultScope: {
      attributes: { exclude: ['password'], include: ['deletedAt'] },
    },
    hooks: {
      beforeSave: (user) => new sequelize.Promise((resolve, reject) => {
        const SALT_FACTOR = 5;

        if (!user.changed('password')) {
          resolve('not modified');
        }

        bcrypt.genSalt(SALT_FACTOR, (saltError, salt) => {
          if (saltError) reject(saltError);
          bcrypt.hash(user.password, salt, null, (hashingError, hashedPassword) => {
            if (hashingError) reject(hashingError);
            user.setDataValue('passwordHash', hashedPassword);
            user.setDataValue('password', undefined);
            resolve('password hashed');
          });
        });
      }),
    },
  });

  User.setup = async (models) => {
    User.belongsTo(models.Enum, {
      as: 'role', where: { type: 'Role' }, targetKey: 'id', foreignKey: 'roleId',
    });
    User.belongsTo(models.User, { as: 'creator', foreignKey: 'createdBy' });
    User.hasMany(models.User, { as: 'createdUsers', foreignKey: 'createdBy' });
  };

  return User;
};

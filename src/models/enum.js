module.exports = (sequelize, DataTypes) => {
  const Enum = sequelize.define('Enum', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'Enums',
    defaultScope: {
      attributes: { include: ['deletedAt'] },
    },
  });

  Enum.setup = async (models) => {
    Enum.hasMany(models.User, {
      as: 'users', foreignKey: 'roleId', where: { type: 'Role' }, sourceKey: 'id',
    });
  };

  return Enum;
};

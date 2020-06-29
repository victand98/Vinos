module.exports = function (sequelize, Sequelize) {

    'use strict';
    var Marca = sequelize.define('marca', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        nombre: {
            type: Sequelize.STRING(50)
        },
        external_id: {
            type: Sequelize.UUID
        },
        estado: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    }, {
        freezeTableName: true,
        timestamps: false
    });

    Marca.associate = function (models) {
        models.marca.hasMany(models.vino, {
            foreignKey: 'id_marca'
        });
    };

    return Marca;
};
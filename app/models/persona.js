module.exports = function (sequelize, Sequelize) {

    var rol = require('../models/rol');
    var Rol = new rol(sequelize, Sequelize);

    //define.- Primer parametro(nombre de la tabla)
    var Persona = sequelize.define('persona', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        nombre: {
            type: Sequelize.STRING(50)
        },
        apellido: {
            type: Sequelize.STRING(50)
        },
        cedula: {
            type: Sequelize.STRING(10),
            unique: true,
            allowNull: false
        },
        external_id: {
            type: Sequelize.UUID
        },
        direccion: {
            type: Sequelize.STRING
        },
        telefono: {
            type: Sequelize.STRING(15)
        },
        estado: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    }, {freezeTableName: true,
        createdAt: 'fecha_reqistro',
        updatedAt: 'fecha_modificacion'});
    //freezeTableName.- Coloca el nombre indicado en la funcion define.
    //timestamps.- Indica si se usa o no created_at y updated_at.

    Persona.belongsTo(Rol, {
        foreignKey: 'id_rol',
        constraints: false
    });

    Persona.associate = function (models) {
        models.persona.hasOne(models.cuenta, {
            foreignKey: 'id_persona'
        });
        models.persona.hasMany(models.venta, {
            foreignKey: 'id_persona'
        });
    };


    return Persona;
};
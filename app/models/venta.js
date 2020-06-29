module.exports = function (sequelize, Sequelize) {

    var persona = require('./persona');
    var Persona = new persona(sequelize, Sequelize);

    var Venta = sequelize.define('venta', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fecha: {
            type: Sequelize.DATE
        },
        subtotal: {
            type: Sequelize.DOUBLE
        },
        iva: {
            type: Sequelize.DOUBLE
        },
        total: {
            type: Sequelize.DOUBLE
        },
        descuento: {
            type: Sequelize.DOUBLE
        }
    }, {
        freezeTableName: true,
        timestamps: false
    });

    Venta.associate = function (models) {
        models.venta.hasMany(models.detalle_vino, {
            foreignKey: 'id_venta'
        });
    };

    Venta.belongsTo(Persona, {
        foreignKey: 'id_persona',
        constraint: false
    });

    return Venta;
};
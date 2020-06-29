module.exports = function (sequelize, Sequelize) {

    var venta = require('./venta');
    var Venta = new venta(sequelize, Sequelize);
    var vino = require('./vino');
    var Vino = new vino(sequelize, Sequelize);

    var DetalleVino = sequelize.define('detalle_vino', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        cantidad: {
            type: Sequelize.DOUBLE
        },
        precioUnitario:{
            type: Sequelize.DOUBLE
        },
        precioTotal:{
            type: Sequelize.DOUBLE
        }
    }, {
        freezeTableName: true,
        timestamps: false
    });

    DetalleVino.belongsTo(Venta, {
        foreignKey: 'id_venta',
        constraints: false
    });
    DetalleVino.belongsTo(Vino, {
        foreignKey: 'id_vino',
        constraints: false
    });

    return DetalleVino;
};
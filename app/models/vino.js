module.exports = function (sequelize, Sequelize) {

    var marca = require('./marca');
    var Marca = new marca(sequelize, Sequelize);

    var Vino = sequelize.define('vino', {
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
        fecha_creacion: {
            type: Sequelize.DATE
        },
        tipo: {
            type: Sequelize.STRING(30)
        },
        cantidad: {
            type: Sequelize.DOUBLE
        },
        precio: {
            type: Sequelize.DOUBLE
        },
        pais: {
            type: Sequelize.STRING(50)
        },
        foto: {
            type: Sequelize.STRING
        }
    }, {
        freezeTableName: true,
        timestamps: false
    });

    Vino.belongsTo(Marca, {
        foreignKey: 'id_marca',
        constraints: false
    });


    Vino.associate = function (models) {
        models.vino.hasMany(models.detalle_vino, {
            foreignKey: 'id_vino'
        });
    };
    
    return Vino;
};
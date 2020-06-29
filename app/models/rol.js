module.exports = function (sequelize, Sequelize) {
    //define.- Primer parametro(nombre de la tabla)
    var Rol = sequelize.define('rol', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        nombre: {
            type: Sequelize.STRING(20)
        }
    }, {freezeTableName: true, timestamps: false});
    //freezeTableName.- Coloca el nombre indicado en la funcion define.
    //timestamps.- Indica si se usa o no created_at y updated_at.
    Rol.associate = function (models) {
        models.rol.hasMany(models.persona, {
            foreignKey: "id_rol"
        });
    };
    return Rol;
};
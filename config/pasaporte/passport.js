var bCrypt = require('bcrypt-nodejs');
const uuidv4 = require('uuid/v4');
module.exports = function (passport, cuenta, persona, rol) {
    var Persona = persona;
    var Cuenta = cuenta;
    var Rol = rol;
    var LocalStrategy = require('passport-local').Strategy;

    //serializeUser.- Obtiene el id de un objeto
    passport.serializeUser(function (cuenta, done) {
        done(null, cuenta.id);
    });

    //deserializeUser.- Descifrar un objeto
    passport.deserializeUser((id, done) => {
        //Consultar la cuenta de usuario
        //include.- Incluye objetos dentrpassporto de la consulta
        Cuenta.findOne({where: {id: id}, include: [{model: Persona, include: {model: Rol}}]}).then((cuenta) => {
            if (cuenta) {
                var usuarioInfo = {
                    id: cuenta.id,
                    id_cuenta: cuenta.external_id,
                    id_persona: cuenta.persona.external_id,
                    nombre: cuenta.persona.nombre + ' ' + cuenta.persona.apellido,
                    rol: cuenta.persona.rol.nombre
                };
//                console.log(usuarioInfo);
                done(null, usuarioInfo);
            } else {
                //cuenta.errors.- Permite ver que errores hubo en la consulta
                done(cuenta.errors, null);
            }
        });
    });

    // Registro
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'correo',
        passwordField: 'cedula',
        passReqToCallback: true 
    }, function (req, email, password, done) {
        // Encriptar Clave
        var generateHash = function (password) {
            //hashSync.- Hasta que no termine, no ejecuta la siguiente linea
            return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
        };

        //Creación de Roles
        var modeloCuenta = [
            {nombre: 'Administrador'},
            {nombre: 'Usuario'}
        ];
        Rol.findOne({where: {nombre: 'Administrador'}}).then((rol) => {
            if (!rol) {
                Rol.bulkCreate(modeloCuenta);
            }
        });

        //Creación de Usuario
        Persona.findOne({
            where: {
                cedula: password
            }
        }).then(function (persona) {
            if (persona) {
                //message : req.flash()
                return done(null, false);
            } else {
                var clave = generateHash(password);
                Rol.findOne({
                    where: {nombre: 'Usuario'}
                }).then(rol => {
                    if (rol) {
                        var modeloPersona = {
                            nombre: req.body.nombre,
                            apellido: req.body.apellido,
                            cedula: req.body.cedula,
                            external_id: uuidv4(),
                            direccion: req.body.direccion,
                            telefono: req.body.telefono,
                            id_rol: rol.id
                        };
                        Persona.create(modeloPersona).then(function (newPersona, created) {
                            if (!newPersona) {
                                return done(null, false);
                            } else if (newPersona) {
                                console.log('Se ha creado la Persona.');
                                var modeloCuenta = {
                                    external_id: uuidv4(),
                                    correo: email,
                                    clave: clave,
                                    id_persona: newPersona.id
                                };
                                Cuenta.create(modeloCuenta).then(function (newCuenta, created) {
                                    if (!newCuenta) {
                                        console.log('No se pudo crear la Cuenta.');
                                        return done(null, false);
                                    } else if (newCuenta) {
                                        console.log('Se ha creado la Cuenta.');
                                        done(null, newCuenta);
                                    }
                                });
                            }
                        });
                    } else {
                        return done(null, false);
                    }
                });
            }
        });
    }));

    //Inicio Sesion
    passport.use('local-signin', new LocalStrategy({
        usernameField: 'correo',
        passwordField: 'clave',
        passReqToCallback: true
    }, function (req, email, password, done) {
        var Cuenta = cuenta;

        var validarContraseña = function (userPassword, password) {
            return bCrypt.compareSync(password, userPassword);
        };

        Cuenta.findOne({
            where: {correo: email}
        }).then((cuenta) => {
            if (!cuenta) {
                return done(null, false, {message: 'No se encontró la cuenta'});

            }
            if (!validarContraseña(cuenta.clave, password)) {
                return done(null, false, {message: 'La contraseña ingresada es incorrecta'});
            }
            cuentaInfo = cuenta.get();
            return done(null, cuentaInfo);
        }).catch(function (err) {
            return done(null, false, {message: 'Ha ocurrido un error.'});
        });
    }));
};
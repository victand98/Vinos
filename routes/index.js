var express = require('express');
var autentificacion = require('../app/controller/AutentificacionControllers');
var passport = require('passport');
var router = express.Router();

// controllers
var marca = require('../app/controller/marca-controller');
var marcaController = new marca();
var vino = require('../app/controller/vino-controller');
var vinoController = new vino();
var pago = require('../app/controller/pago-controller');
var pagoController = new pago();
var carrito = require('../app/controller/carrito-controller');
var carritoController = new carrito();
var venta = require('../app/controller/ventaController');
var ventaController = new venta();

// Middleware de Autorización
var auth = function middleware(req, res, next) {
    if (req.isAuthenticated()) {
        //Se debe realizar la validación de los roles en cada url, se puede hacer mediante un arreglo.
        next();
    } else {
        req.flash('info', 'Se necesita primeramente iniciar sesión.', false);
        res.redirect('/ingresar');
    }
};


// Página Principal
/* GET Página Principal */
router.get('/', function (req, res, next) {
    res.render('index', {titulo: 'Vinos Maria', login: req.isAuthenticated()});
});

// Página de Inicio de Sesión
/* GET Página Inicio de Sesión */
router.get('/ingresar', autentificacion.signin);

/* POST Página Inicio de Sesión */
router.post('/ingresar', passport.authenticate('local-signin', {
    successRedirect: '/administracion',
    failureRedirect: '/ingresar',
    failureFlash: true
}));

// Página de Registro
/* GET Página Registro */
router.get('/registro', autentificacion.signup);

/* POST Página Registro */
router.post('/registro', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/registro',
    failureFlash: true
}));

// Página Administración
/* GET Página Administracion */
router.get('/administracion', /*auth,*/ vinoController.cargarPrincipal);

/* GET Página Marca */
router.get('/administracion/marca', marcaController.cargarVista);

/* POST Guardar Marca */
router.post('/administracion/marca', marcaController.guardar);

/* POST Modificar Marca */
router.post('/administracion/marcaModificar', marcaController.modificar);

/* GET Página Foto */
router.get('/administracion/vino/foto/:external', vinoController.verFoto);

/* POST Guardar Foto */
router.post('/administracion/vino/foto/guardar', vinoController.guardarImagen);

/* GET Página Vino */
router.get('/administracion/vino', vinoController.cargarVista);
router.get('/administracion/ver_vino', vinoController.cargarVino);

/* POST Guardar Vino */
router.post('/administracion/vino', vinoController.guardar);

/* POST Modificar Vino */
router.post('/administracion/vinoModificar', vinoController.modificar);

/* GET Agregar item al Carrito */
router.get('/agregar:external_id', carritoController.cargarItem);

/* GET Quitar Item del Carrito */
router.get('/quitar:external_id', carritoController.quitarItem);

/* GET Mostrar Carrito*/
router.get('/listarCarrito', carritoController.mostrarCarro);

/* GET Cerrar Sesión*/
router.get('/salir', autentificacion.logout);

/* GET Comprar*/
router.get('/comprar', pagoController.cargarVista);

/* POST Comprar*/
router.post('/comprar', ventaController.guardar);

/* POST Checkout*/
router.post('/pagar', pagoController.cargarCheckOut);

/* GET Payment Status*/
router.get('/resultado', pagoController.obtenerResultado);

module.exports = router;
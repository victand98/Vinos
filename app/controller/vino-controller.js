'use strict';
var models = require('../models/index');
var Vino = models.vino;
var Marca = models.marca;
var uuidv4 = require('uuid/v4');

// Manejo de archivo
var fs = require('fs');
// 1MB en bits
var maxFileSize = 1 * 1024 * 1024;
// Extensiones de archivo
var extensiones = ["jpg", "png", "jpeg"];
var formidable = require('formidable');

class VinoController {
    cargarVista(req, res) {
        Vino.findAll({ include: [{ model: Marca, required: true }] }).then(listaVino => {
            if (listaVino) {
                Marca.findAll().then(listaMarca => {
                    res.render('administrador', {
                        titulo: 'Vinos Maria | Vinos', fragmento: 'fragments/frm_vino',
                        listaMarca: listaMarca, listaVino: listaVino
                    });
                });
            } else {
                console.log(listaVino.errors);
            }
        });
    }
    cargarVino(req, res) {
        Vino.findAll({ include: [{ model: Marca, required: true }] }).then(listaVino => {
            if (listaVino) {
                req.status('200').json(listaVino);
            }
        });
    }
    cargarPrincipal(req, res) {
        Vino.findAll({ include: [{ model: Marca, required: true }] }).then(listaVino => {
            if (listaVino) {
                if (req.session.carrito === undefined) {
                    req.session.carrito = [];
                }
                res.render('administrador', {
                    titulo: 'Vinos Maria | Administración', fragmento: 'fragments/frm_principal',
                    listaVino: listaVino
                });
            }
        }).catch(err => {
            console.log(err);
        });
    }

    verFoto(req, res) {
        res.render('administrador', {
            titulo: 'Vinos Maria | Fotos', fragmento: 'fragments/frmFoto',
            /*rol: req.user.rol,*/ external: req.params.external
        });
    }

    guardar(req, res) {
        Vino.findOne({ where: { nombre: req.body.nombreVino } }).then(vino => {
            if (vino) {
                req.flash('info', 'La vino ya está ingresado.', false);
                res.redirect('/administracion/vino');
            } else {
                var modeloVino = {
                    nombre: req.body.nombreVino,
                    external_id: uuidv4(),
                    fecha_creacion: req.body.fecha,
                    tipo: req.body.tipo,
                    cantidad: req.body.cantidad,
                    precio: req.body.precio,
                    pais: req.body.pais,
                    foto: "Vino.png",
                    id_marca: req.body.marca
                };
                Vino.create(modeloVino).then(newVino => {
                    if (!newVino) {
                        req.flash('info', 'Ocurrió un error al registrar la vino.', false);
                    } else if (newVino) {
                        req.flash('info', 'Se registró el vino con éxito.', false);
                    }
                    res.redirect('/administracion/vino');
                });
            }
        });
    }

    modificar(req, res) {
        var modeloVino = {
            nombre: req.body.nombreVino,
            fecha_creacion: req.body.fecha,
            tipo: req.body.tipo,
            cantidad: req.body.cantidad,
            precio: req.body.precio,
            pais: req.body.pais,
            id_marca: req.body.marca
        };
        Vino.update(modeloVino, { where: { external_id: req.body.external } }).then(newVino => {
            if (newVino == 0) {
                req.flash('info', 'No se ha realizado ninguna Modificación.', false);
            } else {
                req.flash('info', 'Se modificó el vino con éxito.', false);
            }
            res.redirect('/administracion/vino');
        });
    }

    // Guardar Imagen
    guardarImagen(req, res) {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var extension = files.archivo.name.split(".").pop().toLowerCase();
            if (extensiones.includes(extension)) {
                // pop.- obtiene el ultimo dato del arreglo
                if (files.archivo.size <= maxFileSize) {
                    var nombre = fields.external_foto + "." + extension;
                    fs.rename(files.archivo.path, "public/img/" + nombre, function (err) {
                        if (err)
                            next(err);
                        Vino.update({
                            foto: nombre
                        }, { where: { external_id: fields.external_foto } }).then(function (updatedVino, created) {
                            if (updatedVino) {
                                req.flash('info', 'Se ha modificado correctamente', false);
                            }
                            res.redirect('/administracion/vino');
                        });
                    });
                } else {
                    VinoController.eliminar(files.archivo.path);
                    req.flash('info', 'Error, el archivo es demasiado grande.', false);
                    res.redirect('/administracion/vino/foto/' + fields.external_foto);
                    console.log('Error, el archivo es demasiado grande.');
                }
            } else {
                VinoController.eliminar(files.archivo.path);
                req.flash('info', 'Error de extensión, solamente se admite imágenes.', false);
                res.redirect('/administracion/vino/foto/' + fields.external_foto);
                console.log('Error de extensión, solamente se admite imágenes.');
            }
        });
    }

    static eliminar(link) {
        fs.exists(link, function (exists) {
            if (exists) {
                console.log("file exists Deleting now...");
                fs.unlinkSync(link);
            } else {
                console.log("No se borro" + link);
            }
        });
    }
}

module.exports = VinoController;
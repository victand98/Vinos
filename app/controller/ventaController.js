'use strict';
var models = require('../models/index');
var Persona = models.persona;
var Venta = models.venta;
var Vino = models.vino;
var Detalle = models.detalle_vino;
class VentaController {
    guardar(req, res) {
        var carrito = req.session.carrito;
        Persona.findOne({ where: { external_id: req.user.id_persona } }).then(function (persona) {
            if (persona) {
                var modeloVenta = {
                    fecha: new Date(),
                    subtotal: req.body.subtotal,
                    iva: req.body.iva,
                    total: req.body.total,
                    descuento: req.body.descuento,
                    id_persona: persona.id
                };
                Venta.create(modeloVenta).then(function (newVenta) {
                    if (!newVenta) {
                        req.flash('info', 'No se ha completado su compra.', false);
                        res.redirect('/comprar');
                    } else {
                        var detalle = [];
                        for (let item of carrito) {
                            var modeloDetalle = {
                                cantidad: item.cantidad,
                                precioUnitario: item.precio,
                                precioTotal: item.precio_total,
                                id_venta: newVenta.id,
                                id_vino: item.id
                            };
                            detalle.push(modeloDetalle);
                        };
                        Detalle.bulkCreate(detalle).then(() => {
                            return Detalle.findAll({ where: { id_venta: newVenta.id } }).then(detalles => {
                                detalles.forEach(function (item) {
                                    Vino.findOne({ where: { id: item.id_vino } }).then(function (vino) {
                                        Vino.update({ cantidad: vino.cantidad - item.cantidad }, { where: { id: item.id_vino } });
                                    });
                                });
                                req.session.carrito = [];
                                req.flash('info', 'Se ha completado su compra.', false);
                                res.redirect('/administracion');
                            });
                        });
                    }
                });
            }
        });
    }
}
module.exports = VentaController;
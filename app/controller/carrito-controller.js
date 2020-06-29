'use strict';
var models = require('../models/index');
var Vino = models.vino;
var Marca = models.marca;
class CarritoController {
    mostrarCarro(req, res){
        res.status(200).json(req.session.carrito);
    }
    
    cargarItem(req, res) {
        var carrito = req.session.carrito;
        var external = req.params.external_id;
        Vino.findOne({where: {external_id: external}, include: [{model: Marca, required: true}]})
                .then(vino => {
                    if (vino) {
                        var pos = CarritoController.verificar(carrito, external);
                        if (pos == -1) {
                            var datos = {
                                id: vino.id,
                                external_id: external,
                                nombre: vino.nombre,
                                cantidad: 1,
                                precio: vino.precio,
                                precio_total: vino.precio,
                                marca: vino.marca.nombre
                            };
                            carrito.push(datos);
                        } else {
                            var data = carrito[pos];
                            data.cantidad = data.cantidad + 1;
                            data.precio_total = data.precio * data.cantidad;
                            carrito[pos] = data;
                        }
                        req.session.carrito = carrito;
                        console.log(req.session.carrito);
                        res.status(200).json(req.session.carrito);
                    } else {
                        res.status(500).json('No se ha podido añadir al carrito de compras');
                    }
                }).catch(err => {
            res.status(500).json(err);
        });
    }

    quitarItem(req, res) {
        var carrito = req.session.carrito;
        var external = req.params.external_id;
        var pos = CarritoController.verificar(carrito, external);
        var data = carrito[pos];
        if (data.cantidad > 1) {
            data.cantidad = data.cantidad - 1;
            data.precio_total = data.cantidad * data.precio;
            carrito[pos] = data;
            req.session.carrito = carrito;
            res.status(200).json(req.session.carrito);
        } else {
            var aux = [];            
            for(var i = 0; i < carrito.length; i++) {
                var items = carrito[i];
                if(items.external_id != external) {
                    aux.push(items);
                }
            }
            req.session.carrito = aux;
            res.status(200).json(req.session.carrito);
        }
    }

    static verificar(lista, external) {
        var pos = -1;
        for (var i = 0; i < lista.length; i++) {
            if (lista[i].external_id == external) {
                pos = i;
                break;
            }
        }
        return pos;
    }
}

module.exports = CarritoController;
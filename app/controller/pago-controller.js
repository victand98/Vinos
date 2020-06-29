'use strict';
var https = require('https');
var querystring = require('querystring');
var models = require('../models/index');
var Vino = models.vino;

class PagoController {
    cargarVista(req, res) {
        Vino.findAll().then(listaVino => {
            if (listaVino) {
                res.render('administrador', {titulo: 'Realizar Compra', fragmento: 'fragments/frm_comprar',
                    listaVino: listaVino});
            } else {
                console.log(listaVino.errors);
            }
        });
    }

    cargarCheckOut(req, res) {
        var total = req.body.total;
        if(total > 0){
            PagoController.request(total, function (responseData) {
                console.log(responseData);
                res.render('administrador', {titulo: 'Realizar Pago', fragmento: 'fragments/frm_pagar', detalle: req.body,
                    Checkout: responseData.id});
            });
        }else{
            req.flash('info', 'Es necesario que agrege algunos productos para poder realizar un pago.', false);
            res.redirect('/administracion');
        }
    }

    obtenerResultado(req, res){
        PagoController.result(req.query.id, function(responseData){
            console.log(responseData);
            res.render('administrador', {titulo: 'Detalles de la transacción', fragmento: 'fragments/frm_resultado',
            estado: JSON.stringify(responseData)});
        });
    }
    
    static request(amount, callback) {
        var path = '/v1/checkouts';
        var data = querystring.stringify({
            'authentication.userId': '8a8294175d602369015d73bf00e5180c',
            'authentication.password': 'dMq5MaTD5r',
            'authentication.entityId': '8a8294175d602369015d73bf009f1808',
            'amount': amount,
            'currency': 'USD',
            'paymentType': 'DB'
        });
        var options = {
            port: 443,
            host: 'test.oppwa.com',
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': data.length
            }
        };
        var postRequest = https.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                var jsonRes = JSON.parse(chunk);
                return callback(jsonRes);
            });
        });
        postRequest.write(data);
        postRequest.end();
    }

    static result(id, callback){
        var path = '/v1/checkouts/'+ id +'/payment';
        path += '?authentication.userId=8a8294175d602369015d73bf00e5180c';
        path += '&authentication.password=dMq5MaTD5r';
        path += '&authentication.entityId=8a8294175d602369015d73bf009f1808';
        var options = {
            port: 443,
            host: 'test.oppwa.com',
            path: path,
            method: 'GET',
        };
        var postRequest = https.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                var jsonRes = JSON.parse(chunk);
                return callback(jsonRes);
            });
        });
        postRequest.end();
    }
}

module.exports = PagoController;
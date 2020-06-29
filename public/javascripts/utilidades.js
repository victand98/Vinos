$().ready(function () {
    // other methods
    $.validator.addMethod("lettersonly", function (value, element) {
        return this.optional(element) || /^[a-z ñá-ú]+$/i.test(value.trim());
    });

    $.validator.addMethod("cedula", function (value) {
        return validarCedula(value);
    });

    // messages
    $.extend($.validator.messages, {
        required: 'El campo es obligatorio.',
        email: 'El email ingresado no es válido.',
        lettersonly: 'El campo no puede llevar números ni quedar vacío.',
        cedula: 'La cédula ingresada no es válida.',
        number: 'El campo debe ser numérico.'
    });

    // validate signup form on keyup and submit
    $('.formulario').each(function () {
        $(this).validate({
            rules: {
                correo: {
                    required: true,
                    email: true
                },
                clave: "required",
                nombre: {
                    required: true,
                    lettersonly: true
                },
                apellido: {
                    required: true,
                    lettersonly: true
                },
                cedula: {
                    required: true,
                    cedula: true
                },
                telefono: {
                    required: true
                },
                direccion: 'required',
                nombreMarca: 'required',
                nombreVino: 'required',
                fecha: 'required',
                cantidad: {
                    required: true,
                    number: true
                },
                precio: {
                    required: true,
                    number: true
                },
                foto: 'required',
                tipo: 'required',
                pais: 'required',
                marca: 'required'
            }
        });
    });
});

function validarCedula(cedula) {
    var cad = cedula.trim();
    var total = 0;
    var longitud = cad.length;
    var longcheck = longitud - 1;
    var flag = false;
    if (cad !== "" && longitud === 10) {
        for (var i = 0; i < longcheck; i++) {
            if (i % 2 === 0) {
                var aux = cad.charAt(i) * 2;
                if (aux > 9)
                    aux -= 9;
                total += aux;
            } else {
                total += parseInt(cad.charAt(i)); // parseInt o concatenará en lugar de sumar
            }
        }

        total = total % 10 ? 10 - total % 10 : 0;

        if (cad.charAt(longitud - 1) == total) {
            flag = true;
        }
    }
    return flag;
}
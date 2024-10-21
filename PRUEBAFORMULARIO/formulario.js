class FormularioValidaciones {
    constructor() {
        this.formulario = document.getElementById('registroForm');
        this.errores = {};

        // Asociar eventos a los campos individuales
        this.asignarEventos();

        // Asociar el evento submit
        this.formulario.addEventListener('submit', (e) => this.validarFormulario(e));

        // Asociar el evento click al botón Limpiar
        document.getElementById('btnLimpiar').addEventListener('click', () => this.limpiarFormulario());
    }

    asignarEventos() {
        // Validar y habilitar Tipo de Documento después de Número de Documento
        this.formulario.numeroDocumento.addEventListener('blur', () => {
            this.validarNumeroDocumento();
            if (!(this.errores.numeroDocumento)) {
                this.formulario.tipoDocumento.disabled = false;
            } else {
                this.formulario.tipoDocumento.disabled = true;
            }
        });

        // Validar y habilitar Nombre y Apellido después de Tipo de Documento
        this.formulario.tipoDocumento.addEventListener('change', () => {
            this.validarTipoDocumento();
            if (!(this.errores.tipoDocumento)) {
                this.formulario.nombreApellido.disabled = false;
            } else {
                this.formulario.nombreApellido.disabled = true;
            }
        });

        // Validar y habilitar Género después de Nombre y Apellido
        this.formulario.nombreApellido.addEventListener('blur', () => {
            this.validarNombreApellido();
            if (!(this.errores.nombreApellido)) {
                this.formulario.genero.disabled = false;
            } else {
                this.formulario.genero.disabled = true;
            }
        });

        // Validar y habilitar Fecha de Nacimiento después de Género
        this.formulario.genero.addEventListener('change', () => {
            this.validarGenero();
            if (!(this.errores.genero)) {
                this.formulario.fechaNacimiento.disabled = false;
            } else {
                this.formulario.fechaNacimiento.disabled = true;
            }
        });

        // Calcular edad al seleccionar Fecha de Nacimiento y validar
        this.formulario.fechaNacimiento.addEventListener('change', () => {
            this.validarFechaNacimiento();
            if (!(this.errores.fechaNacimiento)) {
                this.calcularEdad();
                this.validarEdad();
                if (!(this.errores.edad)) {
                    this.habilitarHobbies(true);
                } else {
                    this.habilitarHobbies(false);
                }
            } else {
                this.formulario.edad.value = '';
                this.habilitarHobbies(false);
            }
        });

        // Validar el campo de color favorito
        this.formulario.colorFavorito.addEventListener('change', () => {
            this.validarColorFavorito();
        });

        // Validar y habilitar Habilidades después de Hobbies
        const hobbies = Array.from(document.getElementsByName('hobby'));
        hobbies.forEach(hobby => {
            hobby.addEventListener('change', () => {
                this.validarHobby();
                if (!(this.errores.hobby)) {
                    this.habilitarHabilidades(true);
                } else {
                    this.habilitarHabilidades(false);
                }
            });
        });

        // Validar y habilitar Número de Teléfono después de Habilidades
        const habilidades = Array.from(document.getElementsByName('habilidades'));
        habilidades.forEach(habilidad => {
            habilidad.addEventListener('change', () => {
                this.validarHabilidades();
                if (!(this.errores.habilidades)) {
                    this.formulario.numeroTelefono.disabled = false;
                } else {
                    this.formulario.numeroTelefono.disabled = true;
                }
            });
        });

        // Validar y habilitar Correo Electrónico después de Número de Teléfono
        this.formulario.numeroTelefono.addEventListener('blur', () => {
            this.validarNumeroTelefono();
            if (!(this.errores.numeroTelefono)) {
                this.formulario.correoElectronico.disabled = false;
            } else {
                this.formulario.correoElectronico.disabled = true;
            }
        });

        // Validar y habilitar Contraseña después de Correo Electrónico
        this.formulario.correoElectronico.addEventListener('blur', () => {
            this.validarCorreoElectronico();
            if (!(this.errores.correoElectronico)) {
                this.formulario.contraseña.disabled = false;
            } else {
                this.formulario.contraseña.disabled = true;
            }
        });

        this.formulario.contraseña.addEventListener('blur', () => {
            this.validarContraseña();
        });
    }

    validarFormulario(e) {
        e.preventDefault(); // Evitar el envío del formulario hasta que sea válido

        // Ejecutar todas las validaciones una vez más
        this.validarNumeroDocumento();
        this.validarTipoDocumento();
        this.validarNombreApellido();
        this.validarGenero();
        this.validarFechaNacimiento();
        this.calcularEdad();
        this.validarEdad();
        this.validarHobby();
        this.validarHabilidades();
        this.validarNumeroTelefono();
        this.validarCorreoElectronico();
        this.validarContraseña();
        this.validarColorFavorito(); // Validar el color seleccionado

        // Mostrar errores o mensaje de éxito
        if (Object.keys(this.errores).length === 0) {
            const datosJSON = this.obtenerDatosFormularioJSON();
            console.log('Datos del formulario en formato JSON:', datosJSON);
            document.getElementById('mensajeExito').textContent = 'Formulario enviado con éxito.';
            console.log('Formulario válido');
        } else {
            document.getElementById('mensajeExito').textContent = '';
            console.log('Errores:', JSON.stringify(this.errores));
        }
    }

    obtenerDatosFormularioJSON() {
        const formulario = this.formulario;
        const datos = {
            numeroDocumento: formulario.numeroDocumento.value.trim(),
            tipoDocumento: formulario.tipoDocumento.value,
            nombreApellido: formulario.nombreApellido.value.trim(),
            genero: formulario.genero.value,
            fechaNacimiento: formulario.fechaNacimiento.value,
            edad: formulario.edad.value,
            colorFavorito: formulario.colorFavorito.value, // Incluir el color en el JSON
            hobby: formulario.hobby.value,
            habilidades: Array.from(formulario.habilidades)
                .filter(habilidad => habilidad.checked)
                .map(habilidad => habilidad.value),
            numeroTelefono: formulario.numeroTelefono.value.trim(),
            correoElectronico: formulario.correoElectronico.value.trim(),
            contraseña: formulario.contraseña.value
        };

        // Convertir el objeto de datos a una cadena JSON
        const datosJSON = JSON.stringify(datos);
        return datosJSON;
    }

    limpiarFormulario() {
        // Reiniciar el formulario
        this.formulario.reset();

        // Limpiar mensajes de error
        const errores = this.formulario.querySelectorAll('.error');
        errores.forEach(error => {
            error.textContent = '';
        });

        // Limpiar mensaje de éxito
        document.getElementById('mensajeExito').textContent = '';

        // Reiniciar el objeto de errores
        this.errores = {};

        // Deshabilitar campos excepto el primero
        this.desactivarCampos();

        // Volver a asociar los eventos
        this.asignarEventos();
    }

    desactivarCampos() {
        // Deshabilitar todos los campos excepto el número de documento
        this.formulario.tipoDocumento.disabled = true;
        this.formulario.nombreApellido.disabled = true;
        this.formulario.genero.disabled = true;
        this.formulario.fechaNacimiento.disabled = true;
        this.formulario.edad.disabled = true;
        this.habilitarHobbies(false);
        this.habilitarHabilidades(false);
        this.formulario.numeroTelefono.disabled = true;
        this.formulario.correoElectronico.disabled = true;
        this.formulario.contraseña.disabled = true;
    }

    mostrarError(campo, mensaje) {
        this.errores[campo] = mensaje;
        document.getElementById(`error${campo.charAt(0).toUpperCase() + campo.slice(1)}`).textContent = mensaje;
    }

    limpiarError(campo) {
        delete this.errores[campo];
        document.getElementById(`error${campo.charAt(0).toUpperCase() + campo.slice(1)}`).textContent = '';
    }

    validarNumeroDocumento() {
        const campo = 'numeroDocumento';
        const valor = this.formulario[campo].value.trim();
        const pattern = /^\d{10,}$/;

        if (!pattern.test(valor)) {
            this.mostrarError(campo, 'El número de documento debe tener al menos 10 dígitos numéricos.');
        } else {
            this.limpiarError(campo);
        }
    }

    validarTipoDocumento() {
        const campo = 'tipoDocumento';
        const valor = this.formulario[campo].value;

        if (!valor) {
            this.mostrarError(campo, 'Debe seleccionar un tipo de documento.');
        } else {
            this.limpiarError(campo);
        }
    }

    validarNombreApellido() {
        const campo = 'nombreApellido';
        const valor = this.formulario[campo].value.trim();
        const pattern = /^[A-Za-z\s]{3,}$/;

        if (!pattern.test(valor)) {
            this.mostrarError(campo, 'El nombre debe contener solo letras y tener al menos 3 caracteres.');
        } else {
            this.limpiarError(campo);
        }
    }

    validarGenero() {
        const campo = 'genero';
        const valor = this.formulario[campo].value;

        if (!valor) {
            this.mostrarError(campo, 'Debe seleccionar un género.');
        } else {
            this.limpiarError(campo);
        }
    }

    validarFechaNacimiento() {
        const campo = 'fechaNacimiento';
        const valor = this.formulario[campo].value;

        if (!valor) {
            this.mostrarError(campo, 'Debe ingresar una fecha válida.');
        } else {
            this.limpiarError(campo);
        }
    }

    calcularEdad() {
        const fechaNacimiento = new Date(this.formulario.fechaNacimiento.value);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        const mes = hoy.getMonth() - fechaNacimiento.getMonth();

        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
            edad--;
        }

        this.formulario.edad.value = edad;
    }

    validarEdad() {
        const campo = 'edad';
        const edad = parseInt(this.formulario[campo].value);
        const tipoDocumento = this.formulario.tipoDocumento.value;

        if (isNaN(edad) || edad < 0) {
            this.mostrarError(campo, 'Edad no válida.');
        } else {
            if (tipoDocumento === 'ti' && edad > 17) {
                this.mostrarError(campo, 'Con Tarjeta de Identidad la edad debe ser menor o igual a 17 años.');
            } else if (tipoDocumento === 'cc' && edad < 18) {
                this.mostrarError(campo, 'Con Cédula de Ciudadanía debe ser mayor o igual a 18 años.');
            } else {
                this.limpiarError(campo);
            }
        }
    }

    validarHobby() {
        const campo = 'hobby';
        const opciones = document.getElementsByName(campo);

        if (!this.algunRadioSeleccionado(opciones)) {
            this.mostrarError(campo, 'Debe seleccionar al menos un hobby.');
        } else {
            this.limpiarError(campo);
        }
    }

    validarHabilidades() {
        const campo = 'habilidades';
        const opciones = document.getElementsByName(campo);

        if (!this.algunCheckboxSeleccionado(opciones)) {
            this.mostrarError(campo, 'Debe seleccionar al menos una habilidad.');
        } else {
            this.limpiarError(campo);
        }
    }

    validarNumeroTelefono() {
        const campo = 'numeroTelefono';
        const valor = this.formulario[campo].value.trim();
        const pattern = /^\d{10}$/;

        if (!pattern.test(valor)) {
            this.mostrarError(campo, 'El número de teléfono debe tener exactamente 10 dígitos numéricos.');
        } else {
            this.limpiarError(campo);
        }
    }

    validarCorreoElectronico() {
        const campo = 'correoElectronico';
        const valor = this.formulario[campo].value.trim();
        const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!pattern.test(valor)) {
            this.mostrarError(campo, 'Debe ingresar un correo electrónico válido.');
        } else {
            this.limpiarError(campo);
        }
    }

    validarContraseña() {
        const campo = 'contraseña';
        const valor = this.formulario[campo].value;
        const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[#\$*]).{8,}$/;

        if (!pattern.test(valor)) {
            this.mostrarError(campo, 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (#, $, *).');
        } else {
            this.limpiarError(campo);
        }
    }

    validarColorFavorito() {
        const campo = 'colorFavorito';
        const valor = this.formulario[campo].value;

        if (!valor) {
            this.mostrarError(campo, 'Debe sel  eccionar un color favorito.');
        } else {
            this.limpiarError(campo);
        }
    }

    habilitarHobbies(estado) {
        const hobbies = document.getElementsByName('hobby');
        hobbies.forEach(hobby => {
            hobby.disabled = !estado;
        });
    }

    habilitarHabilidades(estado) {
        const habilidades = document.getElementsByName('habilidades');
        habilidades.forEach(habilidad => {
            habilidad.disabled = !estado;
        });
    }

    algunRadioSeleccionado(opciones) {
        return Array.from(opciones).some(opcion => opcion.checked);
    }

    algunCheckboxSeleccionado(opciones) {
        return Array.from(opciones).some(opcion => opcion.checked);
    }
}

// Inicializar la clase cuando el documento esté listo
document.addEventListener('DOMContentLoaded', () => {
    new FormularioValidaciones();
});

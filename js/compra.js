const compra = new Carrito();
const listaCompra = document.querySelector('#lista-compra tbody');
const procesarCompraBtn = document.querySelector('#procesar-compra');
const cliente = document.querySelector('#cliente');
const correo = document.querySelector('#correo');

cargarEventos();

function cargarEventos() {
    document.addEventListener('DOMContentLoaded', compra.leerLocalStorageCompra());

    carrito.addEventListener('click', (e) => { compra.eliminarProducto(e) });

    compra.calcularTotal();

    procesarCompraBtn.addEventListener('click', procesarCompra);
};

function procesarCompra(e) {
    e.preventDefault();

    if (compra.obtenerProductosLocalStorage().length === 0) {
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'No hay productos',
            timer: 4000,
            showConfirmButton: false
        }).then(function () {
            window.location = "index.html";
        })
    }
    else if (cliente.value === '' || correo.value === '') {
        Swal.fire({
            type: 'error',
            title: 'Ingrese informacion de contacto',
            text: 'ingrese email y nombre ',
            timer: 2000,
            showConfirmButton: false
        })
    }
    else {
        emailjs.init('gzDlOWM4puU_uKazU');

        const btn = document.getElementById('procesar-compra');

        const cargandoGif = document.querySelector('#cargando');
        cargandoGif.style.display = 'block';

        document.getElementById('procesar-pago')
            .addEventListener('click', function (event) {
                event.preventDefault();
                btn.value = 'Enviando...';

                const serviceID = 'default_service';
                const templateID = 'template_tflbbnc';

                const padre = document.querySelector('#loaders');
                const enviado = document.createElement('img');
                const mensaje = document.createElement('h4');
                enviado.src = 'img/mail.gif';
                enviado.style.display = 'block';
                enviado.width = '150';
                mensaje.innerHTML = 'los datos han sido enviados';

                emailjs.sendForm(serviceID, templateID, this)
                    .then(() => {
                        btn.value = 'Confirmar Compra';
                        cargandoGif.style.display = 'none';
                        padre.style.display = 'flex';
                        padre.style.flexDirection = 'column';
                        padre.style.alignItems = 'center';

                        padre.appendChild(enviado);
                        padre.appendChild(mensaje);
                        localStorage.clear();
                        setTimeout(() => {
                            enviado.remove();
                            mensaje.remove();
                            compra.vaciarCarritoLocalStorage();
                            window.location = "index.html";
                        }, 2000)
                        window.location = "index.html";
                    }, (err) => {
                        btn.value = 'Confirmar Compra';
                        alert(JSON.stringify(err));
                    });
            });

    }
}
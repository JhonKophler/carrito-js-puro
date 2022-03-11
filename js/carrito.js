class Carrito{
    //metodo para agregar al carrito
    comprarProducto(e){
        e.preventDefault();
        if (e.target.classList.contains('agregar-carrito')) {
            const producto = e.target.parentElement.parentElement;
            this.leerDatosProducto(producto); 
        }
    }
    leerDatosProducto(producto){
        const infoProducto = {
            imagen : producto.querySelector('img').src,
            titulo : producto.querySelector('h4').textContent,
            precio : producto.querySelector('.precio span').textContent,
            id : producto.querySelector('a').getAttribute('data-id'),
            cantidad : 1
        };

        let productosLS = this.obtenerProductosLocalStorage();

        productosLS.forEach((productoLS)=>{
            if ( productoLS.id === infoProducto.id ) {
                productosLS = productoLS.id;
            }
        });
        if ( productosLS === infoProducto.id ) {
            Swal.fire({
                type: 'info',
                title: 'Oops...',
                text: 'El producto ya esta agregado',
                timer: 1000,
                showConfirm: false
            })
        }else{
            this.insertarCarrito(infoProducto);
        }
    }

    insertarCarrito(producto){
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${producto.imagen}" width=100>
            </td>
            <td>${producto.titulo}</td>
            <td>${producto.precio}</td>
            <td>
                <a href="#" class="borrar-producto fas fa-times-circle" data-id="${producto.id}"></a>
            </td>
        `;
        listaProductos.appendChild(row);
        this.guardarProductoLocalStorage(producto);
    }

    eliminarProducto(e){
        e.preventDefault();
        let producto,productoID;
        if ( e.target.classList.contains('borrar-producto')) {
            e.target.parentElement.parentElement.remove();
            producto = e.target.parentElement.parentElement;
            productoID = producto.querySelector('a').getAttribute('data-id');
        }
        this.eliminarProductoLocalStorage(productoID);
        this.calcularTotal();
    }


    vaciarCarrito(e){
        e.preventDefault();
        while (listaProductos.firstChild) {
            listaProductos.removeChild(listaProductos.firstChild);
        }
        this.vaciarCarritoLocalStorage();
        return false;
    }

    guardarProductoLocalStorage(producto){
        let productos = this.obtenerProductosLocalStorage();
        productos.push(producto);
        localStorage.setItem('productos',JSON.stringify(productos));
    }

    obtenerProductosLocalStorage(){
        let productoLS;
        if ( localStorage.getItem('productos') === null ) {
            productoLS = [];
        }else{
            productoLS = JSON.parse(localStorage.getItem('productos'));
        }
        return productoLS;
    }

    eliminarProductoLocalStorage(productoID){
        let productosLS = this.obtenerProductosLocalStorage();
        productosLS.forEach( function(productoLS,index){

            if ( productoLS.id === productoID ) {
                
                productosLS.splice(index,1);
            }
        });

        localStorage.setItem('productos',JSON.stringify(productosLS));
    }

    leerLocalStorage(){
        let productosLS = this.obtenerProductosLocalStorage();
        productosLS.forEach( function(producto){
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>
                <img src="${producto.imagen}" width=100>
            </td>
            <td>${producto.titulo}</td>
            <td>${producto.precio}</td>
            <td>
                <a href="#" class="borrar-producto fas fa-times-circle" style="font-size:20px;text-decoration:none;" data-id="${producto.id}"></a>
            </td>
        `;
        listaProductos.appendChild(row);
        });
    }

    leerLocalStorageCompra(){
        let productosLS = this.obtenerProductosLocalStorage();
        productosLS.forEach( function(producto){
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>
                <img src="${producto.imagen}" width=100>
            </td>
            <td>${producto.titulo}</td>
            <td>${producto.precio}</td>
            <td>
                <input type="number" class="form-control cantidad" min="1" value=${producto.cantidad}>
            </td>
            <td>${producto.precio * producto.cantidad}</td>
            <td>
                <a href="#" class="borrar-producto fas fa-times-circle" style="font-size:30px;text-decoration:none;" data-id="${producto.id}"></a>
            </td>
        `;
        listaCompra.appendChild(row);
        });
        
    }


    vaciarCarritoLocalStorage(){
        localStorage.clear();
    }

    procesaPedido(e){
        e.preventDefault();
        if ( this.obtenerProductosLocalStorage().length === 0) {
            Swal.fire({
                type: 'info',
                title: 'Oops...',
                text: 'El carrito esta vacio actualmente',
                timer: 1000,
                showConfirm: false
            })
        }else{
            location.href = "compra.html";
        }
        
    }

    calcularTotal(){
        let productosLS = this.obtenerProductosLocalStorage();
        let total = 0, subtotal = 0 , iva = 0;
        for ( let i = 0; i < productosLS.length; i++) {
            let precio = parseInt(productosLS[i].precio);
            let cantidad = parseInt(productosLS[i].cantidad);
            total = total+(precio*cantidad);
        }
        subtotal = total;
        iva = Number(total*0.27);
        total= Number(subtotal + iva);
        
        document.getElementById('subtotal').innerHTML = "ARS/. " +subtotal.toFixed(2);
        document.getElementById('iva').innerHTML = "ARS/. " + iva.toFixed(2);
        document.getElementById('total').innerHTML = "ARS/. " + total.toFixed(2);

    }

}
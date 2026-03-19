let productos = JSON.parse(localStorage.getItem("productos")) || [];

// Mostrar productos en la tabla
function mostrarProductos() {
  const tabla = document.querySelector("#tablaProductos tbody");
  tabla.innerHTML = "";
  productos.forEach((p, i) => {
    tabla.innerHTML += `
      <tr>
        <td>${p.nombre}</td>
        <td>$${p.precio}</td>
        <td><img src="${p.imagen}" width="50"></td>
        <td class="acciones">
          <button class="editar" onclick="editarProducto(${i})">Editar</button>
          <button class="eliminar" onclick="eliminarProducto(${i})">Eliminar</button>
        </td>
      </tr>
    `;
  });
}

// Agregar producto
function agregarProducto() {
  const nombre = document.getElementById("nombre").value;
  const precio = document.getElementById("precio").value;
  const imagen = document.getElementById("imagen").value;

  if (nombre && precio && imagen) {
    productos.push({ nombre, precio, imagen });
    localStorage.setItem("productos", JSON.stringify(productos));
    mostrarProductos();
    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("imagen").value = "";
  } else {
    alert("Por favor completa todos los campos.");
  }
}

// Editar producto
function editarProducto(index) {
  const nuevoNombre = prompt("Nuevo nombre:", productos[index].nombre);
  const nuevoPrecio = prompt("Nuevo precio:", productos[index].precio);
  const nuevaImagen = prompt("Nueva URL de imagen:", productos[index].imagen);

  if (nuevoNombre && nuevoPrecio && nuevaImagen) {
    productos[index] = { nombre: nuevoNombre, precio: nuevoPrecio, imagen: nuevaImagen };
    localStorage.setItem("productos", JSON.stringify(productos));
    mostrarProductos();
  }
}

// Eliminar producto
function eliminarProducto(index) {
  if (confirm("¿Seguro que deseas eliminar este producto?")) {
    productos.splice(index, 1);
    localStorage.setItem("productos", JSON.stringify(productos));
    mostrarProductos();
  }
}

mostrarProductos();

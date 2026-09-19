// Obtener los elementos por su ID
const titulo = document.getElementById('titulo');
const descripcion = document.getElementById('descripcion');
const contenedorArticulos = document.getElementById('contenedor-articulos');
const contenedorApi = document.getElementById('contenedor-api');
const infoWindow = document.getElementById('info-window');

// Obtener el primer elemento que se encuntre con querySelector con el identificador indicado
const hero = document.querySelector('#titulo-principal');
const listaPedidos = document.querySelector('.lista');
const btnTexto = document.querySelector('#btn-texto');
const btnEstilo = document.querySelector('#btn-estilo');
const btnAgregar = document.querySelector('#btn-agregar');
const btnEliminar = document.querySelector('#btn-eliminar');
const btnApi = document.querySelector('#btn-api');

// Obtener todos los elemento que se encuntren con querySelectorAll con el identificador indicado
const itemsLista = document.querySelectorAll('.item');

// Jerarquia en consola del DOM
console.log('Nodo padre de la lista:', listaPedidos.parentElement);
console.log('Hijos de la lista:', listaPedidos.children);
console.log('Primer hijo de la lista:', listaPedidos.firstElementChild);
console.log('Último hijo de la lista:', listaPedidos.lastElementChild);


// MOdificación del texto al hacer click escuchando este evento
btnTexto.addEventListener('click', () => {
    titulo.textContent = '¡Únete a las compras conjuntas de Caldas!';

    // Con el inner se pueden insertar etiquetas HTML dentro del elemento que se vaya a settear
    descripcion.innerHTML = 'Ahorra <strong>hasta un 30%</strong> comprando materias primas junto a otros negocios.';
});


// Modificación de Estilos

/*
 * ¿Cuál es la mejor práctica? - R:
 * Es mejor usar classList (add, remove, toggle) que la propiedad style.
 * Con classList los estilos quedan definidos en el archivo CSS, así se
 * mantiene separada la presentación de la lógica, se pueden reutilizar
 * y son más fáciles de mantener. La propiedad style escribe estilos en
 * línea directamente en el HTML, lo que mezcla responsabilidades y es más
 * difícil de separar las responsabilidades. Básicamente style solo conviene para valores dinámicos
 * Por ejemplo definir un ancho fijo con JavaScript en un momento fijo
 */

let estilosActivos = false;

btnEstilo.addEventListener('click', () => {
    estilosActivos = !estilosActivos;

    titulo.style.color = estilosActivos ? '#F5A623' : '';

    // classList.add() y classList.remove() - Añair o remover estilos del style.css por medio de clases obtenidas del DOM
    if (estilosActivos) {
        hero.classList.add('titulo-principal-alt');
    } else {
        hero.classList.remove('titulo-principal-alt');
    }

    // classList.toggle(): agrega la clase si no está, la quita si está
    itemsLista.forEach((item) => item.classList.toggle('resaltado'));
});


// Crear y eliminar elementos

// Contador para identificador de tarjetas en HTML
let contadorArticulos = 0;

btnAgregar.addEventListener('click', () => {
    contadorArticulos++;

    // Crear el nuevo elemento
    const tarjeta = document.createElement('div');
    tarjeta.classList.add('tarjeta');

    const nombre = document.createElement('h3');
    nombre.textContent = `Artículo #${contadorArticulos}`;

    const detalle = document.createElement('p');
    detalle.textContent = 'Publicado en Manizales';

    // Agregar los hijos a la tarjeta y la tarjeta al contenedor
    tarjeta.appendChild(nombre);
    tarjeta.appendChild(detalle);
    contenedorArticulos.appendChild(tarjeta);
});

btnEliminar.addEventListener('click', () => {
    const ultimo = contenedorArticulos.lastElementChild;

    if (ultimo) {
        ultimo.remove();
    } else {
        console.log('No hay artículos para eliminar');
    }
});


// Window 

console.log('URL actual:', window.location.href);

// Muestra en pantalla el ancho de la ventana y el scroll vertical
function mostrarInfoWindow() {
    infoWindow.textContent = `Ancho de ventana: ${window.innerWidth}px · Scroll vertical: ${Math.round(window.scrollY)}px`;
}

// Se actualiza cada vez que cambia el tamaño o se hace scroll
window.addEventListener('resize', mostrarInfoWindow);
window.addEventListener('scroll', mostrarInfoWindow);
mostrarInfoWindow();


// Consumo de API de poductos
const URL_API = 'https://dummyjson.com/products?limit=4';

async function cargarProductos() {
    contenedorApi.textContent = 'Cargando productos...';

    // Try Catch para el manejo de errores
    try {
        const respuesta = await fetch(URL_API);

        // Válidar que la respuesta a la petició a la API sea correcta, sino lanzar error
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        // Convertir la respuesta a JSON
        const datos = await respuesta.json();
        console.log('Datos de la API:', datos);

        // Mostrar los datos en el DOM
        contenedorApi.innerHTML = '';
        datos.products.forEach((producto) => {
            const tarjeta = document.createElement('div');
            tarjeta.classList.add('tarjeta');
            tarjeta.innerHTML = `
                <img src="${producto.thumbnail}" alt="${producto.title}">
                <h3>${producto.title}</h3>
                <p>US$ ${producto.price}</p>
            `;
            contenedorApi.appendChild(tarjeta);
        });
    } catch (error) {
        // Manejo de errores: sin conexión, API caída, respuesta inválida, etc...
        console.error('Error al consumir la API:', error);
        contenedorApi.innerHTML = '<p class="mensaje-error">No se pudieron cargar los productos. Intenta de nuevo.</p>';
    }
}

btnApi.addEventListener('click', cargarProductos);

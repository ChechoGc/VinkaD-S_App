// =====================================================
// 1. SELECCIÓN DE ELEMENTOS DEL DOM
// =====================================================

// getElementById: selecciona un único elemento por su id
const titulo = document.getElementById('titulo');
const descripcion = document.getElementById('descripcion');
const contenedorArticulos = document.getElementById('contenedor-articulos');
const contenedorApi = document.getElementById('contenedor-api');
const infoWindow = document.getElementById('info-window');

// querySelector: selecciona el PRIMER elemento que coincide con un selector CSS
const hero = document.querySelector('#hero');
const listaPedidos = document.querySelector('.lista');
const btnTexto = document.querySelector('#btn-texto');
const btnEstilo = document.querySelector('#btn-estilo');
const btnAgregar = document.querySelector('#btn-agregar');
const btnEliminar = document.querySelector('#btn-eliminar');
const btnApi = document.querySelector('#btn-api');

// querySelectorAll: selecciona TODOS los elementos que coinciden (NodeList)
const itemsLista = document.querySelectorAll('.item');

// Mostrar los elementos seleccionados en consola
console.log('Título:', titulo);
console.log('Descripción:', descripcion);
console.log('Hero:', hero);
console.log('Lista de pedidos:', listaPedidos);
console.log('Items de la lista:', itemsLista);


// =====================================================
// 2. NAVEGACIÓN JERÁRQUICA DEL DOM
// =====================================================

console.log('Nodo padre de la lista:', listaPedidos.parentElement);
console.log('Hijos de la lista:', listaPedidos.children);
console.log('Primer hijo de la lista:', listaPedidos.firstElementChild);
console.log('Último hijo de la lista:', listaPedidos.lastElementChild);


// =====================================================
// 3. MODIFICAR TEXTO (textContent e innerHTML)
// =====================================================

btnTexto.addEventListener('click', () => {
    // textContent: cambia solo el texto plano (no interpreta etiquetas HTML)
    titulo.textContent = '¡Únete a las compras conjuntas de Caldas!';

    // innerHTML: permite insertar etiquetas HTML dentro del elemento
    descripcion.innerHTML = 'Ahorra <strong>hasta un 30%</strong> comprando materias primas junto a otros negocios.';
});


// =====================================================
// 4. MODIFICAR ESTILOS (style y classList)
// =====================================================

/*
 * ¿Cuál es la mejor práctica?
 * Es mejor usar classList (add, remove, toggle) que la propiedad style.
 * Con classList los estilos quedan definidos en el archivo CSS, así se
 * mantiene separada la presentación de la lógica, se pueden reutilizar
 * y son más fáciles de mantener. La propiedad style escribe estilos en
 * línea directamente en el HTML, lo que mezcla responsabilidades y es más
 * difícil de sobrescribir. style solo conviene para valores dinámicos
 * (por ejemplo, un ancho calculado con JavaScript).
 */

let estilosActivos = false;

btnEstilo.addEventListener('click', () => {
    estilosActivos = !estilosActivos;

    // Propiedad style: estilo en línea
    titulo.style.color = estilosActivos ? '#F5A623' : '';

    // classList.add() y classList.remove()
    if (estilosActivos) {
        hero.classList.add('hero-alt');
    } else {
        hero.classList.remove('hero-alt');
    }

    // classList.toggle(): agrega la clase si no está, la quita si está
    itemsLista.forEach((item) => item.classList.toggle('resaltado'));
});


// =====================================================
// 5. CREAR Y ELIMINAR ELEMENTOS DINÁMICAMENTE
// =====================================================

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
        ultimo.remove(); // También sirve: contenedorArticulos.removeChild(ultimo)
    } else {
        console.log('No hay artículos para eliminar');
    }
});


// =====================================================
// 6. OBJETO WINDOW (innerWidth, scrollY, location.href)
// =====================================================

console.log('URL actual:', window.location.href);

// Muestra en pantalla el ancho de la ventana y el scroll vertical
function mostrarInfoWindow() {
    infoWindow.textContent = `Ancho de ventana: ${window.innerWidth}px · Scroll vertical: ${Math.round(window.scrollY)}px`;
}

// Se actualiza cada vez que cambia el tamaño o se hace scroll
window.addEventListener('resize', mostrarInfoWindow);
window.addEventListener('scroll', mostrarInfoWindow);
mostrarInfoWindow();


// =====================================================
// 7. CONSUMO DE UNA API PÚBLICA CON FETCH
// =====================================================

const URL_API = 'https://dummyjson.com/products?limit=4';

async function cargarProductos() {
    contenedorApi.textContent = 'Cargando productos...';

    try {
        const respuesta = await fetch(URL_API);

        // fetch no lanza error por códigos HTTP como 404 o 500, se valida aquí
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
        // Manejo de errores: sin conexión, API caída, respuesta inválida, etc.
        console.error('Error al consumir la API:', error);
        contenedorApi.innerHTML = '<p class="mensaje-error">No se pudieron cargar los productos. Intenta de nuevo.</p>';
    }
}

btnApi.addEventListener('click', cargarProductos);

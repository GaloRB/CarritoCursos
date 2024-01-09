const carrito = document.querySelector('#carrito');
const listaCursos = document.querySelector('#lista-cursos');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const contador = document.querySelector('#contador');
let articulosCarrito = [];

cargarEventListeners();


// listeners
function cargarEventListeners() {
    // se agrega curso presionando "Agregar curso"
    listaCursos.addEventListener('click', agregarCurso);

    // muestra los cursos de local storage
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];

        carritoHTML();
    })

    //elimina curso de carrito
    carrito.addEventListener('click', eliminarCurso);

    //vaciar carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = [];
        localStorage.removeItem('carrito');
        limpiarHTML();
        carritoHTML();
    })
};


/* Funciones */

//agrega curso
function agregarCurso(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const cursoSeleccionado = e.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado);
    }
}

//Funcion que elimina el curso del carrito
function eliminarCurso(e) {
    if (e.target.classList.contains('borrar-curso')) {
        const cursoId = e.target.dataset.id;
        const cantidadCursos = articulosCarrito.map((carrito) => {
            if (carrito.id === cursoId && carrito.cantidad > 1) {
                //eliminar cantidad de cursos si es mayor a 1
                carrito.cantidad--;

            } else if (carrito.id === cursoId && carrito.cantidad === 1) {
                // elimina cursos de carrito
                articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);
            }
        });


        //iterar sobre carrito html
        carritoHTML();
    }
}

// leer contenido del html clickeado y extrae la informacion
function leerDatosCurso(curso) {
    // objeto con contendio de curso actual
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }

    //Revisa si un elemento ya existe
    const existe = articulosCarrito.some((curso) => curso.id === infoCurso.id);
    if (existe) {
        //actualiza la cantidad
        const cursos = articulosCarrito.map(curso => {
            if (curso.id === infoCurso.id) {
                curso.cantidad++;
                return curso;
            } else {
                return curso;
            }
        });
        articulosCarrito = [...cursos];
        /* console.log(articulosCarrito); */
    } else {
        // agregar elementos a arreglo carrito
        articulosCarrito = [...articulosCarrito, infoCurso];

    }



    carritoHTML();
}

// muestra el carrito en html
function carritoHTML() {

    //limpiar el html del carrito
    limpiarHTML();

    //recorre carrito y genera html
    articulosCarrito.forEach(curso => {
        // destructuring de curso para obtener el valor y variable
        const { titulo, imagen, precio, cantidad, id } = curso;

        const row = document.createElement('tr');
        row.innerHTML = `
        <td><img src="${imagen}" width="100"/></td>
        <td>${titulo}</td>
        <td>${precio}</td>
        <td>${cantidad}</td>
        <td><a href="#" class="borrar-curso" data-id="${id}">X</a></td> 
        `;

        //agregar html al de carrito a tbody
        contenedorCarrito.appendChild(row);
    })

    sumaCursos();

    sincronizarStorage();

}

//limpia el html del carrito
function limpiarHTML() {
    /* forma lenta de limpiar
    contenedorCarrito.innerHTML = ''; */

    //limpia con mejor performance
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}

//limpia el html del carrito
function limpiarHTML2() {

    //limpia con mejor performance
    while (contador.firstChild) {
        contador.removeChild(contador.firstChild);
    };
}

// funcion para sumar la cantidad de cursos
function sumaCursos() {
    // solo se declara variable
    let cantidadCursos = 0;

    let resultado = articulosCarrito.reduce((cantidadCursos, cantidad) => cantidadCursos + cantidad.cantidad, 0);

    console.log(resultado);
    contadorCarrito(resultado);
}

// agrega cursos a local storage
function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

// muestra cuantos cursos se tienen en el carrito
function contadorCarrito(cursos) {
    limpiarHTML2();
    if (cursos !== 0) {
        const numeroCursos = document.createElement('P');
        numeroCursos.textContent = cursos;
        contador.classList.add('contador');
        contador.appendChild(numeroCursos);
    } else {
        contador.classList.remove('contador');
    }
}
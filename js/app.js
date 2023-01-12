//variables
const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

//carga al abrir la página
window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
})

function buscarClima(e){
    e.preventDefault();

    //validar
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    console.log(ciudad);
    console.log(pais)

    if(ciudad === '' || pais === ''){
        mostrarError('Ambos campos son obligatorios');
        return;
    }

    //consultar la api
    consultarAPI(ciudad, pais);

}

function mostrarError(mensaje){
   const alerta = document.querySelector('.bg-red-100');

    //crear alerta en el html
    if(!alerta){
    const alerta = document.createElement('div');
    alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700','px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');
    alerta.innerHTML=`
    <strong class="font-bold">Error!</strong>
    <span class="block">${mensaje}</span>
    `
    container.appendChild(alerta);

    setTimeout(()=>{
        alerta.remove()
    }, 3000)
}
}

function consultarAPI(ciudad, pais){
    const appId = '9cb2a5e08e93ab13bffe784c6dbd75a9';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

    Spinner();
    fetch(url)
    .then(respuesta => respuesta.json())
    .then(datos => {
        limpiarHTML();
        if(datos.cod === "404"){
            mostrarError('Ciudad no encontrada')
            return;
        }
        //mostrar la respuesta en el html
        mostrarClima(datos);
    })

}

function mostrarClima(datos){
    const {name, main : { temp, temp_max, temp_min}} = datos
    //para pasar de grados kelvin(por defecto de la api) a centigrados
    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);

    const nombre = document.createElement('p');
    nombre.textContent = `Clima en ${name}`; 
    nombre.classList.add('font-bold', 'text-2xl')

    const actual = document.createElement('p');
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.classList.add('font-bold', 'text-6xl');

    const temperaturaMax = document.createElement('p');
    temperaturaMax.innerHTML = `Max: ${max} &#8451;`;
    temperaturaMax.classList.add('text-xl');
    //console.log(temp - 273.15);

    const temperaturaMin = document.createElement('p');
    temperaturaMin.innerHTML = `Min: ${min} &#8451;`;
    temperaturaMin.classList.add('text-xl');

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-black');
    resultadoDiv.appendChild(nombre);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(temperaturaMax);
    resultadoDiv.appendChild(temperaturaMin);

    resultado.appendChild(resultadoDiv);
}

const kelvinACentigrados = grados => Math.round(grados -273.15)

//para que limpie si es que hay algo previamente
function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function Spinner(){
    limpiarHTML();
    const divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner');
    divSpinner.innerHTML = `
    <div class="double-bounce1"></div>
    <div class="double-bounce2"></div>
    `;

    resultado.appendChild(divSpinner);
}
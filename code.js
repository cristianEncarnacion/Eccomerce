// Variable global para almacenar los ítems en el aside
window.itemsEnAside = new Set(); // Usamos un Set para evitar duplicados

// Variable global para el contador
let contador = 0;

// Función para obtener datos de un archivo JSON
function getData() {
  fetch("code.json")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Error al cargar los datos");
      }
      return res.json();
    })
    .then((datos) => {
      // Guardamos los datos globalmente para acceder a ellos en el filtro
      window.allItems = datos;
      mostrarDatos(datos); // Muestra todos los datos inicialmente
    })
    .catch((error) => {
      console.error("Ha habido un error", error);
    });
}

// Función para mostrar datos en el contenedor principal
function mostrarDatos(items) {
  const container = document.querySelector("main");
  container.innerHTML = ""; // Limpia el contenedor antes de agregar nuevos elementos

  items.forEach((item) => {
    const contenedorItem = document.createElement("div");
    contenedorItem.classList.add("item");

    const botonTexto = window.itemsEnAside.has(item.id)
      ? "Eliminar"
      : "Agregar";

    contenedorItem.innerHTML = `
      <img src="${item.imagen}" alt="${item.titulo}" width="100%" />
      <div class="contenedor-global">
        <div class="descripcion">
          <h4>${item.titulo}</h4>
          <h5>${
            item.descripcion.length > 100
              ? item.descripcion.slice(0, 100) + "..."
              : item.descripcion
          }</h5>
        </div>
        <div class="precio-boton">
          <h3>$${item.precio}</h3>
          <button data-item='${JSON.stringify(item)}'>${botonTexto}</button>
        </div>
      </div>
    `;

    container.appendChild(contenedorItem);
    localStorage.setItem("item", JSON.stringify(item));
  });
}

// Función para manejar el clic en los botones "Agregar" y "Eliminar"
function manejarBotones() {
  document.querySelector("main").addEventListener("click", (event) => {
    const counter = document.getElementById("contador");
    if (event.target.tagName === "BUTTON") {
      const item = JSON.parse(event.target.getAttribute("data-item"));

      if (event.target.textContent === "Agregar") {
        agregarAlSidebar(item);
        contador++;
      } else if (event.target.textContent === "Eliminar") {
        eliminarDelSidebar(item);
        contador--;
      }

      // Actualizar el contador en la vista
      counter.textContent = contador;
    }
  });

  // Manejador de eventos para los botones "Eliminar" en el aside
  document.querySelector("aside").addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
      const item = JSON.parse(event.target.getAttribute("data-item"));
      eliminarDelSidebar(item);
      contador--;
      document.getElementById("contador").textContent = contador;
    }
  });
}

// Función para agregar un ítem al sidebar
function agregarAlSidebar(item) {
  const sidebar = document.querySelector("aside");

  // Crear un nuevo contenedor para el ítem
  const contenido = document.createElement("div");
  contenido.classList.add("sidebar-item"); // Añadir una clase para estilizar los ítems si es necesario
  localStorage.setItem("item", JSON.stringify(item));

  // Rellenar el contenedor con el HTML del ítem
  contenido.innerHTML = `
    <img src="${item.imagen}" alt="${item.titulo}" width="100%" />
    <div class="descripcion">
      <h4>${item.titulo}</h4>
      <h5>${item.descripcion}</h5>
      <h3>$${item.precio}</h3>
      <button data-item='${JSON.stringify(item)}'>Eliminar</button>
    </div>
  `;

  // Añadir el nuevo contenedor al <aside>
  sidebar.appendChild(contenido);

  // Añadir el ítem al Set
  window.itemsEnAside.add(item.id);

  // Actualizar los botones en el contenedor principal
  mostrarDatos(window.allItems);
}

// Función para eliminar un ítem del sidebar
function eliminarDelSidebar(item) {
  const sidebar = document.querySelector("aside");

  // Encontrar y eliminar el contenedor del ítem
  const sidebarItem = Array.from(
    sidebar.querySelectorAll(".sidebar-item")
  ).find(
    (el) =>
      JSON.parse(el.querySelector("button").getAttribute("data-item")).id ===
      item.id
  );

  if (sidebarItem) {
    sidebarItem.remove();
    // Eliminar el ítem del Set
    window.itemsEnAside.delete(item.id);

    // Actualizar los botones en el contenedor principal
    mostrarDatos(window.allItems);
  }
}

// Función para filtrar los datos basados en el texto de búsqueda
function filtrarDatos(filtroTexto) {
  if (filtroTexto.trim() === "") {
    // Si el campo de búsqueda está vacío, mostrar todos los elementos
    mostrarDatos(window.allItems);
  } else {
    // Filtrar los datos basados en el texto de búsqueda
    const resultados = window.allItems.filter((item) =>
      item.titulo.toLowerCase().includes(filtroTexto.toLowerCase())
    );
    mostrarDatos(resultados); // Muestra solo los datos filtrados
  }
}

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", () => {
  getData();
  manejarBotones();

  const filtro = document.querySelector("input");
  filtro.addEventListener("change", () => {
    filtrarDatos(filtro.value);
  });

  const carro = document.getElementById("icono");
  carro.addEventListener("click", () => {
    const sidebar = document.querySelector("aside");
    sidebar.classList.toggle("show");
  });
});

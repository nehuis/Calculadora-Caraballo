class Calculadora {
  constructor() {
    this.resultados = [];
    this.pantalla = document.querySelector(".pantalla");
    this.botones = document.querySelectorAll(".btn");
    this.operacionActual = "";
    this.loadResultados();
    this.clickEnabled = true;
  }

  async cargarDatosDesdeJSON() {
    try {
      const response = await fetch('../data.json');
      const datos = await response.json();
      return datos;
    } catch (error) {
      console.error('Error al cargar datos desde JSON:', error);
      throw error;
    }
  }

  ejecutarCalculadora() {
    this.botones.forEach((boton) => {
      boton.addEventListener("click", () => {
        const botonApretado = boton.textContent;

        if (boton.id === "c") {
          this.limpiarPantalla();
          return;
        }

        if (boton.id === "borrar") {
          this.borrarCaracter();
          return;
        }

        if (boton.id === "igual" && this.clickEnabled) {
          this.clickEnabled = false;
          this.realizarOperacion();
          this.clickEnabled = true;
          return;
        }

        this.agregarCaracter(botonApretado);
      });

      boton.addEventListener("dblclick", () => {
        if (boton.id === "igual") {
          this.mostrarResultados();
        }
      });
    });
  }

  agregarCaracter(caracter) {
    if (
      this.pantalla.textContent === "0" ||
      this.pantalla.textContent === "Error"
    ) {
      this.pantalla.textContent = caracter;
      this.operacionActual = caracter;
    } else {
      this.pantalla.textContent += caracter;
      this.operacionActual += caracter;
    }
  }

  limpiarPantalla() {
    this.pantalla.textContent = "0";
    this.operacionActual = "";
  }

  borrarCaracter() {
    if (
      this.pantalla.textContent.length === 1 ||
      this.pantalla.textContent === "Error"
    ) {
      this.limpiarPantalla();
    } else {
      this.pantalla.textContent = this.pantalla.textContent.slice(0, -1);
      this.operacionActual = this.operacionActual.slice(0, -1);
    }
  }

  async realizarOperacion() {
    try {
      const datosJSON = await this.cargarDatosDesdeJSON();
      const resultado = this.calcularOperacion(this.operacionActual);

      const sumaResultados = datosJSON.reduce((suma, dato) => suma + dato.result, 0);

      this.registrarResultado(this.operacionActual, resultado);
      this.mostrarResultadoEnPantalla(resultado);
    } catch {
      this.mostrarErrorEnPantalla();
    }
  }

  registrarResultado(operacion, resultado) {
    this.resultados.push({ operacion, resultado });
    this.saveResultados();
  }

  mostrarResultadoEnPantalla(resultado) {
    this.pantalla.textContent = resultado.toString();
  }

  mostrarErrorEnPantalla() {
    this.pantalla.textContent = "Error";
  }

  mostrarResultados() {
    this.pantalla.innerHTML = "";

    this.resultados.forEach(({ operacion, resultado }) => {
      const resultadoItem = document.createElement("p");
      resultadoItem.textContent = `${operacion} = ${resultado}`;
      this.pantalla.appendChild(resultadoItem);
    });
  }

  saveResultados() {
    sessionStorage.setItem("resultados", JSON.stringify(this.resultados));
  }

  loadResultados() {
    const storedResultados = sessionStorage.getItem("resultados");
    if (storedResultados) {
      this.resultados = JSON.parse(storedResultados);
    }
  }

  calcularOperacion(operacion) {
    return Function('"use strict";return (' + operacion + ')')();
  }
}

const miCalculadora = new Calculadora();
miCalculadora.ejecutarCalculadora();

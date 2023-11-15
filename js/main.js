class Calculadora {
  constructor() {
    this.resultados = [];
    this.pantalla = document.querySelector(".pantalla");
    this.botones = document.querySelectorAll(".btn");
    this.operacionActual = "";
    this.tiposDeCambio = null;
    this.loadResultados();
    this.clickEnabled = true;
    this.mensajeElemento = document.getElementById("mensaje");
    this.ejecutarCalculadora();
    this.obtenerTiposDeCambio();
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

  obtenerTiposDeCambio() {
    fetch('data.json')
      .then(response => response.json())
      .then(data => {
        this.tiposDeCambio = data.tiposDeCambio;
        this.mostrarMensaje(JSON.stringify(data));
      })
      .catch(error => {
        this.mostrarMensaje("Error al cargar los tipos de cambio: " + error, true);
      });
  }

  agregarCaracter(caracter) {
    const ultimoCaracter = this.operacionActual.slice(-1);
    if (this.esOperador(caracter) && this.esOperador(ultimoCaracter)) {
      return;
    }

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

    this.limpiarMensaje();
  }

  esOperador(caracter) {
    const operadores = ["+", "-", "*", "/"];
    return operadores.includes(caracter);
  }

  limpiarPantalla() {
    this.pantalla.textContent = "0";
    this.operacionActual = "";
    this.limpiarMensaje();
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

  realizarOperacion() {
    try {
      const resultado = this.calcularOperacion(this.operacionActual);
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

  mostrarMensaje(mensaje, esError = false) {
    this.mensajeElemento.textContent = mensaje;
    if (esError) {
      this.mensajeElemento.classList.add("mensaje-error");
    } else {
      this.mensajeElemento.classList.remove("mensaje-error");
    }
    setTimeout(() => {
      this.limpiarMensaje();
    }, 5000);
  }

  limpiarMensaje() {
    this.mensajeElemento.textContent = "";
    this.mensajeElemento.classList.remove("mensaje-error");
  }
}

const miCalculadora = new Calculadora();

class Calculadora {
  constructor() {
    this.resultados = [];
    this.pantalla = document.querySelector(".pantalla");
    this.botones = document.querySelectorAll(".btn");
    this.operacionActual = "";
    this.tiposDeCambio = null;
    this.loadResultados();
    this.clickEnabled = true;

    // Nuevo: elemento para mostrar mensajes
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
        // Nuevo: mostrar mensaje en la consola sin afectar la página
        this.mostrarMensajeEnConsola("Tipos de cambio cargados: " + JSON.stringify(data));
      })
      .catch(error => {
        // Nuevo: mostrar mensaje en la consola sin afectar la página
        this.mostrarMensajeEnConsola("Error al cargar los tipos de cambio: " + error);
      });
  }

  agregarCaracter(caracter) {
    const ultimoCaracter = this.operacionActual.slice(-1);

    // Evitar duplicar operadores
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

    // Limpiar el mensaje después de agregar un nuevo caracter
    this.limpiarMensaje();
  }

  esOperador(caracter) {
    const operadores = ["+", "-", "*", "/"];
    return operadores.includes(caracter);
  }

  limpiarPantalla() {
    this.pantalla.textContent = "0";
    this.operacionActual = "";
    // Nuevo: limpiar el mensaje después de limpiar la pantalla
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
    // Nuevo: mostrar mensaje de error
    this.mostrarMensaje("Error en la operación", true);
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

  // Nuevo: método para mostrar mensajes en la consola sin afectar la página
  mostrarMensajeEnConsola(mensaje) {
    console.log(mensaje);
  }

  // Nuevo: método para mostrar mensajes en la interfaz
  mostrarMensaje(mensaje, esError = false) {
    this.mensajeElemento.textContent = mensaje;

    // Nuevo: mostrar o ocultar el mensaje de error según sea necesario
    if (esError) {
      this.mensajeElemento.classList.add("mensaje-error");
    } else {
      this.mensajeElemento.classList.remove("mensaje-error");
    }
  }

  // Nuevo: método para limpiar el mensaje en la interfaz
  limpiarMensaje() {
    this.mensajeElemento.textContent = "";
    this.mensajeElemento.classList.remove("mensaje-error");
  }
}

const miCalculadora = new Calculadora();

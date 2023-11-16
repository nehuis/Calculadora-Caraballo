class Calculadora {
  constructor() {
    this.resultados = [];
    this.pantalla = document.querySelector(".pantalla");
    this.botones = document.querySelectorAll(".btn");
    this.operacionActual = "";
    this.clickEnabled = true;
    this.configuracion = null;
    this.obtenerConfiguracion();
  }

  obtenerConfiguracion() {
    fetch('data.json')
      .then(response => response.json())
      .then(data => {
        this.configuracion = data;
        this.ejecutarCalculadora();
      })
      .catch(error => {
        this.mostrarErrorEnPantalla("Error al cargar la configuración:" + error.message);
      });
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
      this.mostrarErrorEnPantalla("Error");
    }
  }

  registrarResultado(operacion, resultado) {
    this.resultados.push({ operacion, resultado });

    this.saveResultados();

    if (this.resultados.length > this.configuracion.historialLimitado) {
      this.resultados.shift(); 
    }
  }

  mostrarResultadoEnPantalla(resultado) {
    this.pantalla.textContent = resultado.toFixed(this.configuracion.precisionDecimales);
  }

  mostrarErrorEnPantalla(mensaje) {
    this.pantalla.textContent = mensaje;
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
      if (this.resultados.length > this.configuracion.historialLimitado) {
        this.resultados = this.resultados.slice(-this.configuracion.historialLimitado);
      }
    }
  }

  calcularOperacion(operacion) {
    return Function('"use strict";return (' + operacion + ")")();
  }
}

const miCalculadora = new Calculadora();

class Calculadora {
  constructor() {
    this.resultados = [];
    this.pantalla = document.querySelector(".pantalla");
    this.botones = document.querySelectorAll(".btn");
    this.operacionActual = "";
    this.loadResultados();
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

        if (boton.id === "igual") {
          this.realizarOperacion();
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

realizarOperacion() {
  try {
    const resultado = new Function(`return ${this.operacionActual}`)();
    this.resultados.push({
      operacion: this.operacionActual,
      resultado: resultado,
    });
    this.saveResultados();
    this.pantalla.textContent = resultado;
    this.calcularOperacion();
  } catch {
    this.pantalla.textContent = "Error";
  }
}

  mostrarResultados() {
    const resultadosList = document.createElement("ol");
    resultadosList.classList.add("resultados-list");

    this.resultados.forEach(({ operacion, resultado }) => {
      const resultadoItem = document.createElement("li");
      resultadoItem.textContent = `${operacion} = ${resultado}`;
      resultadosList.appendChild(resultadoItem);
    });

    this.pantalla.innerHTML = "";
    this.pantalla.appendChild(resultadosList);
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
}

const miCalculadora = new Calculadora();
miCalculadora.ejecutarCalculadora();
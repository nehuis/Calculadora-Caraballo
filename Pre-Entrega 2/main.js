class Calculadora {
    constructor() {
        this.resultados = []; 
    }

    calcular(operacion, num1, num2) {
        let resultado;

        if (operacion === "+") {
            resultado = num1 + num2;
        } else if (operacion === "-") {
            resultado = num1 - num2;
        } else if (operacion === "*") {
            resultado = num1 * num2;
        } else if (operacion === "/") {
            if (num2 !== 0) {
                resultado = num1 / num2;
            } else {
                resultado = "Error: No se puede dividir por cero";
            }
        } else {
            resultado = "Operación no válida";
        }

        this.resultados.push({ num1, operacion, num2, resultado });
        
        return resultado;
    }

    ejecutarCalculadora() {
        let aceptar = true;

        while (aceptar) {
            let operacion = prompt("Ingrese la operación que desea realizar (+, -, *, /):");

            if (operacion === null) {
                alert("Gracias por visitar mi página web");
                break; 
            }

            if (operacion !== "+" && operacion !== "-" && operacion !== "*" && operacion !== "/") {
                alert("Operación no válida. Por favor, introduzca una operación válida.");
                continue;
            }

            let num1 = parseFloat(prompt("Ingrese un número"));
            let num2 = parseFloat(prompt("Ingrese otro número"));

            if (isNaN(num1) || isNaN(num2)) {
                alert("Por favor, ingrese números válidos.");
                continue;
            }

            const resultado = this.calcular(operacion, num1, num2);

            alert("Resultado: " + resultado);

            aceptar = confirm("¿Desea realizar otra operación?");
        }

        alert("Resultados almacenados:\n" + this.mostrarResultados());
    }

    mostrarResultados() {
        let resultadosString = "";

        this.resultados.forEach((operacion, index) => {
            resultadosString += `Operación ${index + 1}: ${operacion.num1} ${operacion.operacion} ${operacion.num2} = ${operacion.resultado}\n`;
        });

        return resultadosString;
    }

    buscarPorResultado(resultadoBuscado) {
        return this.resultados.filter(operacion => operacion.resultado === resultadoBuscado);
    }

    obtenerPromedio() {
        const resultadosNumericos = this.resultados.filter(operacion => typeof operacion.resultado === "number");
        if (resultadosNumericos.length > 0) {
            const suma = resultadosNumericos.reduce((total, operacion) => total + operacion.resultado, 0);
            return suma / resultadosNumericos.length;
        } else {
            return "No hay resultados numéricos para calcular el promedio.";
        }
    }
}

const miCalculadora = new Calculadora();
miCalculadora.ejecutarCalculadora();

const resultadoBuscado = parseFloat(prompt("Ingrese un resultado a buscar:"));
const operacionesEncontradas = miCalculadora.buscarPorResultado(resultadoBuscado);

if (operacionesEncontradas.length > 0) {
    let mensaje = '';
    operacionesEncontradas.forEach(op => mensaje += `${op.num1} ${op.operacion} ${op.num2} = ${op.resultado}\n`);
    alert(`Operaciones con resultado ${resultadoBuscado}:\n ${mensaje}` );
} else {
    alert(`No se encontraron operaciones con resultado ${resultadoBuscado}.`);
}

const promedio = miCalculadora.obtenerPromedio();
alert(`Resultado promedio de todas las operaciones: ${promedio}`);
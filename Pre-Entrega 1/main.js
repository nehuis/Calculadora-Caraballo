function calcular(operacion, num1, num2) {
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
        resultado = "Operacion no valida";
    }

    return resultado;
}

let continuar = true;

while (continuar) {
    const operacion = prompt("Ingrese la operación que desea realizar (+, -, *, /):");

    if (operacion !== "+" && operacion !== "-" && operacion !== "*" && operacion !== "/") {
        alert("Operacion no valida. Por favor, ingrese una operacion valida.");
        continue;
    }

    const num1 = parseFloat(prompt("Ingrese un numero"));
    const num2 = parseFloat(prompt("Ingrese otro numero"));

    if (isNaN(num1) || isNaN(num2)) {
        alert("Por favor, ingrese numeros validos.");
        continue;
    }

    const resultado = calcular(operacion, num1, num2);

    alert("Resultado: " + resultado);
}

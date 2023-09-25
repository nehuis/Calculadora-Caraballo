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

let aceptar = true;

while (aceptar) {
    let operacion = prompt("Ingrese la operación que desea realizar (+, -, *, /):");

    if (operacion !== "+" && operacion !== "-" && operacion !== "*" && operacion !== "/") {
        alert("Operacion no valida. Por favor, ingrese una operacion valida.");
        continue;
    }

    let num1 = parseFloat(prompt("Ingrese un numero"));
    let num2 = parseFloat(prompt("Ingrese otro numero"));

    if (isNaN(num1) || isNaN(num2)) {
        alert("Por favor, ingrese numeros validos.");
        continue;
    }

    const resultado = calcular(operacion, num1, num2);

    alert("Resultado: " + resultado);
}

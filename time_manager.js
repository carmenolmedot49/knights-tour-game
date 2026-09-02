// VARIABLES GLOBALES DEL CRONÓMETRO

let segundos = 0;       // Contador de segundos totales
let cronometro;         // Variable que guarda el setInterval
let Total_mins = 0;     // Minutos totales transcurridos
let Total_secs = 0;     // Segundos totales transcurridos



// FUNCIÓN PARA REINICIAR EL CRONÓMETRO

function ResetTime() {
	clearInterval(cronometro) // Detiene el setInterval si estaba corriendo
	segundos = 0;  // Reinicia el contador de segundos  
}




// INICIAR EL CRONÓMETRO

function StartTime() {

	    // Referencias a los elementos del HTML donde se mostrarán minutos y segundos


	const s = document.getElementById("segundos");
	const m = document.getElementById("minutos");


	    // Se ejecuta cada segundo


	cronometro = setInterval(function () {

		// Suma 1 segundo al contador total

		segundos++; 


		// Calcula minutos y segundos a partir del total de segundos

		let secs = segundos;
		let mins = 0;

		while (secs >= 60) {
			mins++;
			secs -= 60;
		}


		// Añadir ceros delante si son menores de 10

		if (mins < 10) {
			m.innerHTML = "0" + mins;
		} else {
			m.innerHTML = mins;
		}


		if (secs < 10) {
			s.innerHTML = "0" + secs;
		} else {
			s.innerHTML = secs;
		}


		 // Guarda los totales en variables globales

		Total_mins = mins;
		Total_secs = secs;

	}, 1000); // Ejecuta cada segundo
}
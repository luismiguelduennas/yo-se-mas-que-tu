let timerValue = 30;
let remainingTime = 30;
let answers = 0;
let targetAnswers = 0;
let timerInterval;
let gameStarted = false;
let result = 0;

// Obtener referencias a los elementos
const burritoAudio = document.getElementById('burritoAudio');
const aplausoAudio = document.getElementById('aplausoAudio');
const vamosAudio = document.getElementById('vamosAudio');
const ultimosSegundosAudio = document.getElementById('ultimosSegundosAudio');
const donkeyImage = document.getElementById("donkeyImage");
const timerDisplay = document.getElementById("timerDisplay");

// Seleccionar tiempo por defecto (30 segundos)
window.onload = function() {
	selectTime(30);
	createAnswerOptions();
};

function createAnswerOptions() {
	const container = document.getElementById('answerOptions');
	container.innerHTML = '';
	
	for (let i = 1; i <= 20; i++) {
		const option = document.createElement('div');
		option.classList.add('answer-option');
		option.textContent = i;
		option.onclick = function() {
			selectTargetAnswers(i);
		};
		container.appendChild(option);
	}
}

function toggleAnswerOptions() {
	if (gameStarted) {
		incrementAnswer();
		return;
	}
	
	const options = document.getElementById('answerOptions');
	options.style.display = options.style.display === 'grid' ? 'none' : 'grid';
}

function selectTargetAnswers(value) {
	targetAnswers = value;
	document.getElementById('targetCounter').style.display = 'flex';
	document.getElementById('targetCounter').textContent = value;
	
	const answerCounter = document.getElementById('answerCounter');
	answerCounter.textContent = '0';
	answerCounter.style.backgroundColor = 'var(--red-color)';
	
	document.getElementById('answerOptions').style.display = 'none';
	document.getElementById('actionButton').disabled = false;
}

function selectTime(time) {
	if (gameStarted) return;
	
	timerValue = time;
	remainingTime = time;
	document.getElementById('timerCircle').textContent = time;
	
	// Actualizar selección visual
	document.querySelectorAll('.timer-option').forEach(option => {
		option.classList.remove('selected');
		if (parseInt(option.dataset.value) === time) {
			option.classList.add('selected');
		}
	});
}

function toggleGame() {
	if (!gameStarted) {
		startGame();
	} else {
		incrementAnswer();
	}
}

function startGame() {
	if (targetAnswers === 0) return;
	
	gameStarted = true;
	answers = 0;
	
	// Resetear contador de respuestas
	const answerCounter = document.getElementById('answerCounter');
	answerCounter.textContent = '0';
	answerCounter.style.backgroundColor = 'var(--red-color)';
	answerCounter.style.fontSize = '30px';
	
	// Ocultar opciones de tiempo
	document.getElementById('timerOptions').style.display = 'none';
	
	// Cambiar texto del botón
	const actionButton = document.getElementById('actionButton');
	actionButton.textContent = '+1';
	
	// Iniciar temporizador
	startTimer();
}

function startTimer() {
  clearInterval(timerInterval);
  remainingTime = timerValue;
  document.getElementById('timerCircle').textContent = remainingTime;
  
  // Mostrar la imagen del burro después del audio
  timerDisplay.classList.add('show-donkey');
	  
  // Reproducir el sonido "vamos" y luego mostrar el burro
  playAudioAndWait(vamosAudio)
    .then(() => {
      
      // Actualiza el timer de inmediato
      updateTimer();

      // Luego inicia el setInterval para las siguientes actualizaciones cada 1 segundo
      timerInterval = setInterval(updateTimer, 1000);
    })
    .catch(error => {
      console.error("Error al reproducir el sonido del vamos:", error);
    });
}

function updateTimer() {
  // Si quedan 10 segundos, reproducir el audio de últimos segundos
  if (remainingTime === 10) {					  
    ultimosSegundosAudio.play().catch(error => {
      console.error("Error al reproducir el sonido de últimos segundos:", error);
    });
  }
  
  // Disminuir el contador y actualizar la interfaz
  remainingTime--;
  document.getElementById('timerCircle').textContent = remainingTime;
  
  if (remainingTime <= 0) {
    clearInterval(timerInterval);
    endGame();
  }
}

function playAudioAndWait(audio) {
  return new Promise((resolve, reject) => {
    audio.addEventListener('ended', resolve, { once: true });
    audio.play().catch(reject);
  });
}


function incrementAnswer() {
	if (gameStarted && remainingTime > 0) {
		answers++;
		const answerCounter = document.getElementById('answerCounter');
		answerCounter.textContent = answers;
		
		// Actualizar color basado en la comparación con el objetivo
		updateCounterColor();
	}
}

function updateCounterColor() {
	const answerCounter = document.getElementById('answerCounter');
	
	// Eliminar la clase rainbow si existe
	answerCounter.classList.remove('rainbow');
	
	if (answers < targetAnswers) {
		answerCounter.style.backgroundColor = 'var(--red-color)';
	} else if (answers === targetAnswers) {
		answerCounter.style.backgroundColor = 'var(--secondary-color)';
	} else {
		answerCounter.style.backgroundColor = '';
		answerCounter.classList.add('rainbow');
	}
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function endGame() {
	clearInterval(timerInterval);
	gameStarted = false;
	let mensaje = '';
	
	// Desactivar botón
	const actionButton = document.getElementById('actionButton');
	actionButton.disabled = true;
	
	delay(2000).then(() => {
	  showMessage(answers - targetAnswers);	
	});
	
	// Hacer el contador de respuestas más grande
	const answerCounter = document.getElementById('answerCounter');
	answerCounter.style.fontSize = '30px';
	answerCounter.onclick = null; // Desactivar incremento al hacer clic
}

function showMessage(result) {
	// Mostrar mensaje
	if (result < 0) {
		cartas = (result == -1) ? 'carta':'cartas';
		mensaje = 'Eres un BURRO. \n Roba ' + (result*(-1)) + ' ' + cartas + ' de burrito';
	
		// Reproducir el sonido del burrito
		burritoAudio.play().catch(error => {
			console.error("Error al reproducir el sonido del burrito:", error);
		});
	} else {
		
			
		// Ocultar al burro quitando la clase
		timerDisplay.classList.remove('show-donkey');
	
		// Reproducir el aplauso
		aplausoAudio.play().catch(error => {
			console.error("Error al reproducir el sonido del aplauso:", error);
		});
		
		if (result == 0) {
			mensaje = 'No eres tan BURRO. \n Te descartas de 1 burrito';
		} else {
			mensaje = 'No eres nada BURRO. \n Te descartas de 2 burritos';
		}
	}
	
	document.getElementById('message').textContent = '¡Tiempo! ' + mensaje;
}

function resetGame() {
	clearInterval(timerInterval);
	gameStarted = false;
	
	// Resetear contadores
	remainingTime = timerValue;
	answers = 0;
	result = 0;
	
	// Ocultar al burro quitando la clase
	timerDisplay.classList.remove('show-donkey');
  
	// Mostrar opciones de tiempo
	document.getElementById('timerOptions').style.display = 'flex';
	
	// Resetear contador de respuestas
	const answerCounter = document.getElementById('answerCounter');
	answerCounter.textContent = 'Número de respuestas pujadas';
	answerCounter.style.backgroundColor = 'var(--secondary-color)';
	answerCounter.style.fontSize = '30px';
	answerCounter.classList.remove('rainbow');
	answerCounter.onclick = toggleAnswerOptions;
	
	// Ocultar el objetivo
	document.getElementById('targetCounter').style.display = 'none';
	
	// Resetear botón
	const actionButton = document.getElementById('actionButton');
	actionButton.textContent = 'COMENZAR';
	actionButton.disabled = true;
	
	// Resetear tiempo mostrado
	document.getElementById('timerCircle').textContent = timerValue;
	
	// Limpiar mensaje
	document.getElementById('message').textContent = '';
}

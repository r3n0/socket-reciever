const nCanales = 15;
let socket = [];
let nombresDeCanales = []; // DEBE ser el mismo que el del emisor
let valorRecibido = [];
let valorCanal2;
let colores = [];

function setup() {
	createCanvas(800, 600);

	for (let i = 0; i < nCanales; i++) {
		nombresDeCanales[i] = `canal-${i + 1}`;
		colores[i] = color(random(100, 180), random(100, 180), random(100, 180));
	}
	for (let i = 0; i < nCanales; i++) {
		// Conexión al servidor (usa tu IP y puerto 3000)
		socket[i] = io('http://10.0.0.101:3000', {
			transports: ['websocket'],
		});

		// 1. Confirmar conexión y unirse al canal
		socket[i].on('connect', () => {
			console.log('✅ Receptor conectado con ID:', socket[i].id);
			socket[i].emit('join-channel', nombresDeCanales[i]);
		});

		// 2. ESCUCHAR el evento que envía el servidor
		socket[i].on('update-value', (data) => {
			valorRecibido[i] = data;
			// console.log('📥 Valor recibido desde el emisor:', valorRecibido[i]);
		});

		if (nombresDeCanales[i] == 'canal-2') {
			valorCanal2 = socket[i];
		}
	}
}

function draw() {
	background(255);
	let barheight = 20;

	for (let i = 0; i < nCanales; i++) {
		let lineHeight = (height / nCanales) * (i + 1);
		fill(colores[i]);
		textSize(barheight);
		text(nombresDeCanales[i], barheight, lineHeight - barheight / 2);

		if (nombresDeCanales[i] == 'canal-2' && valorRecibido[i] != undefined) {
			noStroke();
			fill(255, 20, 0);
			rect(100, lineHeight - barheight, valorRecibido[i].val1 * 2, barheight);
			fill(100, 20, 0);
			text('val1: ' + valorRecibido[i].val1, 100, lineHeight - barheight / 2);
			fill(20, 255, 0);
			rect(600, lineHeight - barheight, valorRecibido[i].val2 * 2, barheight);
			fill(20, 100, 0);
			text('val2: ' + valorRecibido[i].val2, 600, lineHeight - barheight / 2);
			continue;
		}

		if (nombresDeCanales[i] == 'canal-3' && valorRecibido[i] != undefined) {
			noStroke();
			fill(255, 20, 0);
			rect(100, lineHeight - barheight, valorRecibido[i].contrast * 2, barheight);
			fill(100, 20, 0);
			text('contrast: ' + valorRecibido[i].contrast, 100, lineHeight - barheight / 2);
			fill(20, 255, 0);
			rect(600, lineHeight - barheight, valorRecibido[i].brightness * 2, barheight);
			fill(20, 100, 0);
			text('brightness: ' + valorRecibido[i].brightness, 600, lineHeight - barheight / 2);
			continue;
		}

		rect(100, lineHeight - barheight, valorRecibido[i] * 4, barheight);
	}


}

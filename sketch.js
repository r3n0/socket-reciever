const nCanales = 15;
let socket = [];
let nombresDeCanales = []; // DEBE ser el mismo que el del emisor
let valorRecibido = [];

function setup() {
	createCanvas(400, 200);

	for (let i = 0; i < nCanales; i++) {
		nombresDeCanales[i] = `canal-${i + 1}`;
	}
	for (let i = 0; i < nCanales; i++) {
		// Conexión al servidor (usa tu IP y puerto 3000)
		socket[i] = io('https://telepresencia.art', {
			path: '/datos-v1/', // <--- MUY IMPORTANTE: debe coincidir exactamente
			transports: ['polling'], // Seguimos con polling para mayor seguridad ante el firewall
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
	}
}

function draw() {
	background(255);
	let barheight = 5;

	for (let i = 0; i < nCanales; i++) {
		let lineHeight = (height / nCanales) * (i + 1);
		fill(0);
		textSize(barheight);
		text(nombresDeCanales[i], barheight, lineHeight - barheight / 2);

		rect(30, lineHeight - barheight, valorRecibido[i], barheight);
	}
}

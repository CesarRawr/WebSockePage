const main = () => {

	/*
		------------------------
			       Map
		------------------------
	*/
	let data = new Array();
	let markers = new Array();

	const accessToken = 'pk.eyJ1IjoiY2VzYXItcndyIiwiYSI6ImNrbnYxM2w5NDA3OTMyd3M1eDNmNmExdGoifQ.Ct4E5u0Xkq9FWo2SASOszg';

	let mymap = L.map('mapid').setView([51.505, -0.09], 13);

	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	    maxZoom: 18,
	    id: 'mapbox/streets-v11',
	    tileSize: 512,
	    zoomOffset: -1,
	    accessToken: accessToken
	}).addTo(mymap);

	// -----------------------
	// 		  Homework
	// -----------------------

	const setMarker = (json) => {
		
		let popup = popupTemplate(json);
		let marker = L.marker([json.coordinates.x, json.coordinates.y]).addTo(mymap);

		marker.bindPopup(popup);
		data.push(json);
		markers.push(marker);
	}

	const updateMarker = (json, index) => {

		console.log("Tempo: " + json.tem + " Hum: " + json.hum);
		data[index] = json;

		if (markers[index].isPopupOpen()) {
			let popup = document.querySelector(`#${ json.id }`);
			let temp = popup.querySelector("span.tem-data");
			let hum = popup.querySelector("span.hum-data");

			temp.textContent = `${json.tem} °C`;
			hum.textContent = json.hum;
		}
	}

	/*
		------------------------
			   WebSockets
		------------------------
	*/

	let clientName = `LostMessage#${ Math.floor(Math.random() * 999999) + 1 }`;

	const location = {
		hostname: "broker.emqx.io",
		port: 8084
	}

	// Create a client instance
	client = new Paho.MQTT.Client(location.hostname, Number(location.port), clientName);

	// set callback handlers
	client.onConnectionLost = onConnectionLost;
	client.onMessageArrived = onMessageArrived;

	// connect the client
	client.connect({useSSL: true, onSuccess:onConnect});


	// called when the client connects
	function onConnect() {
	  // Once a connection has been made, make a subscription and send a message.
	  console.log("onConnect");
	  client.subscribe("getOutOfMyTopicBtch");
	}

	// called when the client loses its connection
	function onConnectionLost(responseObject) {
	  if (responseObject.errorCode !== 0) {
	    console.log("onConnectionLost:"+responseObject.errorMessage);
	  }
	}

	// called when a message arrives
	function onMessageArrived(message) {
		try {
			const json = JSON.parse(message.payloadString);
			addMarker(json);
		}
		catch(error) {
			console.log(error);
			alert("algo salió mal");
		}
	}

	// -----------------------
	// 		  Homework
	// -----------------------

	function addMarker(json) {

		const isData = data.findIndex((some) => some.id === json.id);

		isData === -1 ? (
			setMarker(json)
		):(
			(data[isData].tem !== json.tem || data[isData].hum !== json.hum) && (
				updateMarker(json, isData)
			)
		);
	}

	function popupTemplate(json) {
		return `
			<div class="popup-info" id="${ json.id }">
				<div>
					<div class="temp">
						<span class="name">Temperatura</span>
						<span class="tem-data">${ json.tem } °C</span>
					</div>
					<div class="hum">
						<span class="name">Humedad</span>
						<span class="hum-data">${ json.hum }</span>
					</div>
				</div>
			</div>
		`;
	}
}

window.addEventListener('load', main);
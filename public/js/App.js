const main = () => {


		let asd = 5;
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
		let marker = L.marker([json.coordinates.x, json.coordinates.y]).addTo(mymap);
		marker.bindPopup(`<b>temperatura</b><br>${ json.tem }`);
		data.push(json);
		markers.push(marker);
	}

	const updateMarker = (json, index) => {
		console.log("Tempo: " + json.tem + " Hum: " + json.hum);
		data[index] = json;
		let popup = markers[index].getPopup();
		popup._content = `<b>temperatura</b><br>${ json.tem }`;
	}

	/*
		------------------------
			   WebSockets
		------------------------
	*/

	const location = {
		hostname: "broker.emqx.io",
		port: 8083
	}

	// Create a client instance
	client = new Paho.MQTT.Client(location.hostname, Number(location.port), "LostMessage");

	// set callback handlers
	client.onConnectionLost = onConnectionLost;
	client.onMessageArrived = onMessageArrived;

	// connect the client
	client.connect({onSuccess:onConnect});


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
}

window.addEventListener('load', main);
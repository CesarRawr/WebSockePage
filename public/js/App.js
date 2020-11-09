const main = () => {

	let noBtn = document.querySelector('.no');
	let yesBtn = document.querySelector('.yes');

	noBtn.addEventListener('mouseover', (e) => {

		let container = document.querySelector('.container');
		
		let x = container.clientWidth - noBtn.clientWidth;
		let y = container.clientHeight - noBtn.clientHeight;

		let randX = Math.floor(Math.random() * x) + 1 - noBtn.clientWidth;
		let randY = Math.floor(Math.random() * y) + 1 - noBtn.clientHeight;

		noBtn.style.marginLeft = 0;
		noBtn.style.top = `${randY}px`;
		noBtn.style.left = `${randX}px`;
	});

	yesBtn.addEventListener('click', (e) => {

		let meme = document.querySelector('.img');

		meme.style.top = 0;
	});
}

window.addEventListener('load', main);
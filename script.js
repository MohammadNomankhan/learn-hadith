const narratorName = document.querySelector('.hadith__narrator--name');
const hadithText = document.querySelector('.hadith__text--msg');
const nextHadith = document.querySelector('.hadith__new');
const tweet = document.querySelector('#tweetIt');
const listen = document.querySelector('.positioning');
const loader = document.querySelector('.loader');
const hadithContainer = document.querySelector('.hadith__container');
const navigation = document.querySelector('.navigation');
const hadithFav = document.querySelector('.hadith__favorite');
const close = document.querySelector('.close');
const openModal = document.querySelector('.modal-show');
const save = document.querySelector('.save');
const hadithForm = document.getElementById('hadithForm');
const formText = document.getElementById('formText');
const currentPage = document.querySelector('.learnings');
const favorite = document.querySelector('.favorite__container');
const getHadithNumber = document.getElementById('getHadithNumber');
const getHadithText = document.getElementById('getHadithText');
const getHadithView = document.getElementById('getHadithView');
const nextView = document.querySelector('.next');

const apiKey = '$2y$10$ggO7VHY98sK5RlybaaD3vuAHF9k6nMYxwRjh2CzEU1SZ5WeUfJLYC';
const hadithCount = 10;
const apiUrl = `https://hadithapi.com/public/api/hadiths?apiKey=${apiKey}&paginate=${hadithCount}`;

let hadithArray = [];
let storedHadiths = [];
let hadithNumber = 0;
function showContent() {
	loader.classList.add('hidden');
	hadithContainer.classList.remove('hidden');
	navigation.classList.remove('hidden');
}

async function getHadith() {
	loader.classList.remove('hidden');
	hadithContainer.classList.add('hidden');
	navigation.classList.add('hidden');	
	try {
		const response = await fetch(apiUrl);
		const rawData = await response.json();
		hadithArray = rawData.hadiths.data;
		console.log(rawData);
		displayHadith();
	} catch(e) {
		console.log('oops error:', e);
	}
}

function displayHadith() {
	const hadith = hadithArray[Math.floor(Math.random() * hadithArray.length)];
	hadithNumber = hadith.hadithNumber;
	narratorName.textContent = hadith.englishNarrator;
	hadithText.textContent = hadith.hadithEnglish;
	showContent();
}

function tweetIt() {
	const twitterUrl = `https://twitter.com/intent/tweet?text=${hadithText.textContent} ${narratorName.textContent}`;
	window.open(twitterUrl, '_blank');
}

tweet.addEventListener('click', tweetIt);
nextHadith.addEventListener('click', getHadith);

getHadith();

// text to speech
const audioElement = document.querySelector('.hadith__audio');
const VoiceRSS={speech(e){this._validate(e),this._request(e)},_validate(e){if(!e)throw"The settings are undefined";if(!e.key)throw"The API key is undefined";if(!e.src)throw"The text is undefined";if(!e.hl)throw"The language is undefined";if(e.c&&"auto"!=e.c.toLowerCase()){let a=!1;switch(e.c.toLowerCase()){case"mp3":a=(new Audio).canPlayType("audio/mpeg").replace("no","");break;case"wav":a=(new Audio).canPlayType("audio/wav").replace("no","");break;case"aac":a=(new Audio).canPlayType("audio/aac").replace("no","");break;case"ogg":a=(new Audio).canPlayType("audio/ogg").replace("no","");break;case"caf":a=(new Audio).canPlayType("audio/x-caf").replace("no","")}if(!a)throw`The browser does not support the audio codec ${e.c}`}},_request(e){const a=this._buildRequest(e),t=this._getXHR();t.onreadystatechange=function(){if(4==t.readyState&&200==t.status){if(0==t.responseText.indexOf("ERROR"))throw t.responseText;let e=t.responseText;audioElement.src=e,audioElement.onloadedmetadata=(()=>{audioElement.play()})}},t.open("POST","https://api.voicerss.org/",!0),t.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8"),t.send(a)},_buildRequest(e){const a=e.c&&"auto"!=e.c.toLowerCase()?e.c:this._detectCodec();return`key=${e.key||""}&src=${e.src||""}&hl=${e.hl||""}&r=${e.r||""}&c=${a||""}&f=${e.f||""}&ssml=${e.ssml||""}&b64=true`},_detectCodec(){const e=new Audio;return e.canPlayType("audio/mpeg").replace("no","")?"mp3":e.canPlayType("audio/wav").replace("no","")?"wav":e.canPlayType("audio/aac").replace("no","")?"aac":e.canPlayType("audio/ogg").replace("no","")?"ogg":e.canPlayType("audio/x-caf").replace("no","")?"caf":""},_getXHR(){try{return new XMLHttpRequest}catch(e){}try{return new ActiveXObject("Msxml3.XMLHTTP")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP")}catch(e){}try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(e){}throw"The browser does not support HTTP request"}};

let isPlaying = false;
function listenHadith() {
	isPlaying = true;
	listen.classList.replace('fa-microphone-slash', 'fa-microphone');
	VoiceRSS.speech({
	            key: '7d428cd6d81845f290464b4a3acd21e7',
	            src: `${hadithText.textContent}`,
	            hl: 'en-gb',
	            v: 'Alice',
	            r: 0, 
	            c: 'mp3',
	            f: '44khz_16bit_stereo',
	            ssml: false
	        });
}

function stopHadith() {
	isPlaying = false;
	stopVoice();
}

function changeIcon() {
	listen.classList.replace('fa-microphone', 'fa-microphone-slash');
}

function stopVoice() {
	audioElement.pause();
	changeIcon();
	isPlaying = false;
}

audioElement.addEventListener('ended', changeIcon);
nextHadith.addEventListener('click', stopVoice);
listen.addEventListener('click',() => isPlaying ? stopHadith() : listenHadith());

// listenHadith();


// open and close add to fav

function showModal() {
	hadithContainer.classList.add('hidden');
	openModal.classList.remove('hidden');
	currentPage.style.display = 'none';
	stopVoice();
}
function hideModal() {
	hadithContainer.classList.remove('hidden');
	openModal.classList.add('hidden');
	currentPage.style.display = 'flex';
}

hadithFav.addEventListener('click', showModal);
close.addEventListener('click', hideModal);
window.addEventListener('click', (e) => (e.target === openModal ? hideModal() : false))

// save hadith

function saveHadith(e) {
	e.preventDefault();
	// the problem was that it use to update whole array with current values
	// and we want to save each.
	const saveThisHadith = formText.value;
	const numberValue = hadithNumber;
	const textValue = saveThisHadith;
	const storeHadith = {
		number: numberValue,
		value: textValue
	};
	storedHadiths.push(storeHadith);
	localStorage.setItem('favoriteHadiths', JSON.stringify(storedHadiths));
	hadithForm.reset();
	console.log('sucess');
}
hadithForm.addEventListener('submit', saveHadith);



async function fetchhadith(getNumber) {
	const getUrl = `https://hadithapi.com/public/api/hadiths?apiKey=${apiKey}&hadithNumber=${getNumber}&book=sahih-bukhari`;
	const response = await fetch(getUrl);
	const data = await response.json();
	let fetchText = await data.hadiths.data[0].hadithEnglish;
	getHadithText.textContent = fetchText;
}

let index = 0;
function getStoredHadiths() {
	if (localStorage.getItem('favoriteHadiths')) {
		index = (index < (JSON.parse(localStorage.getItem('favoriteHadiths')).length) ) ? index++ : 0;
		console.log('length',(JSON.parse(localStorage.getItem('favoriteHadiths')).length));
		let getNumber = JSON.parse(localStorage.getItem('favoriteHadiths'))[index].number;
		getHadithView.textContent = (JSON.parse(localStorage.getItem('favoriteHadiths')))[index].value;
		getHadithNumber.textContent = (JSON.parse(localStorage.getItem('favoriteHadiths')))[index].number;
		console.log('index',index);
		console.log('getNumber',getNumber);
		console.log('inCalc',((index < (JSON.parse(localStorage.getItem('favoriteHadiths')).length) ) ? index++ : 0));
		fetchhadith(getNumber);	
	} else {
		favorite.textContent = "";
		const emptyMsg = document.createElement('h1');
		emptyMsg.textContent = "NO SAVED HADITHS";
		emptyMsg.style.fontSize = "xx-large";
		favorite.appendChild(emptyMsg);
	}
}

function showSavedHadiths() {
	if (favorite.classList.contains('hidden')) {
		favorite.classList.remove('hidden');
		hadithContainer.classList.add('hidden');
		currentPage.textContent = 'Show hadiths';
		stopVoice();
		isPlaying = false;
		getStoredHadiths();
	} else {
		favorite.classList.add('hidden');
		hadithContainer.classList.remove('hidden');
		currentPage.textContent = 'My leanings';
	}
}

navigation.addEventListener('click', showSavedHadiths);
nextView.addEventListener('click', getStoredHadiths);

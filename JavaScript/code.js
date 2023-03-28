/*jshint sub:true*/
console.time('Loaded in');
console.log('Page loading...');

// querySelector simplification
function _(query){
	return document.querySelector(query);
}

function _all(query){
	return document.querySelectorAll(query);
}

// set songList
let songList = localStorage.getItem('songList') === 'Drive' ? songListDrive : songListLocal;

_('#toggleAssets').innerHTML = `Use ${localStorage.getItem('songList') === 'Drive' ? 'Local File' : 'Google Drive'} Assets`;

function toggleAssets() {
  if (localStorage.getItem('songList') === 'Drive') {
    localStorage.setItem('songList', 'Local');
    _('#toggleAssets').innerHTML = 'Use Google Drive Assets';
  } else {
    localStorage.setItem('songList', 'Drive');
    _('#toggleAssets').innerHTML = 'Use Local File Assets';
    
  }
  
  songList = localStorage.getItem('songList') === 'Drive' ? songListDrive : songListLocal;
}

// addMultiEventListener function
window.addMultiEventListener = (eventNames, listener) => {
  // split via spaces
  var events = eventNames.split(' ');
  for (var i = 0; i < events.length; i++) {
    window.addEventListener(events[i], listener, false);
  }
};

const jsmediatags = window.jsmediatags;





//////////////////////////////////////////////////////////////





/*Variables*/
const songListLength = songList.length;

function getRandomArbitrary(min, max) {
  return parseInt(Math.random()*(max-min)+min);
}

var currentSongIndex;
console.log('Loading songs...');
var newSongIndex = sessionStorage.getItem('newSongIndex');

if (newSongIndex) {
  currentSongIndex = newSongIndex;
} else {
  currentSongIndex = getRandomArbitrary(0, songListLength);
}

let song = songList[currentSongIndex];

var newVolume;
const body = _('body');

let player = _('.player'),
	toggleSongList = _('.toggle-list');

var main = {
	volumeControls:_('.volume-controls'),
	volume:_('.volume-controls input'),
	
	audio:_('audio'),
	thumbnail:_('.player .main img'),
	songname:_('.details h2'),
	artistname:_('.details p'),
	musicDuration:_('.duration'),
	currentMusicTime:_('.current-time'),
	playBackRate: _('#playBackRate'),
	
	seekbar:_('.player .main input.seekbar'),
	prevControl:_('.prev-control'),
	playPauseControl:_('.play-pause-control'),
	nextControl:_('.next-control'),
	repeat:_('.repeat'),
	shuffle:_('.shuffle'),
	randomSongBtn:_('.loadRandomSongBtn'),
	
	songs:_all('.item'),
	dividers:_all('.divider'),
	collapsibles: _all('.collapsible'),
  collapsers: _all('.collapser'),
	playerList:_('.player-list'),
	search: _('#songSearch'),
	searchResults: _('#noResults'),
	
	analytics: {
	  closeAnalyt: _('.hideAnalyt'),
	  openAnalyt: _('.openAnalyt'),
	  time: _('.time'),
	  date: _('.date'),
	  wifi: _('#checkOnline'),
	  bat: _('.battery'),
	  bluetooth: _('#bluetooth'),
  	 
  	console: _('#console'),
  	  consoleTitle: _('#logTitle'),
  	  closeConsole: _('#closeDebug'),
  	  openConsole: _('#openDebug'),
	  fullScrTglO: _('.fSToA'),
	  fullScrTglC: _('.fSTcA'),
	},
	
	Analytics: _('.analytics'),
	
	welcomeMsg: _('.welcomeMsg'),
	closeWelcome: _('.closeWelcome'),
	
	nav: {
	  title: _('.navTitle'),
	  accessNav: _('#access_nav'),
    closeNav: _('#closeNav'),
  	time:_('.navTime'),
  	date:_('.navDate'),
	},
};

var looping = false;
var shuffling = false;

var timePaused;

// set button checks
window.addEventListener('keydown', checkKeyPressed, false);
window.addEventListener('mouseup', mouseButton);

var titleMain = `Muzak Player`;
main.nav.title.innerHTML = titleMain;
var titleTimeShown = (localStorage.getItem('titleTimeShown') === 'true') ? true : false;

// capitilizer
function capitlizeFirst(str) {
  // checks for null, undefined and empty string
  if (!str) return;
  return str.match('^[a-z]') ? str.charAt(0).toUpperCase() + str.substring(1) : str;
}





//////////////////////////////////////////////////////////////





/*Navigation*/
main.nav.accessNav.addEventListener('click', function() {
  body.classList.add('activeNav');
  console.log('Nav opened');
});

  
main.nav.closeNav.addEventListener('click', function(){
  body.classList.remove('activeNav');
  console.log('Nav closed');
});

/*Dark Mode*/
function toggleDarkMode() {
  body.classList.toggle('dark-mode');
  console.log('Dark Mode turned ' + (body.classList.contains('dark-mode') ? 'on' : 'off'));
  
  _('#darkModeButton').classList.toggle('fa-rotate-180');
  localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
}

// set dark mode on load
var darkModeOn = (localStorage.getItem('darkMode') === 'true') ? true : false;
if (darkModeOn === false) {
  toggleDarkMode();
}

//////////////////////////////////////////////////////////////




// Analytics settup
var Analytics = (function(){
  
  // check twenty four hour time set
  var TFHourTime = localStorage.getItem('TFHT');
  // check if time buttons clicked, change TFHT settings
  main.analytics.time.addEventListener('click', function(){
    if (TFHourTime === 'false') {
      TFHourTime = 'true';
    } else {
      TFHourTime = 'false';
    }
    localStorage.setItem('TFHT', TFHourTime);
  });
  main.nav.time.addEventListener('click', function(){
    if (TFHourTime === 'false') {
      TFHourTime = 'true';
    } else {
      TFHourTime = 'false';
    }
    localStorage.setItem('TFHT', TFHourTime);
  });
  
  // Set time
  function setTime() {
    let d = new Date();
    let h = addZero(d.getHours());
    let m = addZero(d.getMinutes());
    let s = addZero(d.getSeconds());
    let p = ``;
    
    if (h >= 12 && TFHourTime === 'false'){
      p = ` PM <i class='fad fa-moon-stars' style='font-size:13px;'></i>`;
    } else if (h < 12 && TFHourTime === 'false') {
      p = ` AM <i class='fad fa-sun' style='font-size:13px;'></i>`;
    } else if (h >= 12 && TFHourTime === 'true') {
      p = `\b\b<i class='fad fa-moon-stars' style='font-size:13px;'></i>`;
    } else if (h < 12 && TFHourTime === 'true') {
      p = `\b\b<i class='fad fa-sun' style='font-size:13px;'></i>`;
    }
    
    if (h > 12 && TFHourTime === 'false') {
      h -= 12;
    } else {
      h = h;
    }
    
    let timeNow = 'Time: ' + h + ' : ' + m + ' : ' + s + p;
    main.analytics.time.innerHTML = timeNow;
    main.nav.time.innerHTML = timeNow;
  }
  
  // Set dates
  function setDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yy = (today.getFullYear().toString().substr(-2));
    var yyyy = today.getFullYear();
    
    // array of date names
    var days = ['Sun','Mon','Tues','Wed','Thur','Fri','Sat'];
    var months = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
  
    Date.prototype.getMonthName = function() {
      return months[ this.getMonth() ];
    };
    Date.prototype.getDayName = function() {
      return days[ this.getDay() ];
    };
      
    var day = today.getDayName();
    var month = today.getMonthName();
    
    var date = 'Date: '+ day + ', ' + month + ' ' + dd + ', ' + yyyy;
    main.analytics.date.innerHTML = date;
    main.nav.date.innerHTML = date;
  }
  
  // Update battery info
  var batInHtml;
  function updateBatteryInfo(battery) {
    batInHtml = `Battery: ${Math.floor(battery.level * 100)}% - `;
    
    var chargingTime;
    if (battery.chargingTime) {
      chargingTime = 0;
    } else {
      chargingTime = battery.chargingTime;
    }
    
    if (battery.charging && chargingTime > 0) {
      batInHtml += ` Charging... \b ${formatTime(chargingTime)}s remaining`;
    } else if (battery.charging && chargingTime <= 0) {
      batInHtml += ` Fully charged`;
    } else if (!battery.charging) {
      batInHtml += ` ${formatTime(battery.dischargingTime)}s left`;
    }
    
    main.analytics.bat.innerText = batInHtml;
  }
  
  // get battery info
  function getBattery() {
    navigator.getBattery().then(function(battery) {
      battery.addEventListener('levelchange', function(){updateBatteryInfo(battery)});
      battery.addEventListener('chargingchange', function(){updateBatteryInfo(battery)});
      battery.addEventListener('chargingtimechange', function(){updateBatteryInfo(battery)});
      battery.addEventListener('dischargingtimechange', function(){updateBatteryInfo(battery)});
      
      updateBatteryInfo(battery);
    });
  }
  
  // get wifi connection
  var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  var type = window.navigator.onLine;
  
  function getWIFI() {
    var ifConnected = window.navigator.onLine;
    
    if (ifConnected) {
      main.analytics.wifi.innerHTML = 'Wifi Online';
      main.analytics.wifi.style.color = 'green';
    } else {
      main.analytics.wifi.innerHTML = 'Wifi Offline';
      main.analytics.wifi.style.color = 'red';
    }
    
    (type === ifConnected) ? false : console.log(capitlizeFirst(connection.type) + ' ' + (ifConnected ? ('connected - ' + connection.effectiveType) : 'disconnected '));
    type = ifConnected;
  }
  
  connection.addEventListener('change', getWIFI);
  
  // bluetooth connection
  function getBluetooth() {
    navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['battery_service'] // Required to access service later.
    })
    .then(device => device.gatt.connect())
    .then(server => {
      // Getting Battery Service…
      return server.getPrimaryService('battery_service');
    })
    .then(service => {
      // Getting Battery Level Characteristic…
      return service.getCharacteristic('battery_level');
    })
    .then(characteristic => {
      // Reading Battery Level…
      return characteristic.readValue();
    })
    .then(value => {
      console.log(`Battery percentage is ${value.getUint8(0)}`);
    })
    .catch(error => { console.log(error); });
  }
  
  main.analytics.bluetooth.addEventListener('click', function(){
    getBluetooth();
  });
  
  // open Analytics
  function openAnalyt() {
    main.Analytics.style.display = 'block';
    main.analytics.openAnalyt.style.display = 'none';
    main.analytics.fullScrTglC.style.display = 'none';
    main.analytics.fullScrTglO.style.display = 'block';
    console.log('Analytics opened');
  }
  
  // hide Analytics
  function hideAnalyt() {
    main.Analytics.style.display = 'none';
    main.analytics.openAnalyt.style.display = 'block';
    main.analytics.fullScrTglO.style.display = 'none';
    main.analytics.fullScrTglC.style.display = 'block';
    console.log('Analytics hidden');
  }
  
  // toggle Analytics
  function toggleAnalyt() {
    if (main.Analytics.style.display === 'none') {
      main.Analytics.style.display = 'block';
      main.analytics.openAnalyt.style.display = 'none';
      main.analytics.fullScrTglC.style.display = 'none';
      main.analytics.fullScrTglO.style.display = 'block';
      console.log('Analytics opened');
    } else {
      main.Analytics.style.display = 'none';
      main.analytics.openAnalyt.style.display = 'block';
      main.analytics.fullScrTglO.style.display = 'none';
      main.analytics.fullScrTglC.style.display = 'block';
      console.log('Analytics hidden');
    }
  }
  
  // Expose functions
  return {
    time: setTime,
    date: setDate,
    batteryUpdate: updateBatteryInfo,
    getBattery: getBattery,
    bluetooth: getBluetooth,
    wifi: getWIFI,
    open: openAnalyt,
    hide: hideAnalyt,
    toggle: toggleAnalyt,
  }
}());

// set up Analytics
Analytics.wifi();
Analytics.getBattery();
Analytics.time();
Analytics.time();

var randomSong;
/*Title changing function*/
function changeTitle() {
  let songName = songList[currentSongIndex].songname;
  let songArtist = songList[currentSongIndex].artistname;
  if (titleTimeShown === true) {
    document.title  = `${titleMain} | ${songName} by ${songArtist}\n${formatTime(main.audio.currentTime)} | ${main.musicDuration.innerHTML}`;
  } else {
    document.title  = `${titleMain} | ${songName} by ${songArtist}`;
  }
}

// toggle time in the title of the page
function toggleTitleTime() {
  if (titleTimeShown === false) {
    titleTimeShown = true;
  } else {
    titleTimeShown = false;
  }
  
  localStorage.setItem('titleTimeShown', titleTimeShown);
}

// delay function
function delay(time) {
  return new Promise(resolve => window.setTimeout(resolve, time));
}

// add zero if # < 10
function addZero(i) {
  if (i < 10) {
    i = '0' + i;
  }
  return i;
}


/*format time in HH:MM:SS format*/
const formatTime = (time) => {
    // failsafe
    if (!time) {
      return `00 : 00`;
    } else {
  
    // get time values
    var sec_num = parseInt(time, 10);
    var hours   = Math.floor(sec_num / 3600);
    var minutes = addZero(Math.floor((sec_num - (hours * 3600)) / 60));
    var seconds = addZero(sec_num - (hours * 3600) - (minutes * 60));

    // hide/show hours in time
    if (hours === 0 || !hours || hours === NaN) {
      // hide hours if they're non-existent...
      hours = ``;
    } else {
      // else show
      hours = `${addZero(hours)} :`;
    }
    
    // output time
    return `${hours} ${minutes} : ${seconds}`;
}};

// open window function
function popupWindow(url='about:blank', windowName=null, win=window, w='75%', h='16:9', content=null, closeTime=null) {
    // centering
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;
    const y = win.top.outerHeight / 2 + win.top.screenY - (h / 2) + dualScreenTop;
    const x = win.top.outerWidth / 2 + win.top.screenX - (w / 2) + dualScreenLeft;
   
    // opening window
    const n = win.open(url, windowName, `popup, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`);
    
    // write content
    if(content) {
      n.document.write(content);
    }
    
    // close window
    if(closeTime) {
      win.setTimeout(function() {
        n.close();
      }, closeTime);
    }
    
    // focus on window
    if (window.focus) {
      newWindow.focus();
    }
    
    console.log('Opened window - ' + windowName);
}

// open Fullscreen
function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
  
  console.log(`Element (${elem}) entered fullscreen`);
}

// close Fullscreen
function closeFullscreen(elem) {
  if (elem.exitFullscreen) {
    elem.exitFullscreen();
  } else if (elem.webkitExitFullscreen) { /* Safari */
    elem.webkitExitFullscreen();
  } else if (elem.msExitFullscreen) { /* IE11 */
    elem.msExitFullscreen();
  }
  
  console.log(`${elem} Exited fullscreen`);
}

// toggle fullscreen
var fullScrTgl = _all('.toggleFullscreen');
function toggleFullscreen() {
  const doc = document.documentElement;
    if (!document.fullscreen) {
      openFullscreen(doc);
      for (i = 0; i < fullScrTgl.length; i++){
        fullScrTgl[i].classList.remove('fa-expand');
        fullScrTgl[i].classList.add('fa-compress');
      }
      return;
    }
     
    closeFullscreen(document);
    for (i = 0; i < fullScrTgl.length; i++){
      fullScrTgl[i].classList.remove('fa-compress');
      fullScrTgl[i].classList.add('fa-expand');
    }
}




//////////////////////////////////////////////////////////////





/*Looping*/
function Loop() {
  shuffling = false;
  if (looping) {
    main.audio.onended = function() {
      main.nextControl.click();
      main.audio.play();
    }
    looping = false;
  } else {
    main.audio.onended = function() {
      main.audio.currentTime = main.seekbar.getAttribute('min');
      main.audio.play();
    }
    looping = true;
  }
  
  let icon = main.repeat.querySelector('i');
  if (looping) {
    icon.classList.remove('fa-repeat-alt');
    icon.classList.add('fa-repeat-1-alt');
  } else {
    icon.classList.remove('fa-repeat-1-alt');
    icon.classList.add('fa-repeat-alt');
  }
  
  console.log('Set looping to ' + looping);
}

/*Shuffle button*/
function Shuffle() {
  looping = false;
  if (!shuffling) {
    shuffling = true;
    main.audio.onended = function() {
      loadRandomArbitrary();
      main.audio.play();
    }
  } else {
    shuffling = false;
    main.audio.onended = function() {
      main.nextControl.click();
      main.audio.play();
    }
  }
  console.log('Set shuffle to ' + shuffling);
  let icon = main.shuffle;
  if (!shuffling) {
    icon.classList.remove('shuffling');
    icon.classList.add('notShuffling');
  } else {
    icon.classList.add('shuffling');
    icon.classList.remove('notShuffling');
  }
}

// Song Adder startup
function addSong() {
  popupWindow('./Song Adder.html', 'Song Adder', window, 336, 573);
}





//////////////////////////////////////////////////////////////



main.songs = _all('.item');
main.dividers = _all('.divider');

// Search Songs
function searchSongs(){
  let input = main.search.value.toLowerCase();
  let items = main.songs;
  let dividers = main.dividers;
  let counter = 0;

  for (let i = 0; i < items.length; i++) {
    if (!items[i].innerHTML.toLowerCase().includes(input)) {
      items[i].style.display = 'none';
      counter++;
    }
    else {
      items[i].style.display = '';
    }
  }
  
  // keeping the result 22 letters long (for asthetic purposes)
  let maxLen = 22;
  if (input.length > maxLen) {
    input = input.substring(0, maxLen - 3) + '...';
  }
  
  // add noresults message at end if all list divs are hidden
  if (counter >= items.length) {
    main.searchResults.innerHTML = `No results found for '${input}'`
  } else {
    main.searchResults.innerHTML = ``
  }
}

// hide dividers
function hideDividers() {
  let dividers = main.dividers;
  for (let i = 0; i < dividers.length; i++) {
    dividers[i].style.display = 'none';
  }
}

// show dividers
function showDividers() {
  let dividers = main.dividers;
  for (let i = 0; i < dividers.length; i++) {
    dividers[i].style.display = '';
  }
}

// setting up song list for good asthetics.
var scrollPos;
toggleSongList.addEventListener('click', function(){
  scrollPos = main.playerList.scrollTop;
	player.classList.toggle('activeSongList');
	if (!player.classList.contains('activeSongList')) {
    let x = _all('.item');
    for (let i = 0; i < x.length; i++) {
      x[i].style.display='';
    }
    main.playerList.blur();
    main.search.blur();
    main.playerList.scrollTop = 0;
	  main.playPauseControl.focus();
	} else {
	  main.playerList.scrollTop = scrollPos;
	}
	
	console.log('Toggled song list ' + (player.classList.contains('activeSongList') ? 'on' : 'off'));
});





//////////////////////////////////////////////////////////////






// limit name's lengths
let nameLength = 20;
_('.player .player-list .list').innerHTML = (songList.map(function(song,songIndex){
	let tabIndex = songIndex + 99;
// 	let songname = song.songname.length ? song.songname.substring(0, 20) + '...' : song.songname.substring(0, 23);

let thumbnail = ((song.thumbnail.startsWith('http')) ? song.thumbnail : ('./Thumbnails/' + song.thumbnail));
let songname = ((song.songname.length < nameLength) ? song.songname : (song.songname.substring(0, nameLength - 3) + '...'));
let artistname = ((song.artistname.length < nameLength) ? song.artistname : (song.artistname.substring(0, nameLength - 3) + '...'));

// set up playlist
if ((song.audio === null || song.audio.startsWith('#t=')) && songIndex === 0) {
	return `
		<div class='divider' songIndex='${songIndex}' tabindex='-1' style='border-top: 2px solid #222; margin-top: 3px;'>
			<div class='details'>
				  <h2>${song.songname}</h2>
				  <p style='position: absolute; right: 10px;'><i class='collapser fas fa-caret-down'></i></p>
			</div>
		</div>
		<div class='collapsible'>
	`;
} else if (song.audio === null || song.audio.startsWith('#t=')) {
  return `
	  </div>
		<div class='divider' songIndex='${songIndex}' tabindex='-1' style='border-top: 2px solid #222; margin-top: 3px;'>
			<div class='details'>
				  <h2>${song.songname}</h2>
				  <p style='position: absolute; right: 10px;'><i class='collapser fas fa-caret-down'></i></p>
			</div>
		</div>
		<div class='collapsible'>
	`;
} else {
  return `
		<div class='item' songIndex='${songIndex}' tabindex='${tabIndex}'>
			<div class='thumbnail'>
				<img src="${thumbnail}" alt='${song.songname}'>
			</div>
			<div class='details'>
  			<h2>${songname}</h2>
  			<p>${artistname}</p>
				<p class='songDuration'>${(songList[songIndex].audio.includes('#t=')) ? formatTime(songList[songIndex + 1].audio.split('=').slice(-1)) : formatTime(0)}</p>
			</div>
		</div>
	`;
}}).join(''));


// search item list
_('#songs').innerHTML = (songList.map(function(song,songIndex){
if (song.audio !== null) {
  return `
		<option value='${song.songname}'>${song.artistname}</option>
	`;
}}).join(''));

  main.songs = _all('.item');
	main.dividers = _all('.divider');
	main.collapsibles = _all('.collapsible');
  main.collapsers = _all('.collapser');
	main.playerList = _('.player-list');
	main.search = _('#songSearch');
	main.searchResults = _('#noResults');

/*Picking a song*/
let songListItems = main.songs;

for(let i = 0; i < songListItems.length; i++){
	songListItems[i].addEventListener('click',function(){
		currentSongIndex = parseInt(songListItems[i].getAttribute('songIndex'));
		loadSong(currentSongIndex);
		toggleSongList.click();
		changeTitle();
	  console.log('Song chosen - ' + songList[currentSongIndex].songname);
	  main.audio.play();
	});
}

/*Closing Catergories*/
var songListDividers = main.dividers;
var content = main.collapsibles;

for (let i = 0; i < songListDividers.length; i++) {
songListDividers[i].addEventListener('click', function() {
    
    contentToCollapse = content[i];
    
    if (contentToCollapse.style.display) {
      contentToCollapse.style.display = null;
      main.collapsers[i].classList.add('fa-caret-down');
      main.collapsers[i].classList.remove('fa-caret-left');
      console.log('Catergory opened: ' + songListDividers[i].innerText);
    } else {
      contentToCollapse.style.display = 'none';
      main.collapsers[i].classList.add('fa-caret-left');
      main.collapsers[i].classList.remove('fa-caret-down');
      console.log('Catergory collapsed: ' + songListDividers[i].innerText);
    }
  });
}





//////////////////////////////////////////////////////////////






function setTimeOnLoad() {
  for (let i = 0; i < 10; i++) {
    let newTime = sessionStorage.getItem('seekbarVal');
    main.audio.currentTime = newTime;
  }
}

looping = (sessionStorage.getItem('looping') === 'true') ? true : false;
shuffling = (sessionStorage.getItem('shuffling') === 'true') ? true : false;

if (sessionStorage.getItem('volume')) {
  changeVolume(sessionStorage.getItem('volume'));
} else {
  changeVolume(1);
}

loadSong(currentSongIndex);
setTimeOnLoad();
changeTitle();

navigator.mediaSession.metadata = new MediaMetadata({
  title: '',
  author: '',
  artwork: [{src: 'https://dummyimage.com/114x114'}],
})

/*Load a song*/
function loadSong(songIndex){
	let song = songList[songIndex];
	currentSongIndex = songIndex;
	let nameLength = 41;
	let Thumbnail = ((song.thumbnail.startsWith('http')) ? song.thumbnail : './Thumbnails/' + song.thumbnail);
	let Audio = ((song.audio.startsWith('http')) ? song.audio : './Music/' + song.audio);
	let Songname = ((song.songname.length > nameLength) ? song.songname : (song.songname.substring(0, nameLength - 3) + '...'));
	let Artistname = ((song.artistname.length > nameLength) ? song.artistname : (song.artistname.substring(0, nameLength - 3) + '...'));
	
  sessionStorage.setItem('newSongIndex', songIndex);
	main.thumbnail.setAttribute('src', Thumbnail);
	main.thumbnail.setAttribute('alt', 'Sorry, this picture could not be displayed.\n' + song.songname);
	document.body.style.background = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url('${Thumbnail}') center no-repeat`;
	document.body.style.backgroundSize = 'cover';
	main.songname.innerText = song.songname;
	main.artistname.innerText = song.artistname;
	main.audio.setAttribute('src', Audio);
  
	main.seekbar.setAttribute('value', 0);
  main.seekbar.setAttribute('min', 0);
	main.seekbar.setAttribute('max', 0);
  main.currentMusicTime.innerText = '00 : 00';
	main.audio.addEventListener('canplay',function(){
		if (song.audio.includes('#t=') && songList[currentSongIndex + 1].audio.includes('#t=')) {
  	  main.seekbar.setAttribute('min', songList[currentSongIndex].audio.split('=').slice(-1));
  	  main.seekbar.setAttribute('max', songList[currentSongIndex + 1].audio.split('=').slice(-1));
  	  main.seekbar.setAttribute('value', main.seekbar.getAttribute('min'));
  	  main.musicDuration.innerHTML = formatTime(main.seekbar.getAttribute('max'));
  	} else if (song.audio.includes('#t=') && !songList[currentSongIndex + 1].audio.includes('#t=')) {
  	  main.seekbar.setAttribute('min', songList[currentSongIndex].audio.split('=').slice(-1));
  	  main.seekbar.setAttribute('max', main.audio.duration);
  	  main.seekbar.setAttribute('value', main.seekbar.getAttribute('min'));
  	  main.musicDuration.innerHTML = formatTime(main.audio.duration);
  	} else {
		  main.seekbar.setAttribute('value', 0);
  	  main.seekbar.setAttribute('min', 0);
		  main.seekbar.setAttribute('max', parseInt(main.audio.duration));
      main.musicDuration.innerHTML = formatTime(main.audio.duration);
  	}
    
    if (shuffling === false && looping === false) {
		  	main.audio.onended = function() {
      	  main.nextControl.click();
		  	  changeTitle();
		  	  main.audio.play();
    	  };
		} else if(shuffling === true && looping === false) {
		  	main.audio.onended = function() {
  		  	loadRandomArbitrary();
  		  	changeTitle();
  		  	main.audio.play();
	     	};
		} else if(shuffling === false && looping === true) {
		  	main.audio.onended = function() {
		  	  main.audio.currentTime = main.seekbar.getAttribute('min');
		  	  main.audio.play();
      	};
		}
    
		main.audio.playbackRate = playbackRate;
		changeTitle();
		
		try {
  		navigator.mediaSession.metadata.title = song.songname;
  		navigator.mediaSession.metadata.author = Artistname;
  		navigator.mediaSession.metadata.artwork = [{ src: 'https://dummyimage.com/114x114' }];
		} catch (err) {
		  console.log(err);
		}
		
		console.log('Song Loaded - ' + Songname);
})}

function updateMediaSessionState() {
  navigator.mediaSession.playbackState = main.audio.paused ? 'paused' : 'playing';
  navigator.mediaSession.setPositionState({
    duration: main.audio.duration,
    playbackRate: main.audio.playbackRate,
    position: main.audio.currentTime,
  });
}

function updatePositionState() {
  if ('setPositionState' in navigator.mediaSession) {
    navigator.mediaSession.setPositionState({
      duration: video.duration,
      playbackRate: video.playbackRate,
      position: video.currentTime,
    });
  }
}

var evs = ['playing', 'paused', 'durationchange', 'ratechange', 'timechange'];

for (var ev of evs) {
  main.audio.addEventListener(ev, updateMediaSessionState);
}

//////////////////////////////////////////////////////////////

var noiseON;
var defaultNoiseVol = 2.5;

var Noise = (function () {

  'use strict';

  const audioContext = new(window.AudioContext || window.webkitAudioContext);
  
  let fadeOutTimer;
  
  function createNoise(track) {

    const bufferSize = 2 * audioContext.sampleRate;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    track.audioSource.buffer = noiseBuffer;
    console.log('Noise created...');
  }

  function stopNoise(track) {
    if (track.audioSource) {
      clearTimeout(fadeOutTimer);
      track.audioSource.stop();
      noiseON = false;
    }
    
    console.log('Noise stopped');
  }
  
  function fadeNoise(track) {
    console.log('Fading Noise');
    
    if (track.fadeOut) {
      track.fadeOut = (track.fadeOut >= 0) ? track.fadeOut : 0.5;
    } else {
      track.fadeOut = 0.5;
    }

    if (track.canFade) {
      
      track.gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + track.fadeOut);

      track.canFade = false;

      fadeOutTimer = setTimeout(() => {
        stopNoise(track);
      }, track.fadeOut * 1000);

    } else {
      stopNoise(track);
    }
    noiseON = false;
    
    console.log('Noise stopped');
  }

  function buildTrack(track) {
    track.audioSource = audioContext.createBufferSource();
    track.gainNode = audioContext.createGain();
    track.audioSource.connect(track.gainNode);
    track.gainNode.connect(audioContext.destination);
    track.canFade = true; // used to prevent fadeOut firing twice
    console.log('Track built...');
  }
  
  function setGain(track) {

    track.volume = (track.volume >= 0) ? track.volume : 0.5;
    
    if (track.fadeIn) {
      track.fadeIn = (track.fadeIn >= 0) ? track.fadeIn : 0.5;
    } else {
      track.fadeIn = 0.5;
    }

    track.gainNode.gain.setValueAtTime(0, audioContext.currentTime);

    track.gainNode.gain.linearRampToValueAtTime(track.volume / 4, audioContext.currentTime + track.fadeIn / 2);

    track.gainNode.gain.linearRampToValueAtTime(track.volume, audioContext.currentTime + track.fadeIn);

    console.log('Noise Gain set');
  }

  function playNoise(track) {
    stopNoise(track);
    buildTrack(track);
    createNoise(track);
    setGain(track);
    track.audioSource.loop = true;
    track.audioSource.start();
    noiseON = true;
    
    console.log('Noise Playing');
  }

  // Expose functions:
  return {
    play : playNoise,
    stop : stopNoise,
    fade : fadeNoise
  };

}());

var noise = {
  volume: 0.01, // 0 - 1
  fadeIn: defaultNoiseVol, // time in seconds
  fadeOut: 1.3, // time in seconds
};

var fade;
var noiseDef;
function noiseVol(val) {
  noiseDef = noiseON;
  Noise.stop(noise);
  noise.volume = val;
  
  noise.fadeIn = 0.000001;
  
  if (noiseDef) {
    Noise.play(noise);
  }
  
  noise.fadeIn = defaultNoiseVol;
  console.log('Noise volume set to ' + val);
}


var page;
var pageMax;
var pageMin;

var Welcome = (function() {
  function startWelcome() {
    main.welcomeMsg.style.display = 'block';
    main.musicDuration.style.display = 'none';
    page = 1;
    pageMax = 3;
    pageMin = 1;
    _('.page1').style.display = 'block';
    for (i = 2; i <= pageMax; i++) {
      _('.page' + i).style.display = 'none';
    }
    _('.prevPage').style.display = 'none';
    _('.nextPage').style.display = '';
    _('.endWelcome').style.display = 'none';
    
    console.log('Welcome message started');
  }
  
  main.closeWelcome.addEventListener('click', function(){
    main.welcomeMsg.style.display = 'none';
    main.musicDuration.style.display = '';
  });
  
  function stopWelcome() {
    main.closeWelcome.click();
    setupLocalStorage();
    
    console.log('Welcome message closed');
  }
  
  function nextWelcomeScreen() {
    _('.prevPage').style.display = '';
    
    if (page !== pageMax) {
      _('.page' + page).style.display = 'none';
      page++;
      _('.page' + page).style.display = '';
      
      if (page === pageMax) {
        _('.nextPage').style.display = 'none';
        _('.endWelcome').style.display = '';
      } else {
        _('.nextPage').style.display = '';
        _('.endWelcome').style.display = 'none';
      }
    } else {
      stopWelcome();
    }
    
    console.log('Next Welcome Page');
  }
  
  function prevWelcomeScreen() {
    _('.nextPage').style.display = '';
    _('.endWelcome').style.display = 'none';
    
    if (page !== pageMin) {
      _('.page' + page).style.display = 'none';
      page--;
      _('.page' + page).style.display = '';
      
      if (page === pageMin) {
        _('.prevPage').style.display = 'none';
      } else {
        _('.prevPage').style.display = '';
      }
    }
    
    console.log('Previous Welcome Page');
  }
  
  function activateOnVisit() {
    let visited = localStorage.getItem('visited');
    if (visited === 'no') {
      startWelcome();
      console.log('Welcome!');
      localStorage.setItem('visited', 'yes');
    } else {
      stopWelcome();
    }
  }
  
  function removeLocalStorage() {
    localStorage.setItem('visited', 'no');
    console.log('Welcome message set up.');
  }
  
  function setupLocalStorage() {
    localStorage.setItem('visited', 'yes');
    console.log('Welcome message deactivated.');
  }
  
  return {
    start: startWelcome,
    close: stopWelcome,
    next: nextWelcomeScreen,
    prev: prevWelcomeScreen,
    action: activateOnVisit,
    memClear: removeLocalStorage,
    memSet: setupLocalStorage,
  };
}());

Welcome.action();





//////////////////////////////////////////////////////////////





function copy() {
  try {
    var copyText = _('.main .details').innerText || _('.main .details').textContent || _('.main .details').innerHTML;
    navigator.clipboard.writeText(copyText);
    console.log('Copied the text: ' + copyText);
  } catch (error) {
    console.log(error);
  }
  
  console.log('Copied: ' + copyText);
}

_('.main .details').addEventListener('click', copy);

/*media controls*/
let index = 0;
let skipTime = 10;

const actionHandlers = [
  ['play',          () => { main.playPauseControl.click(); updatePositionState();}],
  ['pause',         () => { main.playPauseControl.click(); navigator.mediaSession.playbackState = 'paused'; updatePositionState();}],
  ['previoustrack', () => { main.prevControl.click(); updatePositionState();}],
  ['nexttrack',     () => { main.nextControl.click(); updatePositionState();}],
  ['seekbackward',  (details) => { main.audio.currentTime = Math.max(main.audio.currentTime - skipTime, 0); updatePositionState();}],
  ['seekforward',   (details) => { main.audio.currentTime = Math.min(main.audio.currentTime + skipTime, main.audio.duration); updatePositionState();}],
];

for (const [action, handler] of actionHandlers) {
  try {
    navigator.mediaSession.setActionHandler(action, handler);
  } catch (error) {
    console.log(`The media session action '${action}' is not supported yet.`);
  }
}


///////////////////////////////////////////////////




/*do stuff every 1000ms (1 second)*/
window.setInterval(function(){
	main.currentMusicTime.innerHTML = formatTime(main.audio.currentTime);
	main.seekbar.value = parseInt(main.audio.currentTime);
	
	navigator.getBattery().then(function(battery) {
    Analytics.batteryUpdate(battery);
  });
},1000);

/*do stuff every 1ms*/
window.setInterval(function(){
  sessionStorage.setItem('seekbarVal', main.audio.currentTime);
	
  // Skip dividers on selection
	let song = songList[currentSongIndex];
  if (song.thumbnail === 'space.png' || song.thumbnail === 'https://drive.google.com/uc?id=1XZuCwzIR4hfN3_Of__IiE-AFgB1RRfZz' && backIndex === 0) {
    main.nextControl.click();
  } else if (song.thumbnail === 'space.png' || song.thumbnail === 'https://drive.google.com/uc?id=1XZuCwzIR4hfN3_Of__IiE-AFgB1RRfZz' && backIndex === 1) {
    main.prevControl.click();
  }
  
  if (document.fullscreen) {
    for (i=0;i<2;i++){
      fullScrTgl[i].classList.remove('fa-expand');
      fullScrTgl[i].classList.add('fa-compress');
    }
  } else {
    for (i=0;i<2;i++){
      fullScrTgl[i].classList.remove('fa-compress');
      fullScrTgl[i].classList.add('fa-expand');
    }
  }
  
  // Set up device details
  Analytics.time();
  Analytics.date();
  changeTitle();
  
  // Input check
  let input = main.search;
  if(input.value.length === 0){
    showDividers();
  } else {
    hideDividers();
  }

  // Loop/shuffle check
  if (looping && !shuffling) {
    main.audio.onended = function() {
      main.audio.currentTime = main.seekbar.getAttribute('min');
      main.audio.play();
    }
  } else if (shuffling && !looping) {
    main.audio.onended = function() {
      loadRandomArbitrary();
      main.audio.play();
    }
  } else {
    main.audio.onended = function() {
      main.nextControl.click();
      main.audio.play();
    }
  }
  
  shufIcon = main.shuffle;
  loopIcon = main.repeat.querySelector('i');
  if (!shuffling) {
    shufIcon.classList.remove('shuffling');
    shufIcon.classList.add('notShuffling');
  } else if (shuffling) {
    shufIcon.classList.add('shuffling');
    shufIcon.classList.remove('notShuffling');
  }
  
  if (!looping) {
    loopIcon.classList.remove('fa-repeat-1-alt');
    loopIcon.classList.add('fa-repeat-alt');
  } else if (looping) {
    loopIcon.classList.remove('fa-repeat-alt');
    loopIcon.classList.add('fa-repeat-1-alt');
  }
  
  sessionStorage.setItem('looping', looping);
  sessionStorage.setItem('shuffling', shuffling);
  
  // setting time details for long split albums
  if (songList[currentSongIndex].audio.includes('#t=') && songList[currentSongIndex + 1].audio.includes('#t=')) {
  	  main.seekbar.setAttribute('min', songList[currentSongIndex].audio.split('=').slice(-1));
  	  main.seekbar.setAttribute('max', songList[currentSongIndex + 1].audio.split('=').slice(-1));
  	  main.seekbar.setAttribute('value', main.seekbar.getAttribute('min'));
  	  main.musicDuration.innerHTML = formatTime(main.seekbar.getAttribute('max'));
  	  if (main.audio.currentTime > main.seekbar.getAttribute('max') && !looping) {
  	    main.nextControl.click();
  	  } else if (main.audio.currentTime > main.seekbar.getAttribute('max') && looping) {
  	    main.audio.currentTime = main.seekbar.getAttribute('min');
  	  }
  	} else if (song.audio.includes('#t=') && !(songList[currentSongIndex + 1].audio.includes('#t='))) {
  	  main.seekbar.setAttribute('min', songList[currentSongIndex].audio.split('=').slice(-1));
  	  main.seekbar.setAttribute('max', main.audio.duration);
  	  main.seekbar.setAttribute('value', main.seekbar.getAttribute('min'));
  	  main.musicDuration.innerHTML = formatTime(main.audio.duration);
  	} else {
		  main.seekbar.setAttribute('value', 0);
  	  main.seekbar.setAttribute('min', 0);
		  main.seekbar.setAttribute('max', parseInt(main.audio.duration));
      main.musicDuration.innerHTML = formatTime(main.audio.duration);
  	}
}, 1);

main.audio.addEventListener('play', function() {
  navigator.mediaSession.playbackState = 'playing';
  main.playPauseControl.classList.remove('paused');
});

main.audio.addEventListener('pause', function() {
  navigator.mediaSession.playbackState = 'paused';
  main.playPauseControl.classList.add('paused');
});





///////////////////////////////////////////////////





var backIndex;
/*Previous button*/
main.prevControl.addEventListener('click',function(){
	window.clearTimeout();
  backIndex = 1;
	if (!looping) {
  	if (main.audio.currentTime > main.seekbar.getAttribute('min') + 3) {
      main.audio.currentTime = main.seekbar.getAttribute('min');
      console.log('Replaying...');
    } else {
      currentSongIndex--;
  	  if(currentSongIndex < 0){
  	  	currentSongIndex = songList.length + currentSongIndex;
  	  }
  	  loadSong(currentSongIndex);
	    console.log('Previous Song');
  	  window.setTimeout(function() {
        backIndex = 0;
      }, 1000);
    }
	} else {
	  if (main.audio.currentTime > main.seekbar.getAttribute('min') + 3) {
      main.audio.currentTime = main.seekbar.getAttribute('min');
      console.log('Replaying...');
    }
	}
});

/*Next button*/
var loopTiming = 0;
main.nextControl.addEventListener('click',function(){
	if (!looping && !shuffling) {
  	currentSongIndex++;
  	if(currentSongIndex > songList.length){
  	  currentSongIndex = 0;
	  }
  	console.log('Next Song');
  	loadSong(currentSongIndex);
  	changeTitle();
  	main.audio.play();
	} else if (looping && !shuffling) {
	  loopTiming++;
	  console.log('Start loop timeout');
	  if (loopTiming === 2) {
	    currentSongIndex++;
  	  if(currentSongIndex > songList.length){
  	    currentSongIndex = 0;
  	  }
  	  console.log('Next Song');
  	  loadSong(currentSongIndex);
  	  changeTitle();
  	  loopTiming = 0;
  	  main.audio.play();
	  } else {
	    window.setTimeout(function(){
	      loopTiming = 0;
	      console.log('End loop timeout');
	    },1000);
	  }
	} else if (shuffling && !looping) {
	  loadRandomArbitrary();
	  main.audio.play();
	} else {
	  currentSongIndex++;
  	if(currentSongIndex > songList.length){
  	  currentSongIndex = 0;
	  }
  	console.log('Next Song');
  	loadSong(currentSongIndex);
  	changeTitle();
  	main.audio.play();
	}
});

function timePausedRam() {
	timePaused++;
	localStorage.setItem('timePaused', timePaused);
}

/*Play/Pause button*/
main.playPauseControl.addEventListener('click', function(){
	if(main.audio.paused){
		main.playPauseControl.classList.remove('paused');
		main.audio.play();
		
		changeTitle();
		if (document.pictureInPictureElement) {
      document.pictureInPictureElement.play();
		}
		
		window.clearInterval(timePausedRam);
		
		navigator.mediaSession.playbackState = 'playing';
		sessionStorage.setItem('wasPlaying', true);
	} else {
		main.playPauseControl.classList.add('paused');
		main.audio.pause();
		changeTitle();
		
		if (document.pictureInPictureElement) {
      document.pictureInPictureElement.pause();
		}
		
		var timePaused = 0;
		window.setInterval(timePausedRam, 1000);
		
		navigator.mediaSession.playbackState = 'paused';
		sessionStorage.setItem('wasPlaying', false);
	}
	
	console.log((sessionStorage.getItem('wasPlaying') === 'true') ? 'Playing...' : 'Paused');
});

/*Seekbar button*/
main.seekbar.addEventListener('input', function(){
	var nTime = main.seekbar.value;
	console.log('Time set to: ' + formatTime(nTime));
	main.audio.currentTime = nTime;
});

/*Loop button*/
main.repeat.addEventListener('click', Loop);
/*Shuffle button*/
main.shuffle.addEventListener('click', Shuffle);

/*Volume controls*/
var volume;
function changeVolume(vol) {
  if (vol <= 1) {
    let audioFile = main.audio;
    volume = vol;
    audioFile.volume = volume;
    main.volume.value = volume;
    
    let icon = main.volumeControls.querySelector('i');
    if (volume < 0.0000000001) {
      icon.classList.remove('fa-volume-up');
      icon.classList.remove('fa-volume-down');
      icon.classList.remove('fa-volume');
      icon.classList.add('fa-volume-slash');
    } else if (volume >= 0.0000000001 && volume < 0.4) {
      icon.classList.remove('fa-volume-slash');
      icon.classList.remove('fa-volume');
      icon.classList.remove('fa-volume-up');
      icon.classList.remove('fa-amp-guitar');
      icon.classList.add('fa-volume-down');
    } else if (volume >= 0.4 && volume < 0.65) {
      icon.classList.remove('fa-volume-slash');
      icon.classList.remove('fa-volume-down');
      icon.classList.remove('fa-volume-up');
      icon.classList.remove('fa-amp-guitar');
      icon.classList.add('fa-volume');
    } else if (volume >= 0.65) {
      icon.classList.remove('fa-volume-slash');
      icon.classList.remove('fa-volume-down');
      icon.classList.remove('fa-volume');
      icon.classList.remove('fa-amp-guita');
      icon.classList.add('fa-volume-up');
    }
  }
  
  sessionStorage.setItem('volume', volume);
  
  if (!fading) {
    console.log('Volume set to: ' + volume);
  }
}

var playbackRate = (sessionStorage.getItem('playbackRate')) ? sessionStorage.getItem('playbackRate') : 1;
main.playBackRate.value = playbackRate;
function changePlaybackSpeed(speed) {
  if (!speed) {
    playbackRate = main.playBackRate.options[main.playBackRate.selectedIndex].value;
  } else {
    playbackRate = speed;
  }
  
  main.playBackRate.value = playbackRate;
  main.audio.playbackRate = playbackRate;
  sessionStorage.setItem('playbackRate', playbackRate);
}

/*Volume Mute*/
var unmutedVolume;
let volumeButton = _('#volumeButton');
function mute() {
  if (volume > 0) {
    unmutedVolume = main.volume.value;
    changeVolume(0);
    console.log('Muted');
  } else {
    changeVolume(unmutedVolume);
    console.log('Unmuted');
  }
  
}

/*Volume Fade*/
var fading = false;
function fade() {
  if (main.audio.volume > 0) {
    var newVol = (main.audio.volume - Math.min(main.audio.volume, 0.01));
    
    if (fading === false) {
      console.log('Fading music...');
    }
    fading = true;
    
    changeVolume(newVol);
    timer = setTimeout(fade, 10);
  } else {
    changeVolume(1);
    fading = false;
    main.audio.pause();
    console.log('Music faded!');
  }
}

function loadRandomArbitrary() {
  console.log('Loading random song...');
  var randomSong = getRandomArbitrary(1, songList.length);
  if (songList[randomSong].thumbnail === 'space.png' || song.thumbnail === 'https://drive.google.com/uc?id=1XZuCwzIR4hfN3_Of__IiE-AFgB1RRfZz') {
    randomSong++;
  } else {
    loadSong(randomSong);
  }
  
  console.log('Random song loaded!');
}

async function loadRandomSong() {
  console.log('Loading random song...');
  var randomSong = getRandomArbitrary(1, songList.length);
  if (songList[randomSong].thumbnail === 'space.png' || song.thumbnail === 'https://drive.google.com/uc?id=1XZuCwzIR4hfN3_Of__IiE-AFgB1RRfZz') {
    randomSong++;
  }
  
  for (let i = 0; i < 8; i++) {
    randomSong = getRandomArbitrary(1, songListLength);
    
    this.blur();
    if (i === 0) {
      loadSong(randomSong);
    } else if (i >= 1 && i < 5) {
      await delay(100);
      loadSong(randomSong);
    } else if (i === 5) {
      await delay(200);
      loadSong(randomSong);
    } else if (i === 6) {
      await delay(300);
      loadSong(randomSong);
    } else if (i === 7) {
      await delay(500);
      loadSong(randomSong);
      console.log('Random song loaded!');
    }
    
    if (songList[randomSong].thumbnail === 'space.png' || song.thumbnail === 'https://drive.google.com/uc?id=1XZuCwzIR4hfN3_Of__IiE-AFgB1RRfZz') {
      randomSong++;
    }
    
    console.log('Random song loaded...');
  }
}

main.randomSongBtn.addEventListener('click', function(){
  loadRandomSong();
});

function mouseButton(e) {
  if (typeof e === 'object') {
    switch (e.button) {
      case 3:
        main.prevControl.click();
      break;
      
      case 4:
        main.nextControl.click();
      break;
    }
  }
}

function checkEscTime() {
  if (escTime === 3) {
    let url = 'https://classroom.google.com/h';
    window.location.href = url;
    escTime = 0;
  }
}

/*Check if key is pressed*/
/*Then do an action based on the key (evt.keyCode)*/
let escTimeout;
let escTime = 0;
const longPressTime = 500;
function checkKeyPressed(evt) {

if (evt.key === 'Escape') {
  escTime += 1;
  checkEscTime
  window.clearTimeout(escTimeout);
  escTimeout = window.setTimeout(() => {
    escTime = 0;
  }, 1000);
}

  if (player.classList.contains('activeSongList')) {
    if (evt.keyCode !== '32' && evt.keyCode !== '9' && evt.keyCode !== '18' && evt.keyCode !== '16' && evt.keyCode !== '17' && evt.keyCode !== '13' && evt.keyCode !== '91' && evt.keyCode !== '27') {
      _('#songSearch').focus();
    }
    
    if (evt.keyCode == '27') {
      toggleSongList.click();
    }
  } else if (main.welcomeMsg.style.display !== 'none') {
    if (evt.key === 'Escape') {
      Welcome.close();
    }
    
    if (evt.key === 'ArrowRight') {
      Welcome.next();
    }
    
    if (evt.key === 'ArrowLeft') {
      Welcome.prev();
    }
  } else {
    
    /*Play on 'space' or 'k' pressed*/
    if (evt.key === ' ' || evt.key === 'k' || evt.key === 's') {
      main.playPauseControl.click();
    }

    /*Next Song on '->' or 'l' pressed*/
    if (evt.key === 'ArrowRight' || evt.key === 'l') {
      main.nextControl.click();
    }

    /*Previous Song on '<-' or 'j' pressed*/
    if (evt.key === 'ArrowLeft' || evt.key === 'j') {
      main.prevControl.click();
    }

    /*Loop on 'a' or 'u' pressed*/
    if (evt.key === 'a' || evt.key === 'u') {
      Loop();
    }

    /*Shuffle on 'd' or 'o' pressed*/
    if (evt.key === 'd' || evt.key === 'o') {
      main.shuffle.click();
    }

    /*Dark Mode on 'z' pressed*/
    if (evt.key === 'z') {
      toggleDarkMode();
    }

    /*Long press function for 'w': Toggle Song List*/
    let keyDownTimeout;
    document.addEventListener('keydown', e => {
      if (keyDownTimeout) {
        return;
      }
      keyDownTimeout = window.setTimeout(() => {
        /*button was held for 1500ms, consider it a long-press*/
        if (e.key === 'w') {
          player.classList.toggle('activeSongList');
        }
      }, longPressTime);
    });

    document.addEventListener('keyup', e => {
      clearTimeout(keyDownTimeout);
      keyDownTimeout = 0;
    });
    
    /*Fullscreen on 'f'*/
    if (evt.key === 'f') {
      toggleFullscreen();
    }
    
    /*Open/Close analytics on 'x'*/
    if (evt.key === 'x') {
      Analytics.toggle();
    }
    
    /*Random song on 'r'*/
    if (evt.key === 'r') {
      loadRandomSong();
    }
    
    /*volume up on '.'*/
    if (evt.key === '.') {
      newVolume = volume + 0.005;
      
      changeVolume(newVolume);
      main.volume.value = volume;
    }
    
    /*volume down on ','*/
    if (evt.key === ',') {
      newVolume = volume - 0.005;
      
      changeVolume(newVolume);
      main.volume.value = volume;
    }
    
    /*Mute on 'm' or 'q'*/
    if (evt.key === 'm' || evt.key === 'q') {
      volumeButton.click();
    }
    
    /*Fade on 'e'*/
    if (evt.key === 'e') {
      volumeButton.dispatchEvent(new MouseEvent('dblclick'))
    }
    
    /*Open Nav on 'n'*/
    if (evt.key === 'n') {
      main.nav.accessNav.click();
    }
    
    /*Close nav on esc (if open)*/
    if (body.classList.contains('activeNav')) {
      if (evt.key === 'Escape') {
        main.nav.closeNav.click();
      }
    }
    
    /*Start up songAdder on 'v'*/
    if (evt.key === 'v') {
      addSong();
    }
    
    /*Toggle song list on 'b'*/
    if (evt.key === 'b') {
      toggleSongList.click();
    }
    
    /*Restart welcome message on 'h'*/
    if (evt.key === 'h' || evt.key === '?') {
      Welcome.start();
    }
    
    /*Toggle TFHT on 't'*/
    if (evt.key === 't') {
      main.time.click();
    }
    
    /*Increase playback speed on ] & decrease on [*/
    if (evt.key === ']' && main.playBackRate.selectedIndex < 8) {
      main.playBackRate.selectedIndex += 1;
      main.audio.playbackRate = main.playBackRate.options[main.playBackRate.selectedIndex].value;
    }
    
    if (evt.key === '[' && main.playBackRate.selectedIndex > 0) {
      main.playBackRate.selectedIndex -= 1;
      main.audio.playbackRate = main.playBackRate.options[main.playBackRate.selectedIndex].value;
    }
  }
}

/*window.onerror  = function (msg, url, line) {
   console.log('Err: ' + msg + '\nLine: ' + line );
}
*/
console.timeEnd('Loaded in');

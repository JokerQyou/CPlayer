/**
 * Global Blob reader
 */
var getBlobURL = (window.URL && URL.createObjectURL.bind(URL)) || (window.webkitURL && webkitURL.createObjectURL.bind(webkitURL)) || (window.createObjectURL);
var revokeBlobURL = (window.URL && URL.revokeObjectURL.bind(URL)) || (window.webkitURL && webkitURL.revokeObjectURL.bind(webkitURL)) || (window.revokeObjectURL);

/**
 * CPlayer
 * Canvas video player
 * @author Joker Qyou <Joker.Qyou@gmail.com>
 * @date 20, Mar, 2013
 * @license BSD License
 */
function CPlayer(){
	var _this = this;
	var videoRect = {};
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	var spf = 1000 / 60;

	/**
	 * Canvas set up
	 */
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.style.backgroundColor = '#000000';
	canvas.style.cursor = 'none';
	document.body.appendChild(canvas);

	console.log('Canvas init succeeded');
	console.log('Device resolution is '+window.innerWidth+' * '+window.innerHeight);

	/**
	 * Control bar set up
	 */
	/** Control bar container **/
	var controlBar = document.createElement('div');
	controlBar.className = 'controlBar';
	/** Progress bar **/
	var cProgressBar = document.createElement('div');
	cProgressBar.className = 'progressbar';
	var cProgress = document.createElement('div');
	cProgress.className = 'progress';
	cProgressBar.appendChild(cProgress);
	/** Time tag **/
	var cTimeTag = document.createElement('span');
	cTimeTag.className = 'cLeft';
	/** Play & pause button **/
	var cPlay = document.createElement('button');
	cPlay.className = 'cBtn';
	cPlay.id = 'cPlay';
	/** Stop buttton **/
	var cStop = document.createElement('button');
	cStop.className = 'cBtn';
	cStop.id = 'cStop';
	/** 'Add file' button **/
	var cFile = document.createElement('button');
	cFile.className = 'csmallBtn';
	cFile.id = 'cFile';
	/** Fullscreen button **/
	var cFullscreen = document.createElement('button');
	cFullscreen.className = 'csmallBtn';
	cFullscreen.id = 'cFullscreen';
	controlBar.appendChild(cProgressBar);
	controlBar.appendChild(cTimeTag);
	controlBar.appendChild(cPlay);
	controlBar.appendChild(cStop);
	controlBar.appendChild(cFile);
	controlBar.appendChild(cFullscreen);
	document.body.appendChild(controlBar);

	console.log('Control bar init succeeded');

	/**
	 * File input set up
	 */
	var fileInput = document.createElement('input');
	fileInput.type = 'file';

	/**
	 * 'Add file' action
	 */
	cFile.onclick = function(){
		fileInput.click();
	}

	/**
	 * Add video file
	 */
	fileInput.onchange = function(){
		/**
		 * Test file type and add video file
		 */
		if(RegExp('video\/').test(this.files[0].type)){
			if(_this.videoFile){
				revokeBlobURL(_this.videoFile);
				context.clearRect(0, 0, canvas.width, canvas.height);
				console.log('Continuous playing, Blob URL revoked, rect cleared');
			}
			_this.videoFile = this.files[0];
			console.log('File type accepted');
			console.log('Video file added, but whether it can be played depends');
			video.src = getBlobURL(_this.videoFile);
			console.log('Video load started');

			video.play();
			console.log('Video playback started, FPS: '+(1000/spf));
		}
	}

	console.log('File input init succeeded');

	/**
	 * Video set up
	 */
	var video = document.createElement('video');
	video.muted = false;
	video.preload = true;
	_this.video = video;

	var calcVideoRect = function(video){
		/**
		 * Vars for:
		 * paint x, 
		 * paint y, 
		 * canvas video width, 
		 * canvas video height, 
		 * screen resolution rate, 
		 * video resolution rate
		 */
		var cx, cy, vw, vh, srr, vrr;

		srr = canvas.width / canvas.height;
		vrr = video.videoWidth / video.videoHeight;
		if(vrr > srr){
			if(video.videoWidth > canvas.width){
				vw = canvas.width;
				vh = vw / vrr;
			}else{
				vw = video.videoWidth;
				vh = video.videoHeight;
			}
		}else{
			if(video.videoHeight > canvas.height){
				vh = canvas.height;
				vw = vh * vrr;
			}else{
				vw = video.videoWidth;
				vh = video.videoHeight;
			}
		}
		cx = (canvas.width - vw) / 2;
		cy = (canvas.height - vh) / 2;
		console.log('Video original resolution is '+video.videoWidth+' * '+video.videoHeight);
		console.log('VRR='+vrr+', SRR='+srr);
		console.log('Video resolution rated to '+vw+' * '+vh);

		return {
			"srr": srr,
			"vrr": vrr,
			"cx": cx,
			"cy": cy,
			"vw": vw,
			"vh": vh
		}
	}

	/**
	 * Keep video in window range
	 */
	video.addEventListener('loadedmetadata', function(){
		_this.videoRect = calcVideoRect(this);
		document.title = _this.videoFile.name + ' - CPlayer';
		/**
		 * Draw video to canvas
		 */
		setInterval(function(){
			context.drawImage(video, _this.videoRect.cx, _this.videoRect.cy, _this.videoRect.vw, _this.videoRect.vh);
		}, spf);
	});

	/**
	 * Generate formatted time string for time tag
	 */
	var formatTime = function(currentTime, duration){
		var hour = parseInt(currentTime / 3600);
		var min = parseInt((currentTime - hour*3600) / 60);
		var sec = parseInt((currentTime - hour*3600 - min*60) % 60);
		var hourT = parseInt(duration / 3600);
		var minT = parseInt((duration - hour*3600) / 60);
		var secT = parseInt((duration - hour*3600 - min*60) % 60);
		hour = (hour<=9)?('0'+hour):(hour);
		min = (min<=9)?('0'+min):(min);
		sec = (sec<=9)?('0'+sec):(sec);
		hourT = (hourT<=9)?('0'+hourT):(hourT);
		minT = (minT<=9)?('0'+minT):(minT);
		secT = (secT<=9)?('0'+secT):(secT);
		return hour+':'+min+':'+sec+' / '+hourT+':'+minT+':'+secT;
	}

	/**
	 * Progress bar update, time tag update
	 */
	video.addEventListener('timeupdate', function(){
		var percentage = (this.currentTime * 100 / this.duration);
		cTimeTag.innerHTML = formatTime(this.currentTime, this.duration);
		cProgress.style.width = percentage + '%';
	});

	/**
	 * Progress bar clickable for jumping to specified time point
	 */
	cProgressBar.addEventListener('click', function(e){
		var targetPercentage = e.offsetX / this.offsetWidth;
		video.currentTime = video.duration * targetPercentage;
		console.log('Video jumped to '+video.currentTime);
	});

	/**
	 * 'Pause video' action on clicking on canvas
	 */
	canvas.addEventListener('click', function(){
		if(!!video.src){
			if(!video.paused){
				video.pause();
				console.log('Video paused at '+video.currentTime);
			}else{
				video.play();
				console.log('Video continued to play');
			}
		}else{
			fileInput.click();
		}
	});

	var calcFullVideoRect = function(video){
		var vw, vh, cx, cy, srr, vrr;
		srr = canvas.width / canvas.height;
		vrr = video.videoWidth / video.videoHeight;
		if(vrr < srr){
			vh = canvas.height;
			vw = vh * vrr;
		}else{
			vw = canvas.width;
			vh = vw / vrr;
		}
		cx = (canvas.width - vw) / 2;
		cy = (canvas.height - vh) / 2;
		return {
			"srr": srr,
			"vrr": vrr,
			"vw": vw,
			"vh": vh,
			"cx": cx,
			"cy": cy
		}
	}

	var requestFullscreen = function(elem){
		if(document.body.requestFullscreen){
			return elem.requestFullscreen();
		}else if(document.body.webkitRequestFullScreen){
			return elem.webkitRequestFullScreen();
		}else if(document.body.mozRequestFullScreen){
			return elem.mozRequestFullScreen();
		}
	}

	var cancelFullscreen = function(elem){
		if(document.exitFullscreen){
			return elem.exitFullscreen();
		}else if(document.webkitCancelFullScreen){
			return elem.webkitCancelFullScreen();
		}else if(document.mozCancelFullScreen){
			return elem.mozCancelFullScreen();
		}
	}

	var fullscreen = false;
	/**
	 * Click button to enter / quit scaled fullscreen
	 */
	cFullscreen.addEventListener('click', function(){
		if(!fullscreen){
			requestFullscreen(document.body);
			_this.videoRect = calcFullVideoRect(video);
			fullscreen = true;
			spf = 1000 / 30;
			console.log('Entered fullscreen, FPS decreased to '+(1000/spf));
		}else{
			cancelFullscreen(document);
			context.clearRect(0, 0, canvas.width, canvas.height);
			_this.videoRect = calcVideoRect(video);
			fullscreen = false;
			spf = 1000 / 60;
			console.log('Quited fullscreen, FPS increased to '+(1000/spf));
		}
	});

	/**
	 * Canvas auto resize on window resize
	 */
	window.addEventListener('resize', function(){
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		_this.videoRect = calcVideoRect(video);
	});

	// /**
	//  * Auto pause when window blurs
	//  */
	// window.addEventListener('blur', function(){
	// 	if(!!video.src && !video.paused){
	// 		video.pause();
	// 		console.log('Video paused at '+video.currentTime+' due to window blur event');
	// 	}
	// });

	// /**
	//  * Auto resume when window re-focuses
	//  */
	// window.addEventListener('focus', function(){
	// 	if(!!video.src && video.paused && !!video.currentTime){
	// 		video.play();
	// 		console.log('Video resumed due to window focus event');
	// 	}
	// });

	console.log('Video init succeeded');

	this.videoFile = null;
}

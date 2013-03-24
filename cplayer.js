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
	var intervalId;

	/**
	 * Canvas set up
	 */
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.id = 'CCanvas';
	canvas.style.cursor = 'none';
	document.body.appendChild(canvas);

	/**
	 * Chrome download link
	 */
	var chromeDlk = "<a href=\"https://google.com/chrome/\" target=\"_blank\" title=\"Fastest modern browser ever\"><img src=\"get-chrome.png\" alt=\"Chrome logo\"></a>";
	canvas.innerHTML = chromeDlk;

	/**
	 * Draw logo in the center
	 */
	var logo = new Image();
	logo.src = "cplayer.png";

	var drawLogo = function(){
		context.clearRect(0, 0, canvas.width, canvas.height);
		var x = (canvas.width - logo.width) / 2;
		var y = (canvas.height - logo.height) / 2;
		context.drawImage(logo, x, y);
	}
	logo.addEventListener('load', function(){
		drawLogo();
	});

	console.log('Canvas init succeeded');
	console.log('Device resolution is '+window.innerWidth+' * '+window.innerHeight);

	/**
	 * Top bar set up
	 */
	var topBar = document.createElement('div');
	topBar.className = 'topBar';
	/** File name tag **/
	var filenameTag = document.createElement('span');
	filenameTag.className = 'cLeft';
	filenameTag.id = 'filenameTag';
	filenameTag.innerHTML = '未在播放文件';
	topBar.appendChild(filenameTag);
	document.body.appendChild(topBar);

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

	/**
	 * Construction start
	 */
	/** Volume icon and button **/
	// var cVolume = document.createElement('button');
	// cVolume.className = 'cBtn';
	// cVolume.id = 'cVolumeHolder';
	// var cVolumeIcon = document.createElement('div');
	// cVolumeIcon.id = 'cVolume';
	// var cVolumeCircle = document.createElement('div');
	// cVolumeCircle.className = 'cVolumeCircle';
	// cVolumeIcon.appendChild(cVolumeCircle);
	// var cVolumeBtn = document.createElement('div');
	// cVolumeBtn.className = 'cVolumeBtn';
	// cVolume.appendChild(cVolumeIcon);
	// cVolume.appendChild(cVolumeBtn);
	/**
	 * Construction end
	 */

	/** 'Add file' button **/
	var cFile = document.createElement('button');
	cFile.className = 'csmallBtn';
	cFile.id = 'cFile';
	/** Help button **/
	var cHelp = document.createElement('button');
	cHelp.className = 'csmallBtn';
	cHelp.id = 'cHelp';
	controlBar.appendChild(cProgressBar);
	controlBar.appendChild(cTimeTag);
	controlBar.appendChild(cPlay);
	controlBar.appendChild(cStop);
	// controlBar.appendChild(cVolume);
	controlBar.appendChild(cFile);
	controlBar.appendChild(cHelp);
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
				clearInterval(_this.intervalId);
				console.log('Video sync stopped');
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
		context.clearRect(0, 0, canvas.width, canvas.height);
		filenameTag.innerHTML = _this.videoFile.name;
	});

	/**
	 * Hide control bar when video starts to play
	 */
	video.addEventListener('play', function(){
		controlBar.className = "controlBar fade";
		topBar.className = 'topBar fade';
		/**
		 * Draw video to canvas
		 */
		_this.intervalId = setInterval(function(){
			context.drawImage(video, _this.videoRect.cx, _this.videoRect.cy, _this.videoRect.vw, _this.videoRect.vh);
		}, spf);
		cPlay.className = 'cBtn pause';
		trail.destroy();
	});

	/**
	 * Generate formatted time string for time tag
	 */
	var formatTimeTag = function(currentTime, duration){
		var hour = parseInt(currentTime / 3600);
		var min = parseInt((currentTime - hour*3600) / 60);
		var sec = parseInt((currentTime - hour*3600 - min*60) % 60);
		var hourT = parseInt(duration / 3600);
		var minT = parseInt((duration - hourT*3600) / 60);
		var secT = parseInt((duration - hourT*3600 - minT*60) % 60);
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
		cTimeTag.innerHTML = formatTimeTag(this.currentTime, this.duration);
		cProgress.style.width = percentage + '%';
	});

	/**
	 * Clear interval when video pauses
	 */
	video.addEventListener('pause', function(){
		clearInterval(_this.intervalId);
		cPlay.className = 'cBtn';
		topBar.className = 'topBar';
		controlBar.className = 'controlBar';
		console.log('Video sync stopped due to video pause event');
	});

	/**
	 * Draw logo and show control bar when video ends
	 */
	video.addEventListener('ended', function(){
		clearInterval(_this.intervalId);
		console.log('Video sync stopped');
		drawLogo();
		controlBar.className = 'controlBar';
		topBar.className = 'topBar';
		cPlay.className = 'cBtn';
	});

	/**
	 * Progress bar clickable for jumping to specified time point
	 */
	cProgressBar.addEventListener('click', function(e){
		var targetPercentage = e.offsetX / this.offsetWidth;
		video.currentTime = video.duration * targetPercentage;
		console.log('Video jumped to '+video.currentTime);
	});

	var formatTimeTip = function(percentage, duration){
		var currentTime = percentage * duration;
		var hour = parseInt(currentTime / 3600);
		var min = parseInt((currentTime - hour*3600) / 60);
		var sec = parseInt((currentTime - hour*3600 - min*60) % 60);
		hour = (hour<=9)?('0'+hour):(hour);
		min = (min<=9)?('0'+min):(min);
		sec = (sec<=9)?('0'+sec):(sec);
		return hour+':'+min+':'+sec;
	}

	/**
	 * Floating time tip
	 */
	cProgressBar.addEventListener('mousemove', function(e){
		if(!video.src){
			return;
		}
		var targetPercentage = e.offsetX / this.offsetWidth;
		if(!document.querySelector('.timeTip')){
			var timeTip = document.createElement('div');
			timeTip.className = 'timeTip';
			var tipArrow = document.createElement('div');
			tipArrow.className = 'tipArrow';
			var tipContent = document.createElement('div');
			tipContent.className = 'tipContent';
			timeTip.appendChild(tipArrow);
			timeTip.appendChild(tipContent);
			document.body.appendChild(timeTip);
		}else{
			var timeTip = document.querySelector('.timeTip');
			var tipContent = document.querySelector('.tipContent');
			timeTip.className = 'timeTip';
		}
		tipContent.innerHTML = formatTimeTip(targetPercentage, video.duration);
		timeTip.style.left = e.offsetX - timeTip.getClientRects()[0].width/2 + 'px';
		timeTip.style.top = this.getClientRects()[0].top - timeTip.getClientRects()[0].height + 'px';
	});

	/**
	 * Time tip auto hide
	 */
	cProgressBar.addEventListener('mouseout', function(){
		if(!!document.querySelector('.timeTip')){
			document.querySelector('.timeTip').className = 'timeTip fade';
		}
	})

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

	cPlay.addEventListener('click', function(){
		if(!!video.src){
			if(!video.paused){
				video.pause();
			}else{
				video.play();
			}
		}else{
			fileInput.click();
		}
	});

	cStop.addEventListener('click', function(){
		if(!!video.src && !video.paused){
			video.currentTime = 0;
			video.pause();
			drawLogo();
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

	/**
	 * Click button to active help
	 */
	cHelp.addEventListener('click', function(){
		if(!document.querySelector('.helpLayer')){
			var helpLayer = document.createElement('div');
			helpLayer.className = 'helpLayer';
			var helpText = '<h2>CPlayer</h2><p>一个使用 HTML5 canvas 和 video 来播放本地视频文件的播放器，实验性质，支持的编码格式依不同平台不同浏览器而有差异。</p><p>项目地址：<a href="//gitcafe.com/JokerQyou/CPlayer" target="_blank">http://gitcafe.com/JokerQyou/CPlayer</a></p><p>作者博客：<a href="//blog.mynook.info/" target="_blank">http://blog.mynook.info/</a></p>'
			helpLayer.innerHTML = helpText;
			document.body.appendChild(helpLayer);
			helpLayer.style.left = (window.innerWidth - helpLayer.offsetWidth) / 2 + 'px';
			helpLayer.style.top = (window.innerHeight - helpLayer.offsetHeight) / 2 + 'px';
		}else{
			document.body.removeChild(document.querySelector('.helpLayer'));
		}
	});

	/**
	 * Canvas auto resize on window resize
	 */
	window.addEventListener('resize', function(){
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		_this.videoRect = calcVideoRect(video);
		console.log('window resized');
		if(!video.src || !!video.ended){
			drawLogo();
		}
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

	/**
	 * Control via keyboard
	 */
	document.addEventListener('keydown', function(e){
		switch(e.keyCode){
			/** Space **/
			case 32:
				if(!!video.src){
					if(video.paused){
						video.play();
					}else{
						video.pause();
					}
				}
			break;

			/** Left **/
			case 37:
				if(!!video.src){
					if(video.currentTime >= 10){
						video.currentTime -= 10;
					}else{
						video.currentTime = 0;
					}
				}
			break;

			/** Up **/
			case 38:
				if((1 - video.volume) > 0.05){
					video.volume += 0.05;
				}else{
					video.volume = 1;
				}
			break;

			/** Right **/
			case 39:
				if(!!video.src){
					if((video.duration - video.currentTime) >= 10){
						video.currentTime += 10;
					}else{
						video.currentTime = video.duration;
					}
				}
			break;

			/** Down **/
			case 40:
				if(video.volume > 0.05){
					video.volume -= 0.05;
				}else{
					video.volume = 0;
				}
			break;

			/** Escape **/
			case 27:
				//
			break;
		}
	});

	console.log('CPlayer is now ready');

	this.videoFile = null;
}

var Player =
   {
      //plugin : null,
      state : -1,
      originalSource : null,
      skipState : -1,
	  stopCallback : null, /* Callback function to be set by client */
      STOPPED : 0,
      PLAYING : 1,
      PAUSED : 2,  
      FORWARD : 3,
      REWIND : 4
   }

   Player.pluginAPI = document.getElementById("pluginPlayer");

   Player.init = function()
   {
      var success = true;
           alert("success vale :  " + success);    
      this.state = this.STOPPED;
      
      Player.pluginAPI = document.getElementById("pluginPlayer");
      
      alert("this.plugin: " + Player.pluginAPI);
      
      if (!Player.pluginAPI)
      {
           alert("success vale this.plugin :  " + success);    
          success = false;
      }
      
      alert("success vale :  " + success);    
      
      this.setWindow();
	  //Player.setWindow();
      
      alert("success vale :  " + success);    
      
      Player.pluginAPI.OnCurrentPlayTime = 'Player.setCurTime';
      Player.pluginAPI.OnStreamInfoReady = 'Player.setTotalTime';
      Player.pluginAPI.OnBufferingStart = 'Player.onBufferingStart';
      Player.pluginAPI.OnBufferingProgress = 'Player.onBufferingProgress';
      Player.pluginAPI.OnBufferingComplete = 'Player.onBufferingComplete';           
            
      alert("success vale :  " + success);       
      return success;
   }

   Player.deinit = function()
   {
        alert("Player deinit !!! " );       
        
        if (Player.pluginAPI)
        {
            Player.pluginAPI.Stop();
        }
   }

   Player.setWindow = function()
   {
      Player.pluginAPI = document.getElementById("pluginPlayer");
	  Player.pluginAPI.SetDisplayArea(458, 58, 472, 270);
	  //Player.pluginAPI.SetVDisplayArea(470, 62, 410, 290);
   }

Player.setFullscreen = function()
{
	Player.pluginAPI.SetDisplayArea(0, 0, 960, 540);
}

   Player.setVideoURL = function(url)
   {
      this.url = url;
      alert("URL = " + this.url);
   }

   Player.playVideo = function()
   {
      if (this.url == null)
      {
         alert("No videos to play");
      }
      else
      {
         /*this.state = this.PLAYING
         this.setWindow();
         Player.pluginAPI.Play( this.url);
         alert("what am I playing? " + this.url);
         alert("state: " + this.state);*/
		 
		 this.state = this.PLAYING;
		document.getElementById("play").style.opacity = '0.2';
		document.getElementById("stop").style.opacity = '1.0';
		document.getElementById("pause").style.opacity = '1.0';
		document.getElementById("forward").style.opacity = '1.0';
		document.getElementById("rewind").style.opacity = '1.0';
		VDisplay.status("Play");
		this.setWindow();
		Player.pluginAPI.Play( this.url );
		Audio.plugin.SetSystemMute(false);
      }
   }
   
   Player.pauseVideo = function() {
      /*this.state = this.PAUSED;
      Player.pluginAPI.Pause();*/
	  
		this.state = this.PAUSED;
		document.getElementById("play").style.opacity = '1.0';
		document.getElementById("stop").style.opacity = '1.0';
		document.getElementById("pause").style.opacity = '0.2';
		document.getElementById("forward").style.opacity = '1.0';
		document.getElementById("rewind").style.opacity = '1.0';
		VDisplay.status("Pause");
		Player.pluginAPI.Pause();
   }
   
   Player.stopVideo = function() {
      if(this.state != this.STOPPED) {
         this.state = this.STOPPED;
		document.getElementById("play").style.opacity = '1.0';
		document.getElementById("stop").style.opacity = '0.2';
		document.getElementById("pause").style.opacity = '0.2';
		document.getElementById("forward").style.opacity = '0.2';
		document.getElementById("rewind").style.opacity = '0.2';
		VDisplay.status("Stop");
		Player.pluginAPI.Stop();
		VDisplay.setTime(0);
         alert("state: " + this.state);
		if (this.stopCallback)
		{
			this.stopCallback();
		}
	}
	else
	{
		alert("Ignoring stop request, not in correct state");
	}
   }
   
   Player.resumeVideo = function() {
      /*this.state = this.PLAYING;
      Player.pluginAPI.Resume();*/
	  
	    this.state = this.PLAYING;
		document.getElementById("play").style.opacity = '0.2';
		document.getElementById("stop").style.opacity = '1.0';
		document.getElementById("pause").style.opacity = '1.0';
		document.getElementById("forward").style.opacity = '1.0';
		document.getElementById("rewind").style.opacity = '1.0';
		VDisplay.status("Play");
		Player.pluginAPI.Resume();
   }
   
   Player.skipForwardVideo = function()
{
this.skipState = this.FORWARD;
Player.pluginAPI.JumpForward(5);
}
Player.skipBackwardVideo = function()
{
this.skipState = this.REWIND;
Player.pluginAPI.JumpBackward(5);
}
Player.getState = function()
{
return this.state;
}

   // Global functions called directly by the player 

   Player.onBufferingStart = function()
   {
      VDisplay.status("Buffering...");
      switch(this.skipState)
      {
         case this.FORWARD:
             document.getElementById("forward").style.opacity = '0.2';
            break;
         
         case this.REWIND:
             document.getElementById("rewind").style.opacity = '0.2';
            break;
      }
   }

   Player.onBufferingProgress = function(percent)
   {
       VDisplay.status("Buffering:" + percent + "%");
   }

   Player.onBufferingComplete = function()
   {
       VDisplay.status("Play");
      switch(this.skipState)
      {
         case this.FORWARD:
             document.getElementById("forward").style.opacity = '1.0';
            break;
         
         case this.REWIND:
             document.getElementById("rewind").style.opacity = '1.0';
            break;
      }
   }

   Player.setCurTime = function(time)
   {
       VDisplay.setTime(time);
   }

   Player.setTotalTime = function()
   {
       VDisplay.setTotalTime(Player.pluginAPI.GetDuration());
   }

   onServerError = function()
   {
       VDisplay.status("Server Error!");
   }

   OnNetworkDisconnected = function()
   {
       VDisplay.status("Network Error!");
   }

   getBandwidth = function(bandwidth) { alert("getBandwidth " + bandwidth); }

   onDecoderReady = function() { alert("onDecoderReady"); }

   onRenderError = function() { alert("onRenderError"); }

   stopPlayer = function()
   {
      Player.stopVideo();
   }

   setTottalBuffer = function(buffer) { alert("setTottalBuffer " + buffer); }

   setCurBuffer = function(buffer) { alert("setCurBuffer " + buffer); }

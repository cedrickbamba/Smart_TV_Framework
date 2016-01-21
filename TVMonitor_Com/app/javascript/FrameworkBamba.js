
/**
 * @author Cedrick Bamba
 * @fileoverview This file contains the implementation of the framework for synchronized smart tv apps.
 */
 
 /** Global varialbles used in the framework */
 
 	/** namespace assignment for convenience */
	var custom = window.deviceapis.customdevice || {};
	
	/** List of connected devices instance */
	var deviceInstance = [];
	
	/** tvChannel @namespace and variables */
	var tvChannel = webapis.tv.channel;
	
	/** tvAudiocontrol @namespace and variables */
	var tvAudiocontrol = webapis.audiocontrol;
	
	var ptc;
	var major;
	var minor;
	var sourceID;
	var programNumber;
	var transportStreamID;
	
	/** Smart TV Plugins */
	var pluginw;
	var pluginAPI;
	var player;
	var id;
	
	/** var for TVMV plugin object*/
	var TVMWPlugin;
	var tvSourceOrg;
 /** handler function of terceiro' synchronization method */
 
 function terceiro() {

  return {
  
    connectStomp: function(){

			var destination;
			var login;
			var passcode;
			login = 'guest';
			passcode = 'guest';
			
			var url = 'ws://200.18.98.24:61614/stomp';
			client = Stomp.client(url);
			
			client.debug = function(str){
				alert(str + "\n");
			};
			
			var onconnect = function(frame) {
				client.debug("connected to Stomp");
				alert("CONEXÃO COM STOMP COM SUCESSO...");
				boolReady = true;
			
			};
			
			client.connect(login, passcode, onconnect);
			
			return false;

   },    

    login: function(username, password, success, error) {
    
    		kaeptor.auth.user.device = "teste";
                kaeptor.auth.login({
                    username:   username,
                    password:   password,
                    success:    function(){
                        
						/** user success function must be executed here...*/
                    	success();
						//alert("Logged!");
                    	var terceiro_instance = new terceiro();
                    	terceiro_instance.connectStomp();
						
                    },
                    error:       function(){
                        
						//alert("Not logged!");
						
						/** user error function must be executed here...*/
                    	error();
						
	
                    }
                });

    },
    

    list: function(success, error){
						
                        kaeptor.channel.list({
                            token       : kaeptor.auth.user.tokenid,
                            success     : success
                                        
				       /** user sucess function must be executed here...*/
                            ,
                            error       : error
				       
				       /** user success function must be executed here...*/					
                        });
   },

    subscribe: function(id, success, error){

						
                        //Kaeptor channel
                        var objChannel = new KaeptorChannel();
                        
						objChannel.id= id;
                        //**test**: topic should be retrieved from a channel list function
                        objChannel.topic = objChannel.id;
                       
						
                        //Subscribe the channel object created
                        kaeptor.channel.subscribe({
                            object          : objChannel,
                            token           : kaeptor.auth.user.tokenid,
                            amqAddListener  : function( topic ){
                            //If AMQ is ready to handle messages  
							
                                if( boolReady && topic !== "" ){
									
						var destination = "/topic/"+topic;
						//client.subscribe(destination, callback/**function(message) {}*/);
						client.subscribe(destination, function(message) {
							
							alert("Aqui esta Message Body: "+message.body);
							
							//Parse message
							var objReceived = JSON.parse(message.body);
							alert("Aqui esta o Topic: "+objReceived.answer.topic);
							var StringTopic = objReceived.answer.topic;
							var list = Synchronization.getBinddata();
							
							for(i=0; i<list.length; i++){		
								
								if(list[i].syncType === "terceiro"){
									if( objReceived !== "" && StringTopic === list[i].notifData.codRequisicao){
								
										/** CALLBACK FUNCTION TO EXECUTE...*/
										list[i].callback(objReceived.answer);
									}
								}
							}	
							});
                                }
                                return 0;
                            },
                            success         : success,

                            error           : error
                        });
      },

      unsubscribe: function(id, success, error){
						
                        //Kaeptor channel
                        var objChannel = new KaeptorChannel();
                        objChannel.id = id;
                        //**test**: topic should be retrieved from a channel list function
                        objChannel.topic = objChannel.id;
                        
                        //Unsubscribe the channel object created
                        kaeptor.channel.unsubscribe({
                            object              : objChannel,
                            token               : kaeptor.auth.user.tokenid,
                            amqRemoveListener   : function( topic ){
                                //If AMQ is ready to handle  
                                if( boolReady && topic !== "" ){
                                    var destination = "/topic/"+topic;
									client.unsubscribe(objChannel.id);
                                	

                                    return 0;
                                }
                            },
                            success             : success,
                            
                            error               : error
                        });
                    
     }

  };
}

 /** handler function of usuario' synchronization method */
 
 function usuario() {

	/** function to check the existence of a given url...*/
	var checkUrl = function(url) {
        var request = false;
        if (window.XMLHttpRequest) {
                request = new XMLHttpRequest;
        } else if (window.ActiveXObject) {
                request = new ActiveXObject("Microsoft.XMLHttp");
        }

        if (request) {
        
        	request.onreadystatechange = function(){
		
				if(request.readyState == 4){
			
					if (request.status == 200){
					  return true; 
					  }else{
					  return true;
					  }
				}
			}
			request.open("GET", url);
			
        }

   }
   
  return {
  
  	 bind: function(keycode, stickeUrl){
	
			if(Keymanagement.isRegisteredKey(keycode) == true){
				this.keycode = keycode;
				this.url = stickeUrl;	
			}
	 },
	 getkeycode: function(){
	 	
	 		return this.keycode;
	 },
	 geturl: function(){
	 
	 		return this.url;
	 }
  	};
  }
  
 /** handler function for getting current channel id 
  *  @returns {object}
  */
 
 function getChannedlID(){
	 
		pluginw =  document.getElementById("pluginWindow");
		ptc = pluginw.GetCurrentChannel_PTC();
		major = pluginw.GetCurrentChannel_Major();
		minor = pluginw.GetCurrentChannel_Minor();
		sourceID = pluginw.GetCurrentChannel_OriginNetID();
		programNumber = pluginw.GetCurrentChannel_ProgramNumber();
		transportStreamID = pluginw.GetCurrentChannel_TransportStreamID();
		
		var id ={
				ptc: ptc,
				major: major,
				minor: minor,
				sourceID: sourceID,
				programNumber: programNumber,
				transportStreamID: transportStreamID
		};
		return id;
 }
 
// TUNE CALLBACK'S
  function successCB() {
      console.log("tuning is successful");  
  }   
  function errorCB(error) {
      console.log(error.name);  
  } 
  
  function changingChannelFromTo(){
	  
	  return{
		  
		  changingchannel: function(){
			  
			  var id = Channelid.getChannelid();
			  
			  tvChannel.tune({
		      ptc: id.ptc,
		      major: id.major,
		      minor: id.minor,
		      sourceID : id.sourceID,
		      programNumber: id.programNumber,
		      transportStreamID : id.transportStreamID,
		      tunecallback: {
		          onsucess: function(programList) { console.log("getting program list is successfully"); },
		          onerror: function(channelList) { console.log("getting program list is successfully");  }
		          }
		      }, successCB, errorCB, 0);
		  }
	  };
  }
  
  function changingChannelFromTo_2(){
	  
	 
	  return {
		  
		  changingchannel: function(id){
			  
  			currentSource = pluginAPI.GetSource();
            major = pluginw.GetCurrentChannel_Major();
            minor = pluginw.GetCurrentChannel_Minor();
            document.getElementById('txt2').innerHTML=" Current Source, Major e Minor are: " +currentSource+" " + major+ " " +minor;
            //var Channel = document.getElementById("Channel");  
            //var channelNum = document.getElementById("channelNum"); 
			
			var verificador = id - major;
			alert("Valor numero igual a " + id);
			
			if(verificador > 0){
			
			  var controlador = id - major;
			  
              if(currentSource == 0 && controlador > 0){ 
                  
                           major+= controlador;
                       
                          player.show(major,minor); 
                          if(major == 136){ 
                          player.show(1,minor); 
						  major=1;}
                          alert("Major is: "+ major);
						  /*
                          Channel.style.visibility = "visible";
                          channelNum.innerHTML = major;
							
                          if(ti!=null)
                          {
                             clearTimeout(ti);
                             ti=null;
                           }
                         ti=setTimeout("Channel.style.visibility =  'hidden';",1000);
                         */
                        //setChl();
                         var channelName= pluginw.GetCurrentChannel_Name();
                         player.setChName(channelName);
                         document.getElementById('txt3').innerHTML="Current Channel: " + channelName;
				}
			
				else{
                    alert("Not Available");
				}
			
			}
			
			else{
			
				var controlador = major - id;
              if(currentSource == 0 && controlador > 0){
                    
                      major-=controlador;
             
                      player.show(major,minor); 
                      
                         if(major == 0){  
						 player.show(135,minor);
						 major = 135;}
                         alert("Major is: "+ major);
						 
						 /*
                         Channel.style.visibility = "visible";
                           channelNum.innerHTML = major;
						   
						
                         if(ti!=null)
                         {
                            clearTimeout(ti);
                            ti=null;
                          }
                        ti=setTimeout("Channel.style.visibility =  'hidden';",1000);
                            //setChl();
                         */
                        var channelName= pluginw.GetCurrentChannel_Name();
                        player.setChName(channelName);
                        document.getElementById('txt3').innerHTML="Current Channel: " + channelName;
              
            }
            else{
                    alert("Not Available");
            }
				
			}
			
		  }
	  };	
  }
  
  /** Mute functions */
  function setMuteMode(){

	  return{
		  
	  mute: function(){
		  	if(tvAudiocontrol.getMute){
		  	
		  		alert("tv is on mute");
		  		
		  	}else{
		  		alert("tv is not on mute");
		  		tvAudiocontrol.setMute(true);
		  	}
	  }
	  };
}

  function noMuteMode(){

	  return{
		  
		 nomute: function(){
	  
			 if(tvAudiocontrol.getMute){
				 alert("tv is on mute");
				 alert("Value: " + tvAudiocontrol.getMute);
				 tvAudiocontrol.setMute(false);
				 
			 }
		 }
	  };
}

	/** handler function for tv service discovery */
	
	function serviceDiscovery(){
	
		return {
			
		sendUrl: function(){
		/** For tv service discovery */
		alert("Sending Url...");
			
		//var url = "http://localhost:8080/IpServer/tv/save";
		//var jsondata = { ipTV: "http://127.0.0.1:8008/ws/", tvappname:"FrameworkBamba_Test"};
		alert("Estou aqui no service discovery fazendo requisição Ajax...");
		var plugin = document.getElementById("plugin");
		var IP = plugin.Execute("GetIP", "1");
		alert("My IP is " + IP);
		//document.getElementById("txt3").innerHTML="My IP is " + IP;
		
		
		$.ajax({
	  		type: "POST",
	  		url: "http://192.168.98.109:8080/IpServer/tv/save",
	  		//data: { ipTV: "http://192.168.98.109:8008/ws/", tvappname:"FrameworkBamba_Test"},
	  		data: { ipTV: "http://192.168.98.111:80/ws/", tvappname:"FrameworkBamba_Test"},
	  		//data: { ipTV: "http://127.0.0.1:8008/ws/", tvappname:"FrameworkBamba_Test"},
	  		dataType: 'json',
					beforeSend: function(x) {
						x.overrideMimeType("application/json;charset=UTF-8");
					}
			
		});		
		}
		};
		
	}
	
	/** JSON parse called into communicationService*/
	
	function IsJsonString(str) {
    	try {
        	JSON.parse(str);
    	} catch (e) {
        	return false;
    	}
    	return true;
	}
	
	/** handler function for tv two-way communication with smart devices */
	
	function communicationService(onconnect, ondisconnect, onshowpic, onuploadedfile, onvideo, onerrortype){
	
		if(typeof onconnect !== "function" || typeof ondisconnect !== "function" || typeof onshowpic !== "function" 
			|| typeof onuploadedfile !== "function" || typeof onvideo !== "function" || typeof onerrortype !== "function") {
            	
    		throw new TypeError("Communication service - what is trying to be setted is not callable");
  		}
		
	return {
  
		print: function(){
			//alert("ESTOU EM COMMUNICATION...");
			ondisconnect();
		},
    	onDeviceStatusChange: function(sParam){

		alert("#### onDeviceStatusChange - Device status change recieved ####");
		alert("#### onDeviceStatusChange - event type is " + sParam.eventType + " ####");
		alert("#### onDeviceStatusChange - event device name is " + sParam.name + " ####");
		alert("#### onDeviceStatusChange - event device type is " + sParam.deviceType + " ####");

		switch( Number(sParam.eventType) )
		{
			case custom.MGR_EVENT_DEV_CONNECT:
			{
			alert("#### onDeviceStatusChange - MGR_EVENT_DEV_CONNECT ####");
			if(sParam.deviceType == custom.DEV_SMART_DEVICE)
				onconnect();				
			break;
			}
			case custom.MGR_EVENT_DEV_DISCONNECT:
			{
			alert("#### onDeviceStatusChange - MGR_EVENT_DEV_DISCONNECT ####");
			if(sParam.deviceType == custom.DEV_SMART_DEVICE){
				ondisconnect();
			}
			break;
			}
			default:
			{
			alert("#### onDeviceStatusChange - Unknown event ####");
			break;
			}
		}
		
		var communication_instance = new communicationService(onconnect, ondisconnect, onshowpic, onuploadedfile, onvideo, onerrortype);
		custom.getCustomDevices(communication_instance.onCustomObtained);
	
	},
	
		onDeviceEvent: function(sParam){
		
			var communication_instance = new communicationService(onconnect, ondisconnect, onshowpic, onuploadedfile, onvideo, onerrortype);
		alert("#### - onDeviceEvent ############  First smart device - ####");
		switch(Number(sParam.infoType))
		{
			case custom.DEV_EVENT_MESSAGE_RECEIVED:
				alert("#### onDeviceEvent -1- DEV_EVENT_MESSAGE_RECEIVED:" + sParam.data.message1);
                // sParam.sEventData.sMessage1 -> message body; sParam.sEventData.sMessage2 -> context
				communication_instance.onMessageReceived(sParam.data.message1, sParam.data.message2);
			break;
			case custom.DEV_EVENT_JOINED_GROUP:
				alert("#### onDeviceEvent -1- DEV_EVENT_JOINED_GROUP ####");
				communication_instance.onMessageReceived(sParam.data.message1, sParam.data.message2);
				 break;
			case custom.DEV_EVENT_LEFT_GROUP:
				alert("#### onDeviceEvent -1- DEV_EVENT_LEFT_GROUP ####");
				communication_instance.onMessageReceived(sParam.data.message1, sParam.data.message2);
			break;
			default:
				alert("#### onDeviceEvent -1- Unknown event ####");
			break;
		}
	},
		
		onCustomObtained: function(customs){

		alert("#### onCustomObtained - found " + customs.length + " custom device(s) ####");
	
		for(i=0; i<customs.length; i++)
    	{
			alert("#### onCustomObtained - Device ID :" + customs[i].getDeviceID());
			alert("#### onCustomObtained - Device Name :" + customs[i].getName());
			alert("#### onCustomObtained - Device Unique ID :" + customs[i].getUniqueID());
				

        	if(customs[i]!=null && customs[i].getType() == custom.DEV_SMART_DEVICE)
        	{
				alert("#### onCustomObtained - get device instance:" + i);
				deviceInstance[i] = customs[i];
				var communication_instance = new communicationService(onconnect, ondisconnect, onshowpic, onuploadedfile, onvideo, onerrortype);
				deviceInstance[i].registerDeviceCallback(communication_instance.onDeviceEvent);
       	 	}
    	}
	},
	
		onMessageReceived: function(message, context){

    	// message -> message body
    	// context -> message context (headers and etc)
    	alert("#### onMessageReceived:" + message);
		alert("#### context:" + context);
    	
    	/** handling message from device instance*/
    	
    	var check = IsJsonString(message);
  		alert("************ draw to  *********evaluate JSON:" + check);
	
	
		if(check==true){	
			touchEvent = eval('(' + message + ')');
			
			 if(touchEvent.type == 'ShowPic')
			{
				alert("got ShowPic message:" + message);
				var nnavi = document.getElementById("pluginObjectNNavi");
				var deviceType = nnavi.GetModelCode();
				var fileURI ;
				if(deviceType == "LNXXB650_KOR"){
					fileURI = "http://192.168.98.168:8008/ws/app/"+curWidget.id+"/file/" + touchEvent.filename;
					//fileURI = "http://192.168.98.121:80/ws/app/"+curWidget.id+"/file/" + touchEvent.filename;
				}	
				else{
					//fileURI = "http://192.168.98.121:80/ws/app/"+curWidget.id+"/file/" + touchEvent.filename;
					fileURI = "http://192.168.98.168:8008/ws/app/"+curWidget.id+"/file/" + touchEvent.filename;
			}
				alert("file URI:" + fileURI);
				
				// CALLBACK FUNC OF IMAGE HERE... document.getElementById("myImage").src=fileURI;
				 onshowpic();
				 document.getElementById("myImage").src=fileURI;
				 
				
				
			}
			 else if(touchEvent.type == 'serverMediaUrl'){
				 alert("got Server Media message:" + message);
				 
				 // CALLBACK FUNC OF VIDEO  HERE... 
				 onvideo();
			 
    		}else if( touchEvent.type == 'Uploaded File'){
    			 alert("got message from phonegap server:" + message);
    			 
    			// CALLBACK FUNC OF IMAGEVIEW FROM SERVER  HERE... 
				 onuploadedfile();
    		}
			else{
			
				onerrortype();
			}
    	
		}
	},
		
		sendMessage: function(messageStr){
 
			 alert("#### SendMessage - get device instance:" + deviceInstance.length);
			 alert("#### SendMessage - message:" + messageStr.message);
			
			for(var i=0; i<deviceInstance.length; i++)
		    {		
					alert("#### SendMessage - deviceInstance[i]:" + deviceInstance[i]);
					deviceInstance[i].sendMessage(messageStr.message);
		    }
		     return;
		},
	
		broadcastMessage: function(messageStr){


			 alert("#### broadcastMessage - get device instance:" + deviceInstance.length);
			 alert("#### broadcastMessage - message:" + messageStr.message);
			
			for(var i=0; i<deviceInstance.length; i++)
		    {		
					alert("#### broadcastMessage - deviceInstance[i]:" + deviceInstance[i]);
					deviceInstance[i].broadcastMessage(messageStr.message);
		    }
		     return;
		},
		
		multicastMessage: function(messageStr){

			alert("#### multicastMessage - get device instance:" + deviceInstance.length);
			 alert("#### multicastMessage - message:" + messageStr.message);
			
			for(var i=0; i<deviceInstance.length; i++)
		    {		
					alert("#### multicastMessage - deviceInstance[i]:" + deviceInstance[i]);
					deviceInstance[i].multicastMessage(messageStr.message);
		    }
		     return;
		}
	
	};
	
	}
  
 /** @namespace */
    var Synchronization = {
        
        	/**
            * @default settings
            */
    		/**
      	     * @example
      	     * contains a code example, illustrating how the synchronization HANDLER passed to  
      	     * Synchronization class should be used in the user application.
      	     * TESTING COMMUNICATION MANAGER
      	     * Synchronization.init(); //First setup
      	     * var list =  Synchronization.getHandlerList();//each syncMethod has id (list.id) and callback function (list.callback)
      	     * var sync = new list[0].callback(); //Getting our first syncMethod instance id="terceiro" and the callback function
      	     * sync.login("admin", "admin", function(){alert("LOGGED TO KAEPTOR SERVER");}, function(){alert("NOT LOGGED TO KAEPTOR SERVER");});
      	     * Synchronization.bind("Inicio Comercial", callback(eventData), "terceiro"); 
			 * Synchronization.bind("voltou", callback(eventData), "terceiro"); //Knowing the syncMethod id i can bind some events with respective callback func.
			 * var channelList = sync.list(success, error); //Retrieve info of avalaible channel
			 * sync.subscribe("4f1476440cf21b20d62b0165", success_subscribe, error_subscribe);//parameters (id, sucess, error)
			 * sync.unsubscribe("4f1476440cf21b20d62b0165", success_unsubscribe, error_unsubscribe); 
      	     */
            init: function() {
            
            	var sync1 = {
    				id:'terceiro',
    				callback: terceiro,
    				};
    			var sync2 = {
    				id:'usuario',
    				callback: usuario,
    				};
                this.listsynchronization = new Array(2);
                this.listsynchronization[0] = sync1;
                this.listsynchronization[1] = sync2;
                
                /** List for bind data*/
                this.listbinddata = new Array();
            },
            /**
             * Return basic informations related to methods of synchronization.
         	 * @returns {array}
             */
            getHandlerList: function() {
                return this.listsynchronization;
            },
            /**
             * Given a name of synchronization, return his handler.
         	 * @returns {function}
             */
            getHandler: function(id) {
            	for(i=0; i<this.listsynchronization.length; i++)
					{ if(this.listsynchronization[i].id == id){
						return this.listsynchronization[i].callback;
						}
					}
				return 'Not found';
            },
            /**
         	* Set synchronization <tt>id, callback</tt>.
         	* @param {string} id The synchronization source name.
         	* @param {function} callback The synchronization callback function.
         	*/
            setHandler: function(id, callback){
            	
    			var auxiliar = 'n';
    			for(i=0; i<this.listsynchronization.length; i++)
					{ if(this.listsynchronization[i].id == id){
						auxiliar = 'y';
						}
					}
				if(auxiliar == 'n'){
					var sync = {
    					id: id,
    					callback: callback,
    				};
                	this.listsynchronization[this.listsynchronization.length] = sync;
                }
            },
            /**
         	* Attach a handler to a synchronization event <tt>eventType, handler</tt>.
         	* @param {string} eventType The string containing an event name.
         	* @param {function} [handler(eventData)] A function to execute each time the event is triggered.
         	*/
            /*
            bind: function(eventType, handler, syncType){
            
            	if (typeof handler !== "function") {
            	
    				throw new TypeError("bind - what is trying to be bound is not callable");
  				}
            	var exist = false;
            	var list =  Synchronization.getHandlerList();
            	for(i=0; i<list.length; i++){
            		
            		if(list[i].id === syncType){
            			exist = true;
            		}
            	}
            	
  				if(exist == true){
  				
  				var binddata = {
  					eventType: eventType,
					callback: handler,
					syncType: syncType
				};
  				
  				this.listbinddata[this.listbinddata.length] = binddata;
  				alert(" Bind with success ,bind string is " + eventType);
  				}
  				else{
  					alert(" SyncType Not Found");
  				}
            }*/
            bind: function(notifData, handler, syncType){
                
            	if (typeof handler !== "function") {
                	
    				throw new TypeError("bind - what is trying to be bound is not callable");
  				}
            	var exist = false;
            	var list =  Synchronization.getHandlerList();
            	for(i=0; i<list.length; i++){
            		
            		if(list[i].id === syncType){
            			exist = true;
            		}
            	}
            	
  				if(exist == true){
  				
  				var binddata = {
  					notifData: notifData,
  					callback: handler,
					syncType: syncType
				};
  				
  				this.listbinddata[this.listbinddata.length] = binddata;
  				alert(" Bind with success ,bind string is " + notifData.codRequisicao);
  				alert(" Bind with success ,bind channel id is " + notifData.idCanal);
  				alert(" Bind with success ,bind action is " + notifData.acao);
  				alert(" Bind with success ,bind description is " + notifData.detalhes);
  				
  				}
  				else{
  					alert(" SyncType Not Found");
  				}
            },
            /**
             * Returns List of bind data.
         	 * @returns {Array}
             */
            getBinddata: function() {
            	
            	return this.listbinddata;
            }
    };
    
    /** @namespace */
    var Keymanagement = {
        
        	/**
             * A class for managing keys of a ticker application.
             * @param {array} tvKeyList An array containing an event keyCode list.
             */
            onshow: function(tvKeyList) {
            	this.keycodes = new Array();
            	this.keycodes = tvKeyList;
            	/** register this.keycodes
            	*/
            	
            	var PLUGIN = document.getElementById("pluginObjectTVMW");
		
				if(PLUGIN){
		
            	alert("PLUGIN Succeed");
				var pluginAPI1 = new Common.API.Plugin();
			
				for(i=0; i<this.keycodes.length; i++){
				
					pluginAPI1.registKey(this.keycodes[i]);
						
					}
			
         		}
		 		else{
				alert("PLUGIN Failed");
		 		}
		
            },
            /**
             * Unregister ticker application keys.
             * @extends onshow
             */
             onend: function () {
       		 /** unregister this.keycodes
       		 */
       		 
       		 	var PLUGIN = document.getElementById("pluginObjectTVMW");
		
				if(PLUGIN){
		
            	alert("PLUGIN Succeed");
				var pluginAPI1 = new Common.API.Plugin();
			
				for(i=0; i<this.keycodes.length; i++){
				
				pluginAPI1.unregistKey(this.keycodes[i]);
						
					}
			
        		}
		 		else{
				alert("PLUGIN Failed");
		 		}
       		 
    		},
    		/**
             * Return registered keys.
         	 * @returns {array}
             */
             getRegisteredKeys: function() {
                return this.keycodes;
             },
    		/**
             * Return true if the given key is registered and false otherwise.
         	 * @returns {boolean}
             */
             isRegisteredKey: function(keycode) {
             
             	for(i=0; i<this.keycodes.length; i++){
				
					if(this.keycodes[i] == keycode){
						
						return true;
					}
						
				}
                return false;
             }
    };

/** @namespace */
    var Tvcontrol = {
        
        	/**
             * A class for controlling keys tv features.
             * @param {string} id The string containing a channel id.
             */
             /**
       	     * @example
       	     * contains a code example, illustrating how the tvcontrol HANDLER passed to  
       	     * Tvcontrol class should be used in the user application.
       	     * Tvcontrol.init(); //First setup
       	     * var channelchangeFromTo = Tvcontrol.getChannelChange(); //Getting channelchange instance 
       	     * channelchangeFromTo.changingchannel(); // Channel Change being called
       	     * var mute = Tvcontrol.getMuteMode(); // For calling mute mode function 
			 * mute.mute();
			 * var nomute = Tvcontrol.getNoMuteMode(); // For nomute mode function
			 * nomute.nomute();
       	     */
    		init: function(){
    			
    			this.channelchange = changingChannelFromTo();
    			this.mutemode = setMuteMode();
    			this.nomutemode = noMuteMode();
    		},
    		/**A class for tv channel tune.
             */
            setChannelChange: function(handler) {
            	
            	if (typeof handler !== "function") {
            	
    				throw new TypeError("Channel Change - what is trying to be setted is not callable");
  				}
            	this.channelchange = handler;
            
            },
        	/**Getting tv channel tune function.
             */
            getChannelChange: function(){
            
            	return this.channelchange; 
            },
             /**A class for controlling tv mute mode.
             */
            setMuteMode: function(handler) {
            
            	if (typeof handler !== "function") {
            	
    				throw new TypeError("Mute Mode - what is trying to be setted is not callable");
  				}
            	this.mutemode = handler;
            },
            /** Retrieving tv mute mode handler.
             */
            getMuteMode: function(){
            
            	return this.mutemode; 
            },
            /**A class for controlling tv nomute mode.
             */
            setNoMuteMode: function(handler) {
                
            	if (typeof handler !== "function") {
            	
    				throw new TypeError("Mute Mode - what is trying to be setted is not callable");
  				}
            	this.nomutemode = handler;
            },
            /** Retrieving tv nomute mode handler.
             */
            getNoMuteMode: function(){
            
            	return this.nomutemode; 
            },
             /**Increment tv vol...
             */
            setVolumeInc: function(handler) {
            
            	if (typeof handler !== "function") {
            	
    				throw new TypeError("Volume Inc - what is trying to be setted is not callable");
  				}
            	this.volumeinc = handler;
            },
            /** Retrieving volumen inc handler.
             */
            getVolumeInc: function(){
            
            	return this.volumeinc; 
            },
             /**Decrement tv vol...
             */
            setVolumeDec: function(handler) {
            
            	if (typeof handler !== "function") {
            	
    				throw new TypeError("Volume Dec - what is trying to be setted is not callable");
  				}
            	this.volumedec = handler;
             },
             /** Retrieving volumen inc handler.
              */
             getVolumeDec: function(){
            
            	return this.volumedec; 
            },
            /**Set tv vol to a given level...
              */
             setVolumeLevel: function(handler) {
             
             	if (typeof handler !== "function") {
             	
     				throw new TypeError("Volume to level - what is trying to be setted is not callable");
   				}
             	this.volumelevel = handler;
              },
              /** Retrieving volumen level handler.
               */
              getVolumeLevel: function(){
             
             	return this.volumelevel; 
             }                
    };
    
    /** @namespace */
    var Channelid = {
        
        	/**
             * A class for obtaining channel id.
             * @returns {string}
         	 * Set channel id <tt>handler</tt>.
         	 * @param {function} handler A function to execute for obtaining a channel id.
         	 */
    		
    		init: function(){
    			
    			this.channelid = getChannedlID();
    		},
    		/**Set tv channel id handler...
             */
    		/**
    	     * @example
    	     * contains a code example, illustrating how the channelid HANDLER passed to  
    	     * Channelid class should be used in the user application. 
    	     * var id = Channelid.init();//GETTING CURRRENT CHANNEL ID...
    	     * console.log(id); // id ={
				ptc: ptc,
				major: major,
				minor: minor,
				sourceID: sourceID,
				programNumber: programNumber,
				transportStreamID: transportStreamID
				}
			 * This id information will be used in channelchanging handler
    	     */
    		setChannelid: function(handler) {
    			
         	if (typeof handler !== "function") {
            	
    				throw new TypeError("Channelid - what is trying to be bound is not callable");
  				}
            this.channelid = handler;
    		},
    		/** Retrieve tv channel id handler.
             */
    		getChannelid: function(){
    			
    			return this.channelid;
    		}

    	
 };
    
/** @namespace */
    var Servicediscovery = {
        
        	/**
             * A class for TV service discovery.
               @returns {string}
             */
             /**
       	     * @example
       	     * contains a code example, illustrating how the service discovery HANDLER passed to  
       	     * Servicediscovery class should be used in the user application.
       	     * Servicediscovery.init(); //First setup 
       	     * var discovery = Servicediscovery.getServiceUrl(); // Getting service discovery instance
			 * discovery.sendUrl(); // Send tv service url to the server
       	     */
    		init: function(){
    			
    			this.discovery = serviceDiscovery();
    		},
    		/**Set service discovery handler...
             */
            setServiceDiscovery: function(handler) {
            
            	if (typeof handler !== "function") {
            	
    				throw new TypeError("Service Discovery - what is trying to be setted is not callable");
  				}
            	this.discovery = handler;
            },
            /**Retrieve service discovery handler...
             */
            getServiceUrl: function() {
            
            	return this.discovery;
            }   
    }; 
    
 /** @namespace */   
      var Communication = {
        
        	/**
             * A class for communication manager.
               @returns {string}
             */
    		/**
      	     * @example
      	     * contains a code example, illustrating how the communication HANDLER passed to  
      	     * Communication class should be used in the user application.
      	     * Communication.init(onconnect, ondisconnect, onshowpic, onvideo, onerrortype); //First setup callback parameters 
      	     * var communication = Communication.getServiceCommunication();//RETRIEVE COMMUNICATION SERVICE
      	     * TESTING COMMUNICATION MANAGER 
      	     * onDeviceStatusChange = function(sParam){
					communication.onDeviceStatusChange(sParam);
				}; //Receiving device connect and disconnect EVENTS
			 * onDeviceEvent = function(sParam){
					communication.onDeviceEvent(sParam);
				}; //Managing events occurring at the device instance
			 * onCustomObtained = function(customs){
					communication.onCustomObtained(customs);
				}; //Used to register a callback function (onDeviceEvent) of each available device
			 * onMessageReceived = function(message, context){
					communication.onMessageReceived(message, context);
				}; // Receiving messages from devices after onDeviceEvent occurs and do something
			 * sendMessage = function(message){
					communication.sendMessage(message);
				}; // Send message to a given device ID
			 * broadcastMessage = function(message){
					communication.broadcastMessage(message);
				}; // Send message to all connected devices
			 * multicastMessage = function(message){
					communication.multicastMessage(message);
				}; // Send message to a given set of connected devices
      	     */
    		  
    		 init: function(onconnect, ondisconnect, onshowpic, onuploadedfile, onvideo, onerrortype){
    		
    	    		
    	    		this.service = communicationService(onconnect, ondisconnect, onshowpic, onuploadedfile, onvideo, onerrortype);
    		 },
    		/**Set communication service handler...
              */
            setCommunicationService: function(handler) {
            
            	if (typeof handler !== "function") {
            	
    				throw new TypeError("Communication Service - what is trying to be setted is not callable");
  				}
            	this.service = handler;
            },
        	/**Retrieve communication service handler...
             */
            getServiceCommunication: function() {
            
            	return this.service;
            }
               
    }; 
      
   /** @namespace */
     var Framework = {
    		
    		/**Initial Set Up of the framework...
              */
    		 setup: function(onconnect, ondisconnect, onshowpic, onuploadedfile, onvideo, onerrortype){
    			
 	      	 	
    	Synchronization.init();
    	Servicediscovery.init();
    	Communication.init(onconnect, ondisconnect, onshowpic, onuploadedfile, onvideo, onerrortype);
    	Channelid.init();
    	Tvcontrol.init();
    	
    	
    	
    	}
    	
      };
    
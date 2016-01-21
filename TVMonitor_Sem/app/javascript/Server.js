
var HttpObj = null;

/*Callback function to be set by client*/
var dataReceivedCallback = null;

//var Url = "http://lince.dc.ufscar.br/~cedrick/teste/VideoDataXml.xml";
var Url = "http://lince.dc.ufscar.br/~cedrick/teste/Jsonvideodata.json";




function Server_init(){

	var success = true;
	
	if(HttpObj){

		HttpObj = null;
	}
	return success;
}

function Server_dataReceivedCallback(){
		
			alert("All data received");
			 this.pluginw =  document.getElementById("pluginWindow");
			 var channelName = this.pluginw.GetSource();
			 alert("Aqui esta ele:" + channelName );
}

function Server_fetchVideoList(){

	if(HttpObj == null){
	
		HttpObj = new XMLHttpRequest();
	}
	
	if(HttpObj){
	
			HttpObj.onreadystatechange = function(){
		
			if(HttpObj.readyState == 4){
			
				Server_createVideoList();
			}
		}
		HttpObj.open("GET", Url, true);
		HttpObj.send(null);
	
	}
	else{
	
		alert("Failed to create Http");
	}

}

 function Server_createVideoList(){

		if(HttpObj.status != 200){
			
			Display.status("XML Server Erro" + HttpObj.status);
		}
		else{
		
			var stringJson = HttpObj.responseText;
			
			if(!stringJson){
			
				alert("Failed to get valid XML");
			}
			else{
			
				//Parse RSS
				//Get all "item" elements
				//CONTINUAR A PARTIR DAQUI...
				
				var jsondata = eval("("+HttpObj.responseText+")"); //retrieve result as an JavaScript object
				//var output='<ul>';
				var videoNames =[]; 
				var videoUrls =[];
				var videoDescriptions =[];
				for (var i=0; i<jsondata.itens.length; i++){
						videoNames[i] = jsondata.itens[i].titulo;
						videoUrls[i] = jsondata.itens[i].link;
						videoDescriptions[i] =jsondata.itens[i].descricao;
						alert("Chegue aqui " + videoNames[i] + " "+ videoUrls[i] + " "+ videoDescriptions[i]);
						//output+='<li>';
						//output+='<a href="'+jsondata[i].link+'">';
						//output+=jsondata[i].title+'</a>';
						//output+='</li>';
				}
				//output+='</ul>';
				
				dataReceivedCallback = true;
				Data_setVideoNames(videoNames);
				Data_setVideoUrls(videoUrls);
				Data_setVideoDescriptions(videoDescriptions);
				//document.getElementById("resultJson").innerHTML = output;
				//var varElement = document.getElementById("videoBox_top");
				//widgetAPI.putInnerHTML(varElement, output);
				
				if(dataReceivedCallback){
				//alert("Chegamos aqui de novo!!!!");
				
					Server_dataReceivedCallback(); /*Notify all data is received and stored...*/
					/*var limit = Data_getVideoCount();
					
					for(var index = 0; index < limit; index++){
						alert("O Video "+ (index) + "se encontra no seguinte url:" + Data_getVideoUrl(index));
					}*/
					
				}
			}
		
		}
	}





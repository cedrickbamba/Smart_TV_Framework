var widgetAPI = new Common.API.Widget();
var tvKey = new Common.API.TVKeyValue();


var sync;
var communication;
var discovery;
var channelid;
var channelchangeFromTo;
var videoNames_List = [];
var listOfNames = []; 
var listOfIds = [];

var left = "nao";
var right = "sim";
var menu_principal_JaVisto = "nao";
var acaoInicio ="";
var acaoFim ="";
var acaoPrincipal ="";

//NOTIFICATION var...
var idCanal, listaIdCanais, detalhes, acao, tipoCena, tempoAntecedencia, tipoEvento, idApp, idServer, idFoto, listaUsuarios, mensagem, tempoRelogio;
var acoes = ["mudança de canal", "mute", "playback video", "permanecer no canal", "imagens viewer"];
var vetorNomesCanais = ["EPTV CENTRAL", "Sbt", "TV Cultura", "TV CLUBE HD","Gazeta", "Gazeta", "Record", "Band Clube", "Record News", "Sem Nome1", "Mix TV", "TV Brasil", "Sem Nome2", "Rede Vida HD"];
var vetorIdCanais = ["4f1476440cf21b20d62b0149", "4f1476450cf21b20d62b0199", "4f1476440cf21b20d62b012f", "B4f1476440cf21b20d62b0121","4f1476440cf21b20d62b0145", "4f1476440cf21b20d62b0145", "4f1476440cf21b20d62b0171", "4f1476440cf21b20d62b0121", "4f1476440cf21b20d62b0170", "Sem Nome1", "Mix TV", "TV Brasil", "Sem Nome2", "4f1476450cf21b20d62b0195"];
var Main =
{
count:0,
selectedVideo : 0,
UP : 0,
DOWN : 1,
mute : 0,
NMUTE : 0,
YMUTE : 1,
mode : 0,
WINDOW : 0,
FULLSCREEN : 1
};

Main.onLoad = function()
{
	// Enable key event processing
	this.enableKeys();
	
		pluginAPI = document.getElementById("pluginTVMW");
		pluginw =  document.getElementById("pluginWindow");
	 	pluginTV =  document.getElementById("pluginTV");
	 	player = window["flvplayer"];
	widgetAPI.sendReadyEvent();
	//window.onShow = Main.onshow();
	// INICIALIZATION OF THE FRAMEWORK
	 /** for testing a framework */
		function onconnect(){
			alert("CONNECTED");
			document.getElementById('mobile').style.display="block";
		}
		function ondisconnect(){
			alert("DISCONNECTED");
			document.getElementById('mobile').style.display="none";
		}
		function onshowpic(){
			alert("SHOWING PICTURE");
		}
		function onuploadedfile(){
			alert("UPLOADED FILE WITH ÊXIT");

			urlget ="http://192.168.98.109/phonegapserver/uploads/";
	
			TVMWPlugin = document.getElementById('pluginTVMW');
			tvSourceOrg = TVMWPlugin.GetSource();
			TVMWPlugin.SetMediaSource();
			$("#insert-images").html("");
			document.getElementById('menu_highlight').style.display="none";
			document.getElementById("help_navi2").style.display="none";
			$.get(urlget,function(data,status){
				
				if(data !== null){
					
					alert("Some data retrieved");
					alert(data);
					var list = $(data).find('li');
					var index = 0;
					$(list).each(function() {
						
						var string = $(this).find('a').attr('href');
						if(string !== '/phonegapserver/'){
							var src = urlget + string;
							
							$("#insert-images").append("<img src='"+src+"'"+"style='margin-top:0px; margin-left:250px; width:463px; height: 810px'/><br>");
		      
						}
						index++;
					});
					
			}
				
			});

			
		}
		function onvideo(){
			alert(" PLAYING VIDEO");
		}
		function onerrortype(){
			alert("ERROR TYPE");
		}
		
	Framework.setup(onconnect, ondisconnect, onshowpic, onuploadedfile, onvideo, onerrortype);
	 
	// TESTING SERVICE DISCOVERY
	discovery = Servicediscovery.getServiceUrl();
	discovery.sendUrl();
	
	//TESTING COMMUNICATION SERVICE
	communication = Communication.getServiceCommunication();
	communication.print();
	
	//TESTING SYNCHRONIZATION SERVICE (TERCEIRO: KAEPTOR)
	var list =  Synchronization.getHandlerList();
	sync = new list[0].callback();
	sync.login("admin", "admin", function(){alert("LOGGED TO KAEPTOR SERVER");}, function(){alert("NOT LOGGED TO KAEPTOR SERVER");});
	
	

	
	
	
	//TESTING TVCONTROL MODULE
	channelchangeFromTo = Tvcontrol.getChannelChange();
	
	
	// Register custom manager callback to receive device connect and disconnect events
	custom.registerManagerCallback(Main.onDeviceStatusChange);
	alert(communication.onDeviceStatusChange);
	// Initializes custom device profile and gets available devices
	custom.getCustomDevices(Main.onCustomObtained);
};

Main.onUnload = function()
{
	TVMWPlugin.SetSource(tvSourceOrg);
};

//1.Início/Fim de comercial
function inicio_comercial(handler){
	var notifData = {
		codRequisicao:"Inicio Comercial",
		idCanal:idCanal,
		detalhes:detalhes,
		acao: acao
	};
	Synchronization.bind(notifData, handler, "terceiro");
}
function fim_comercial(handler){
	var notifData = {
		codRequisicao:"Fim Comercial",
		idCanal:idCanal,
		detalhes:detalhes,
		acao: acao
	};
	Synchronization.bind(notifData, handler, "terceiro");
}
//2.Início/Fim de bloco comercial
function inicio_bloco_comercial(){
	var notifData = {
		codRequisicao:"inicio_bloco_comercial",
		listaIdCanais:listaIdCanais,
		acao: acao
	};
	Synchronization.bind(notifData, "terceiro");
}
function fim_bloco_comercial(){
	var notifData = {
		codRequisicao:"fim_bloco_comercial",
		listaIdCanais:listaIdCanais,
		acao: acao
	};
	Synchronization.bind(notifData, "terceiro");
}
//3.Início/Fim de programa
function inicio_programa(){
	var notifData = {
		codRequisicao:"inicio_programa",
		listaIdCanais:listaIdCanais,
		detalhes:detalhes,
		acao: acao
	};
	Synchronization.bind(notifData, "terceiro");
}
function fim_programa(){
	var notifData = {
		codRequisicao:"fim_programa",
		listaIdCanais:listaIdCanais,
		detalhes:detalhes,
		acao: acao
	};
	Synchronization.bind(notifData, "terceiro");
}
//4.Pausa/Reinício de programa
function pausa_programa(){
	var notifData = {
		codRequisicao:"pausa_programa",
		listaIdCanais:listaIdCanais,
		acao: acao
	};
	Synchronization.bind(notifData, "terceiro");
}
function reinicio_programa(){
	var notifData = {
		codRequisicao:"reinicio_programa",
		listaIdCanais:listaIdCanais,
		acao: acao
	};
	Synchronization.bind(notifData, "terceiro");
}
//5.Início/Fim de cena
function inicio_cena(){
	var notifData = {
		codRequisicao:"inicio_cena",
		tipoCena: tipoCena,
		listaIdCanais:listaIdCanais,
		detalhes: detalhes,
		tempoAntecedencia: tempoAntecedencia,
		acao: acao
	};
	Synchronization.bind(notifData, "terceiro");
}
function fim_cena(){
	var notifData = {
		codRequisicao:"fim_cena",
		tipoCena: tipoCena,
		listaIdCanais:listaIdCanais,
		detalhes: detalhes,
		tempoAntecedencia: tempoAntecedencia,
		acao: acao
	};
	Synchronization.bind(notifData, "terceiro");
}
//6.Registrar eventos de notificação interna
function registrar_eventos_notif_interno(){
	var notifData = {
		codRequisicao:"registrar_eventos_notif_interno",
		tipoEvento: tipoEvento,
		acao: acao
	};
	Synchronization.bind(notifData, "terceiro");
}
//7.Autorizar o envio de estado para...
function autorizar_envio_estado_para(){
	var notifData = {
		codRequisicao:"autorizar_envio_estado_para",
		idApp: idApp,
		listaUsuarios: listaUsuarios,
		idServer: idServer,
		acao: acao
	};
	Synchronization.bind(notifData, "terceiro");
}
//8.Solicitar monitoramento de...
function solicitar_monitoramento_de(){
	var notifData = {
		codRequisicao:"solicitar_monitoramento_de",
		idApp: idApp,
		listaUsuarios: listaUsuarios,
		idServer: idServer,
		acao: acao
	};
	Synchronization.bind(notifData, "terceiro");
}
//9.Enviar Mensagens Genéricas...
function enviar_mensagens_genericas(){
	var notifData = {
		codRequisicao:"enviar_mensagens_genericas",
		idApp: idApp,
		listaUsuarios: listaUsuarios,
		idServer: idServer,
		mensagem: mensagem,
		acao: acao
	};
	Synchronization.bind(notifData, "terceiro");
}
//10.Solicitar fotos (snapshots do momento)...
function solicitar_fotos_do_momento(){
	var notifData = {
		codRequisicao:"fotos_do_momento",
		idCanal: idCanal,
		tempoRelogio: tempoRelogio,
		acao: acao
	};
	Synchronization.bind(notifData, "terceiro");
}
//11.Refina fotos...
function refinar_fotos(){
	var notifData = {
		codRequisicao:"refina_fotos",
		idFoto: idFoto,
		acao: acao
	};
	Synchronization.bind(notifData, "terceiro");
}
//12.Solicitar token/id de um comercial/programa...
function solicitar_token(){
	var notifData = {
		codRequisicao:"token_evento",
		idFoto: idFoto,
		acao: acao
	};
	Synchronization.bind(notifData, "terceiro");
}


//FOR TESTING CHANNEL LIST
function success( List ){
	
    $.each(
    		List,
        function( index, objChannel ){
      	
        	alert("INDEX: " + index);	
			alert("NAME: " + objChannel.name);
			alert("ID: " + objChannel.id);
			Display.show("leftHalf_List");
			//document.getElementById("leftHalf_List").style.display= "block";
			document.getElementById("videoList_List").style.backgroundImage= "url(app/images/listbox/ListBox_List_Trans.png)";
			document.getElementById("previous_List").style.backgroundImage= "url(app/images/listbox/previous.png)";
			document.getElementById("next_List").style.backgroundImage= "url(app/images/listbox/next.png)";
			Display.show("previous_List");
			Display.show("next_List");
			Display.show("bg13Paint_List");
			listOfNames[index] = objChannel.name;
			listOfIds[index] = objChannel.id;

        }
    );
    this.count = listOfNames.length;
    videoNames_List = listOfNames;
    Display.setVideoList_List(listOfNames);
    Main.keyDownListCanaisFocus();
}
function error(){
	
	alert("LIST ERROR");
}

//TESTING SUBSCRIBE

function success_subscribe(){
	alert("CHANNEL SUBSCRIBED");
}

function error_subscribe(){
	alert("SUBSCRIBE ERROR ");
}

function callback(data){
	
	alert("Inicio da Progaganda no canal "+data.channel+" !");
							
}

//TESTING UNSUBSCRIBE

function success_unsubscribe(){
	alert("CHANNEL UNSUBSCRIBED");
}

function error_unsubscribe(){
	alert("UNSUBSCRIBE ERROR ");
}

//CALLBACK DO PLAYER DE VÍDEO

function callbackVideo(){
	 setTimeout(function(){
			
			var intervalo = setInterval(function() {
			
			$("#carregando_img").html(""); 
			
			url = "load" + i + ".png";	
		
			$("#carregando_img").append("<img src='resource/images/"+ url + "'/>");
			
			document.getElementById("loading").style.display="block";
			alert("LOADING..." + url);
				i++;
				if(i == 13){i = 1;}
			}, 300);
			setTimeout(function() {
			clearInterval(intervalo);
			document.getElementById("loading").style.display="none";
			
			alert("Loading Video Player...");
			
			document.getElementById("help_navi2").style.display = "none";
			document.getElementById("menu_principal").style.display = "none";
			Main.InitVideoApp();
			document.getElementById("principal").style.display = "block";
		
			
			}, 7200);
			
			},2000);
}
//TESTING COMMUNICATION MANAGER

Main.onDeviceStatusChange = function(sParam){
	
	communication.onDeviceStatusChange(sParam);
};

Main.onCustomObtained = function(customs){
	
	communication.onCustomObtained(customs);
};

Main.onDeviceEvent = function(sParam){
	
	communication.onDeviceEvent(sParam);
};

Main.onMessageReceived = function(message, context){
	
	communication.onMessageReceived(message, context);
};

Main.enableKeys = function()
{
	document.getElementById("anchor").focus();
};
Main.enableKeysVideo = function()
{
	document.getElementById("anchor_video").focus();
};
Main.disableKeys = function()
{
	document.getElementById("fim").focus();
};
Main.enableKeys_EncerrarApp = function()
{
	document.getElementById("Popup_EncerrarApp").focus();
};
Main.enableKeys_Return = function()
{
	document.getElementById("return").focus();
};
Main.keyDownPrincipalFocus = function()
{
	document.getElementById("Menu_principal").focus();
};
Main.keyDownListCanaisFocus = function()
{
	document.getElementById("Menu_List").focus();
}; 
Main.keyDownInicioComercialFocus = function()
{
	document.getElementById("Menu_Inicio_Comercial").focus();
};
Main.keyDownFimComercialFocus = function()
{
	document.getElementById("Menu_Fim_Comercial").focus();
};

Main.keyDown = function()
{
	var keyCode = event.keyCode;
	alert("Key pressed: " + keyCode);

	switch(keyCode)
	{
		case tvKey.KEY_RETURN:
			widgetAPI.blockNavigation(event);
			document.getElementById("menu_principal").style.display="none";
			document.getElementById("help_navi2").style.display="none";
			Main.enableKeys_Return();
			break;
		case tvKey.KEY_LEFT:
			alert("LEFT");
			//TESTING CHANNEL LIST
			//sync.list(success, error);
			//var mute = Tvcontrol.getMuteMode();
			//mute.mute();
			callbackVideo();
			break;
		case tvKey.KEY_RIGHT:
			alert("RIGHT");
			//TESTING SUBSCRIBE (CHANNEL MTV Brasil)
			//sync.subscribe("4f1476440cf21b20d62b0165", success_subscribe, error_subscribe);
			var nomute = Tvcontrol.getNoMuteMode();
			nomute.nomute();
			break;
		case tvKey.KEY_UP:
			alert("UP");
			//TESTING UNSUBSCRIBE (CHANNEL MTV Brasil)
			//sync.unsubscribe("4f1476440cf21b20d62b0165", success_unsubscribe, error_unsubscribe);
			
			//GETTING CURRRENT CHANNEL ID...
			Channelid.init();
			break;
		case tvKey.KEY_DOWN:
			alert("DOWN");
			//TESTING CHANNEL CHANGE
			channelchangeFromTo.changingchannel();
			
			break;
		case tvKey.KEY_1:
			alert("1");
			if( menu_principal_JaVisto == "sim"){
			document.getElementById("help_navi2").style.display="none";
			document.getElementById("UIPopupDiv").style.display="none";

			 document.getElementById("op1_menu_highlight").innerHTML="Mudanca de canal";
			 document.getElementById("op1_menu_highlight").style.backgroundImage= "url(app/images/listbox/selector.png)";
			 document.getElementById("op2_menu_highlight").innerHTML="Mute";
			 document.getElementById("op3_menu_highlight").innerHTML="Playback Video";
			 document.getElementById("op4_menu_highlight").innerHTML="Exibir foto do mobile";
			 document.getElementById("op5_menu_highlight").innerHTML="Fazer nada";
			 document.getElementById("menu_highlight").style.display="block";
			 
			 acaoInicio = "Mudanca de canal";
			 Main.keyDownInicioComercialFocus();
			}
			break;
		case tvKey.KEY_2:
			alert("2");
			
			if( menu_principal_JaVisto == "sim"){
			document.getElementById("help_navi2").style.display="none";
			document.getElementById("UIPopupDiv").style.display="none";
			 
			 document.getElementById("op1_menu_highlight").innerHTML="Voltar ao canal do registro";
			 document.getElementById("op1_menu_highlight").style.backgroundImage= "url(app/images/listbox/selector.png)";
			 document.getElementById("op2_menu_highlight").innerHTML="Continuar no mesmo canal";
			 document.getElementById("op3_menu_highlight").innerHTML="";
			 document.getElementById("op4_menu_highlight").innerHTML="";
			 document.getElementById("op5_menu_highlight").innerHTML="";
			 
			 document.getElementById("menu_highlight").style.display="block";
			 Main.keyDownFimComercialFocus();
			}
			break;
		case tvKey.KEY_GREEN: 
			 alert("GREEN");
			/*
			 var link1 = "#numero1";
			 var link2 = "#numero2";
			 var link3 = "#numero3";
			 var link4 = "#numero4";
			 var link5 = "#numero5";
			 $(link1).html("");
			 $(link2).html("");
			 $(link3).html("");
			 $(link4).html("");
			 $(link5).html("");
			 
			 $(link1).append("<img src='app/images/listbox/numero1.png'/>");
			 $(link2).append("<img src='app/images/listbox/numero2.png'/>");
			 $(link3).append("<img src='app/images/listbox/numero3.png'/>");
			 $(link4).append("<img src='app/images/listbox/numero4.png'/>");
			 
			 
			 document.getElementById("op1_menu").innerHTML="Programar Acoes InicioComercial";
			 document.getElementById("op2_menu").innerHTML="Programar Acoes FimComercial";
			 document.getElementById("op3_menu").innerHTML="Selecionar um comercial";
			 document.getElementById("op4_menu").innerHTML="Solicitar snapshots";
			 document.getElementById("op5_menu").innerHTML="";
			 document.getElementById("menu_principal").style.display="block";
			 */
			 //Limpando os HIGHTLIGHTS...
			 document.getElementById("op1_menu_highlight").style.backgroundImage= "url(none)";
			 document.getElementById("op2_menu_highlight").style.backgroundImage= "url(none)";
			 document.getElementById("op3_menu_highlight").style.backgroundImage= "url(none)";
			 document.getElementById("op4_menu_highlight").style.backgroundImage= "url(none)";
			 document.getElementById("op5_menu_highlight").style.backgroundImage= "url(none)";
			 
			 document.getElementById("op1_menu_highlight").innerHTML="Programar Acoes InicioComercial";
			 document.getElementById("op1_menu_highlight").style.backgroundImage= "url(app/images/listbox/selector.png)";
			 document.getElementById("op2_menu_highlight").innerHTML="Programar Acoes FimComercial";
			 document.getElementById("op3_menu_highlight").innerHTML="Selecionar um comercial";
			 document.getElementById("op4_menu_highlight").innerHTML="Solicitar snapshots";
			 document.getElementById("op5_menu_highlight").innerHTML="";
			 document.getElementById("menu_highlight").style.display="block";
			 
			 acaoPrincipal = "Programar Acoes InicioComercial";
			 Main.keyDownPrincipalFocus();
			 //setTimeout("document.getElementById('menu_principal').style.display='none';  menu_principal_JaVisto = 'sim';",5000);
			
			break;
		case tvKey.KEY_ENTER:
		case tvKey.KEY_PANEL_ENTER:
			alert("ENTER");
			//communication.sendMessage({"message":"Hello I am from smart tv device, now you can upload your image file!!"}); //JSON Message 
			idCanal = "12345";
			detalhes = true;
			acao = acoes[0];
			inicio_comercial();
			break;
		case tvKey.KEY_EXIT:
			alert("EXIT");
			document.getElementById("menu_principal").style.display="none";
			document.getElementById("mobile").style.display="none";
			document.getElementById("help_navi2").style.display="none";
			document.getElementById("UIPopupDiv").style.backgroundImage = "url(app/images/listbox/popup_bg_01.png)";
			document.getElementById("Button1").style.backgroundImage = "url(app/images/listbox/button_normal1.png)";
			document.getElementById("Button2").style.backgroundImage = "url(app/images/listbox/button_normal2_selecao.png)";
			document.getElementById("UIPopupDiv").style.display = "block";
			Main.enableKeys_EncerrarApp();
			break;
		default:
			alert("Unhandled key");
			break;
	}
};
//Disable Keys
Main.keyDownFim = function()
{
	var keyCode = event.keyCode;

	switch(keyCode)
	{
		case tvKey.KEY_RETURN:
		case tvKey.KEY_PANEL_RETURN:
			
		default :
			break;
	}
};
//Enable RETURN Key
Main.keyDownReturn = function()
{
	var keyCode = event.keyCode;

	switch(keyCode)
	{
		case tvKey.KEY_RETURN:
			widgetAPI.blockNavigation(event);
			document.getElementById("help_navi2").style.display="block";
			Main.enableKeys();
			break;
			
		default :
			break;
	}
};
//Key Handler Encerrar App
Main.keyDownEncerrarApp = function()
{
	var keyCode = event.keyCode;
	
	switch(keyCode) {
		
		case tvKey.KEY_LEFT: 
			
			document.getElementById("Button1").style.backgroundImage= "url(app/images/listbox/button_normal1_selecao.png)";
			document.getElementById("Button2").style.backgroundImage= "url(app/images/listbox/button_normal2.png)";
			left = "sim";
			right = "nao";
			
			break;
			
		case tvKey.KEY_RIGHT: 
			
			document.getElementById("Button1").style.backgroundImage= "url(app/images/listbox/button_normal1.png)";
			document.getElementById("Button2").style.backgroundImage= "url(app/images/listbox/button_normal2_selecao.png)";
			left = "nao";
			right = "sim";
			
			break;
			
		case tvKey.KEY_ENTER: 
		
			if(left == "sim"){
				document.getElementById("UIPopupDiv").style.display = "none";
				Main.disableKeys();
			}
			else{
				document.getElementById("UIPopupDiv").style.display = "none";
				document.getElementById("help_navi2").style.display="block";
				Main.enableKeys();
			}
			break;
		default :
			break;
	}
};

//Enable Principal Keys
Main.keyDownPrincipal = function()
{
	var keyCode = event.keyCode;

	switch(keyCode) {
	
	case tvKey.KEY_LEFT: 
		
		break;
		
	case tvKey.KEY_RIGHT: 
		
		break;
		
	case tvKey.KEY_UP: 
		if(acaoPrincipal == "Programar Acoes InicioComercial"){
			 document.getElementById("op1_menu_highlight").style.backgroundImage= "url(none)";
			 document.getElementById("op4_menu_highlight").style.backgroundImage= "url(app/images/listbox/selector.png)";	 
			 acaoPrincipal = "Solicitar snapshots";
		}else if(acaoPrincipal == "Programar Acoes FimComercial"){
			 document.getElementById("op2_menu_highlight").style.backgroundImage= "url(none)";
			 document.getElementById("op1_menu_highlight").style.backgroundImage= "url(app/images/listbox/selector.png)";
			 acaoPrincipal = "Programar Acoes InicioComercial";
		}else if(acaoPrincipal == "Selecionar um comercial"){
			 document.getElementById("op3_menu_highlight").style.backgroundImage= "url(none)";
			 document.getElementById("op2_menu_highlight").style.backgroundImage= "url(app/images/listbox/selector.png)";
			 acaoPrincipal = "Programar Acoes FimComercial";
		}else {
			 document.getElementById("op4_menu_highlight").style.backgroundImage= "url(none)";
			 document.getElementById("op3_menu_highlight").style.backgroundImage= "url(app/images/listbox/selector.png)";
			 acaoPrincipal = "Selecionar um comercial";
		}
		
		alert("Up List");
		break;
		
	case tvKey.KEY_DOWN: 
		
		if(acaoPrincipal == "Programar Acoes InicioComercial"){
			 document.getElementById("op1_menu_highlight").style.backgroundImage= "url(none)";
			 document.getElementById("op2_menu_highlight").style.backgroundImage= "url(app/images/listbox/selector.png)";	 
			 acaoPrincipal = "Programar Acoes FimComercial";
		}else if(acaoPrincipal == "Programar Acoes FimComercial"){
			 document.getElementById("op2_menu_highlight").style.backgroundImage= "url(none)";
			 document.getElementById("op3_menu_highlight").style.backgroundImage= "url(app/images/listbox/selector.png)";
			 acaoPrincipal = "Selecionar um comercial";
		}else if(acaoPrincipal == "Selecionar um comercial"){
			 document.getElementById("op3_menu_highlight").style.backgroundImage= "url(none)";
			 document.getElementById("op4_menu_highlight").style.backgroundImage= "url(app/images/listbox/selector.png)";
			 acaoPrincipal = "Selecionar snapshots";
		}else{
			document.getElementById("op4_menu_highlight").style.backgroundImage= "url(none)";
			document.getElementById("op1_menu_highlight").style.backgroundImage= "url(app/images/listbox/selector.png)";
			acaoPrincipal = "Programar Acoes InicioComercial";
		}
		alert("Down List");
		break;

	case tvKey.KEY_ENTER: 
	
		/*
		var idAuxiliar = listOfIds[Display.getId()- 1];
		alert("Id selecionado e " + idAuxiliar);
		if(idAuxiliar != null && idAuxiliar != ""){
		idCanal = idAuxiliar;
		detalhes = true;
		acao = acoes[0];
		inicio_comercial();
		}*/
		alert("AÇÃO ESCOLHIDA É : "+acaoInicio);
		if(acaoPrincipal == "Programar Acoes InicioComercial"){
				document.getElementById("help_navi2").style.display="none";
				document.getElementById("UIPopupDiv").style.display="none";
				//Limpando os HIGHTLIGHTS...
				 document.getElementById("op1_menu_highlight").style.backgroundImage= "url(none)";
				 document.getElementById("op2_menu_highlight").style.backgroundImage= "url(none)";
				 document.getElementById("op3_menu_highlight").style.backgroundImage= "url(none)";
				 document.getElementById("op4_menu_highlight").style.backgroundImage= "url(none)";
				 document.getElementById("op5_menu_highlight").style.backgroundImage= "url(none)";
				
				 document.getElementById("op1_menu_highlight").innerHTML="Mudanca de canal";
				 document.getElementById("op1_menu_highlight").style.backgroundImage= "url(app/images/listbox/selector.png)";
				 document.getElementById("op2_menu_highlight").innerHTML="Mute";
				 document.getElementById("op3_menu_highlight").innerHTML="Playback Video";
				 document.getElementById("op4_menu_highlight").innerHTML="Exibir foto do mobile";
				 document.getElementById("op5_menu_highlight").innerHTML="Fazer nada";
				 document.getElementById("menu_highlight").style.display="block";
				 
				 acaoInicio = "Mudanca de canal";
				 Main.keyDownInicioComercialFocus();
		}else if(acaoPrincipal == "Programar Acoes FimComercial"){
			document.getElementById("help_navi2").style.display="none";
			document.getElementById("UIPopupDiv").style.display="none";
			
			//Limpando os HIGHTLIGHTS...
			 document.getElementById("op1_menu_highlight").style.backgroundImage= "url(none)";
			 document.getElementById("op2_menu_highlight").style.backgroundImage= "url(none)";
			 document.getElementById("op3_menu_highlight").style.backgroundImage= "url(none)";
			 document.getElementById("op4_menu_highlight").style.backgroundImage= "url(none)";
			 document.getElementById("op5_menu_highlight").style.backgroundImage= "url(none)";
			 
			 document.getElementById("op1_menu_highlight").innerHTML="Voltar ao canal do registro";
			 document.getElementById("op1_menu_highlight").style.backgroundImage= "url(app/images/listbox/selector.png)";
			 document.getElementById("op2_menu_highlight").style.backgroundImage= "url(none)";
			 document.getElementById("op2_menu_highlight").innerHTML="Continuar no mesmo canal";
			 document.getElementById("op3_menu_highlight").innerHTML="";
			 document.getElementById("op4_menu_highlight").innerHTML="";
			 document.getElementById("op5_menu_highlight").innerHTML="";
			 
			 acaoFim = "Voltar ao canal do registro";
			 document.getElementById("menu_highlight").style.display="block";
			 Main.keyDownFimComercialFocus();
		}else {
			
		}
		break;
		
		case tvKey.KEY_YELLOW:
		
		break;
		
	case tvKey.KEY_RETURN:
		widgetAPI.blockNavigation(event);
		document.getElementById("menu_highlight").style.display="none";
		Main.enableKeys();
		
		break;
		
	
	default :
		break;
}
};

//Enable Início comercial Keys
Main.keyDownInicioComercial = function()
{
	var keyCode = event.keyCode;

	switch(keyCode) {
	
	case tvKey.KEY_LEFT: 
		
		break;
		
	case tvKey.KEY_RIGHT: 
		
		break;
		
	case tvKey.KEY_UP: 
		if(acaoInicio == "Mudanca de canal"){
			 document.getElementById("op1_menu_highlight").style.backgroundImage= "url(none)";
			 document.getElementById("op5_menu_highlight").style.backgroundImage= "url(app/images/listbox/selector.png)";	 
			 acaoInicio = "Fazer nada";
		}else if(acaoInicio == "Mute"){
			 document.getElementById("op2_menu_highlight").style.backgroundImage= "url(none)";
			 document.getElementById("op1_menu_highlight").style.backgroundImage= "url(app/images/listbox/selector.png)";
			 acaoInicio = "Mudanca de canal";
		}else if(acaoInicio == "Playback Video"){
			 document.getElementById("op3_menu_highlight").style.backgroundImage= "url(none)";
			 document.getElementById("op2_menu_highlight").style.backgroundImage= "url(app/images/listbox/selector.png)";
			 acaoInicio = "Mute";
		}else if(acaoInicio == "Exibir foto do mobile"){
			 document.getElementById("op4_menu_highlight").style.backgroundImage= "url(none)";
			 document.getElementById("op3_menu_highlight").style.backgroundImage= "url(app/images/listbox/selector.png)";
			 acaoInicio = "Playback Video";
		}else{
			document.getElementById("op5_menu_highlight").style.backgroundImage= "url(none)";
			document.getElementById("op4_menu_highlight").style.backgroundImage= "url(app/images/listbox/selector.png)";
			acaoInicio = "Exibir foto do mobile";
		}
		
		alert("Up List");
		break;
		
	case tvKey.KEY_DOWN: 
		
		if(acaoInicio == "Mudanca de canal"){
			 document.getElementById("op1_menu_highlight").style.backgroundImage= "url(none)";
			 document.getElementById("op2_menu_highlight").style.backgroundImage= "url(app/images/listbox/selector.png)";	 
			 acaoInicio = "Mute";
		}else if(acaoInicio == "Mute"){
			 document.getElementById("op2_menu_highlight").style.backgroundImage= "url(none)";
			 document.getElementById("op3_menu_highlight").style.backgroundImage= "url(app/images/listbox/selector.png)";
			 acaoInicio = "Playback Video";
		}else if(acaoInicio == "Playback Video"){
			 document.getElementById("op3_menu_highlight").style.backgroundImage= "url(none)";
			 document.getElementById("op4_menu_highlight").style.backgroundImage= "url(app/images/listbox/selector.png)";
			 acaoInicio = "Exibir foto do mobile";
		}else if(acaoInicio == "Exibir foto do mobile"){
			 document.getElementById("op4_menu_highlight").style.backgroundImage= "url(none)";
			 document.getElementById("op5_menu_highlight").style.backgroundImage= "url(app/images/listbox/selector.png)";
			 acaoInicio = "Fazer nada";
		}else{
			document.getElementById("op5_menu_highlight").style.backgroundImage= "url(none)";
			document.getElementById("op1_menu_highlight").style.backgroundImage= "url(app/images/listbox/selector.png)";
			acaoInicio = "Mudanca de canal";
		}
		alert("Down List");
		break;

	case tvKey.KEY_ENTER: 
	
		/*
		var idAuxiliar = listOfIds[Display.getId()- 1];
		alert("Id selecionado e " + idAuxiliar);
		if(idAuxiliar != null && idAuxiliar != ""){
		idCanal = idAuxiliar;
		detalhes = true;
		acao = acoes[0];
		inicio_comercial();
		}*/
		alert("AÇÃO ESCOLHIDA É : "+acaoInicio);
		if(acaoInicio == "Mudanca de canal"){
			sync.list(success, error);
		}else if(acaoInicio == "Playback Video"){
			//var idAuxiliar = listOfIds[Display.getId()- 1];
			var idAuxiliar = "4f1476440cf21b20d62b0149";
			alert("Id selecionado e " + idAuxiliar);
			if(idAuxiliar != null && idAuxiliar != ""){
			idCanal = idAuxiliar;
			detalhes = false;
			acao = acaoInicio;
			inicio_comercial(callbackVideo);
			sync.subscribe(idAuxiliar, success_subscribe, error_subscribe);
			document.getElementById('menu_highlight').style.display="none";
			document.getElementById("help_navi2").style.display="block";
			Main.enableKeys();
			}
		}else if(acaoInicio == "Exibir foto do mobile"){
			//var idAuxiliar = listOfIds[Display.getId()- 1];
			var idAuxiliar = "4f1476440cf21b20d62b0149";
			alert("Id selecionado e " + idAuxiliar);
			if(idAuxiliar != null && idAuxiliar != ""){
			idCanal = idAuxiliar;
			detalhes = false;
			acao = acaoInicio;
			function callbackFoto(){
				communication = Communication.getServiceCommunication();
				communication.sendMessage({"message":"Hello I am from smart tv device, now you can upload your image file!!"}); //JSON Message
			}
			inicio_comercial(callbackFoto);
			sync.subscribe(idAuxiliar, success_subscribe, error_subscribe);
			document.getElementById('menu_highlight').style.display="none";
			document.getElementById("help_navi2").style.display="block";
			Main.enableKeys();
			}
		}
		break;
		
		case tvKey.KEY_YELLOW:
		
		break;
		
	case tvKey.KEY_RETURN:
		
		break;
		
	
	default :
		break;
}
};
//Enable Fim comercial Keys
Main.keyDownFimComercial = function()
{
	var keyCode = event.keyCode;

	switch(keyCode) {
	
	case tvKey.KEY_LEFT: 
		
		break;
		
	case tvKey.KEY_RIGHT: 
		
		break;
		
	case tvKey.KEY_UP: 
		if(acaoFim == "Voltar ao canal do registro"){
			 document.getElementById("op1_menu_highlight").style.backgroundImage= "url(none)";
			 document.getElementById("op2_menu_highlight").style.backgroundImage= "url(app/images/listbox/selector.png)";	 
			 acaoFim = "Continuar no mesmo canal";
		}else{
			 document.getElementById("op2_menu_highlight").style.backgroundImage= "url(none)";
			 document.getElementById("op1_menu_highlight").style.backgroundImage= "url(app/images/listbox/selector.png)";
			 acaoFim = "Voltar ao canal do registro";
		}
		alert("Up List");
		break;
		
	case tvKey.KEY_DOWN: 
		if(acaoFim == "Voltar ao canal do registro"){
			 document.getElementById("op1_menu_highlight").style.backgroundImage= "url(none)";
			 document.getElementById("op2_menu_highlight").style.backgroundImage= "url(app/images/listbox/selector.png)";	 
			 acaoFim = "Continuar no mesmo canal";
		}else{
			 document.getElementById("op2_menu_highlight").style.backgroundImage= "url(none)";
			 document.getElementById("op1_menu_highlight").style.backgroundImage= "url(app/images/listbox/selector.png)";
			 acaoFim = "Voltar ao canal do registro";
		}
		alert("Down List");
		break;
	
	case tvKey.KEY_ENTER: 
	

		alert("AÇÃO ESCOLHIDA É : "+acaoFim);
		if(acaoFim == "Voltar ao canal do registro"){
			//var idAuxiliar = listOfIds[Display.getId()- 1];
			Channelid.init();
			idCanal = Channelid.getChannelid();
			detalhes = false;
			acao = acaoFim;
			function callbackFim(){
				
				if(acaoInicio =="Exibir foto do mobile"){
				communication = Communication.getServiceCommunication();
				communication.sendMessage({"message":"Hello I am from smart tv device, ready to disable the upload buttom!!"}); //JSON Message
				document.getElementById('insert-images').style.display="none";
				}else if(acaoInicio =="Playback Video"){
				document.getElementById('principal').style.display="none";	
				}else{
					
				}
				TVMWPlugin.SetSource(tvSourceOrg);
				channelchangeFromTo = Tvcontrol.getChannelChange();
				channelchangeFromTo.changingchannel();
				document.getElementById("help_navi2").style.display="block";
				Main.enableKeys();
			}
			fim_comercial(callbackFim);
			document.getElementById('menu_highlight').style.display="none";
			document.getElementById("help_navi2").style.display="block";
			Main.enableKeys();
		}else{
			
		}
		break;
		
		case tvKey.KEY_YELLOW:
		
		break;
		
	case tvKey.KEY_RETURN:
	
		
		break;
		
	
	default :
		break;
}
};

//Key Handler List
Main.keyDownListCanais = function()
{
	var keyCode = event.keyCode;

	switch(keyCode) {
		
		case tvKey.KEY_LEFT: 
			
			break;
			
		case tvKey.KEY_RIGHT: 
			
			break;
			
		case tvKey.KEY_UP: 
			this.selectPreviousTitle_List(this.UP);
			alert("Up List");
			break;
			
		case tvKey.KEY_DOWN: 
			this.selectNextTitle_List(this.DOWN);
			alert("Down List");
			break;
		
		case tvKey.KEY_ENTER: 
		
			//idCanal = "12345";
			/*
			var idAuxiliar = listOfIds[Display.getId()- 1];
			alert("Id selecionado e " + idAuxiliar);
			if(idAuxiliar != null && idAuxiliar != ""){
			idCanal = idAuxiliar;
			detalhes = true;
			acao = acoes[0];
			inicio_comercial();
			}
			*/
			break;
			
			case tvKey.KEY_YELLOW:
			
			break;
			
		case tvKey.KEY_RETURN:
			widgetAPI.blockNavigation(event);
			Display.hide("leftHalf_List");
			Main.keyDownInicioComercialFocus();
			break;
			
		
		default :
			break;
	}
};

//Lista HighLight...

Main.onshow = function(){		 // register the onshow event callback

	var PLUGIN = document.getElementById("plugin");
	
	if(PLUGIN)
     {
        alert("PLUGIN Succeed");
        PLUGIN.Execute("RegisterNumberKey");
     }
	 else{
		alert("PLUGIN Failed");
	 }
	
};
Main.selectNextTitle = function(down)
{
	this.selectedVideo = (this.selectedVideo + 1) % Data_getVideoCount();
	this.updateCurrentTitle(down);
};

Main.selectPreviousTitle = function(up)
{
	if (--this.selectedVideo < 0)
	{
		this.selectedVideo += Data_getVideoCount();
	}
	this.updateCurrentTitle(up);
}

Main.updateCurrentTitle = function(move){

	Display.setVideoListPosition(this.selectedVideo, move);
	Display.setDescription( Data_getVideoDescription(this.selectedVideo));
}

//PARA MENU BOOKMARKED, CANAIS MONITORADOS...

 var getMenuCount = function(){

	return this.count;

}

Main.selectNextTitle_List = function(down)
{
	this.selectedVideo = (this.selectedVideo + 1) % getMenuCount();
	this.updateCurrentTitle_List(down);
}

Main.selectNextTitle_BookMarked = function(down)
{
	this.selectedVideo = (this.selectedVideo + 1) % getMenuCount();
	this.updateCurrentTitle_BookMarked (down);
}

Main.selectPreviousTitle_List = function(up)
{
	if (--this.selectedVideo < 0)
	{
		this.selectedVideo += getMenuCount();
	}
	this.updateCurrentTitle_List(up);
}

Main.selectPreviousTitle_BookMarked = function(up)
{
	if (--this.selectedVideo < 0)
	{
		this.selectedVideo += getMenuCount();
	}
	this.updateCurrentTitle_BookMarked (up);
}

Main.updateCurrentTitle_List = function(move){

	Display.setVideoListPosition_List(this.selectedVideo, move);
	//Display.setDescription_List(getVideoDescription_List(this.selectedVideo));
}


Main.updateCurrentTitle_BookMarked = function(move){

	Display.setVideoListPosition_BookMarked(this.selectedVideo, move);
	//Display.setDescription( Data_getVideoDescription(this.selectedVideo));
}

/* CODIGO PARA PLAYBACK DE VÍDEOS*/
Main.InitVideoApp = function()
{
	if( Player.init() && Audio.init() && VDisplay.init() && Server_init()){
	
		VDisplay.setVolume( Audio.getVolume() );
		//The position of the time bar should begin at the left...
		VDisplay.setTime(0);
		
		Player.stopCallback = function()
		{
			/* Return to windowed mode when video is stopped(by choice or when it reaches the end) */
			Main.setWindowMode();
		}
		//Start retrieving data from server...
		Server_dataReceivedCallback = function(){
		
			/*Use video information when it has arrived*/
			VDisplay.setVideoList( Data_getVideoNames() );
			Main.updateCurrentVideo();
		}
		
		Server_fetchVideoList(); /*Request video information from server*/
		
		TVMWPlugin = document.getElementById('pluginTVMW');
		tvSourceOrg = TVMWPlugin.GetSource();
		TVMWPlugin.SetMediaSource();
		
		// To enable the key event processing
		Main.enableKeysVideo();
		
		}
		else{
	
		alert("Failed to initialise");
	}

}
Main.setFullScreenMode = function()
{
	if (this.mode != this.FULLSCREEN)
	{
		VDisplay.hide();
		Player.setFullscreen();
		this.mode = this.FULLSCREEN;
	}
}

Main.setWindowMode = function()
{
	if (this.mode != this.WINDOW)
	{
		VDisplay.show();
		Player.setWindow();
		this.mode = this.WINDOW;
	}
}

Main.toggleMode = function()
{
	switch (this.mode)
	{
		case this.WINDOW:
			 this.setFullScreenMode();
			 break;
			 
		case this.FULLSCREEN:
			 this.setWindowMode();
			 break;
			 
		default:
			 alert("ERROR: unexpected mode in toggleMode");
			 break;
	}
}

Main.updateCurrentVideo = function(move){

	//Player.setVideoURL(Data_getVideoUrl(3));
	Player.setVideoURL( Data_getVideoUrl(this.selectedVideo) );
	VDisplay.setVideoListPosition(this.selectedVideo, move);
	VDisplay.setDescription( Data_getVideoDescription(this.selectedVideo));
}

Main.handlePlayKey = function(){

	switch(Player.getState())
	{
		case Player.STOPPED :
			 Player.playVideo();
			 break;
			
		case Player.PAUSED :
			 Player.resumeVideo();
			 break;
			 
		default :
			alert("Ignoring play key, not in correct state");
			break;
	}
	
}

Main.handlePauseKey = function(){

	switch(Player.getState())
	{
		case Player.PLAYING :
			 Player.pauseVideo();
			 break;
			
		case Player.PAUSED :
			 Player.resumeVideo();
			 break;
			 
		default :
			alert("Ignoring pause key, not in correct state");
			break;
	}
	
}

Main.keyDownVideo = function()
{
	var keyCode = event.keyCode;
    alert("Main Key code : " + keyCode);

	switch(keyCode)
	{
		
		case tvKey.KEY_PLAY :  //tvKey.KEY_PLAY
			alert("PLAY");
			this.handlePlayKey();
			break;
		
		case tvKey.KEY_YELLOW :  //tvKey.KEY_PLAY
			alert("PLAY");
			this.handlePlayKey();
			break;
			
		case tvKey.KEY_STOP :
			alert("STOP");
			Player.stopVideo();
			break;
		
		case tvKey.KEY_PAUSE :
			alert("PAUSE");
			this.handlePauseKey();
			break;
			
		case tvKey.KEY_FF:
			alert("FF");
			Player.skipForwardVideo();
			break;
			
		case tvKey.KEY_RW:
			alert("RW");
			Player.skipBackwardVideo();
			break;
			
		case tvKey.KEY_VOL_UP:
		case tvKey.KEY_PANEL_VOL_UP:
			 alert("VOL_UP");
			 if(this.mute == 0)
			 Audio.setRelativeVolume(0);
			 break;
			 
		case tvKey.KEY_VOL_DOWN:
		case tvKey.KEY_PANEL_VOL_DOWN:
			 alert("VOL_DOWN");
			if(this.mute == 0)
			Audio.setRelativeVolume(1);
			break;
			
		case tvKey.KEY_MUTE:
			alert("MUTE");
			this.muteMode();
			break;
			
		case tvKey.KEY_DOWN:
			 alert("DOWN");
			 this.selectNextVideo(this.DOWN);
			 break;
			
		case tvKey.KEY_UP:
			 alert("UP");
			 this.selectPreviousVideo(this.UP);
			 break
		
		case tvKey.KEY_ENTER:
		case tvKey.KEY_PANEL_ENTER:
			 alert("ENTER");
			 this.toggleMode();
			 break;
			 
		default :
			alert("Unhandled key");
			break;
	}
}


Main.setMuteMode = function()
{
	/*if (this.mute != this.YMUTE)
	{
		Audio.plugin.SetSystemMute(true);
		this.mute = this.YMUTE;
	}*/
	
	if (this.mute != this.YMUTE)
	{
		var volumeElement = document.getElementById("volumeInfo");
		Audio.plugin.SetSystemMute(true);
		document.getElementById("volumeIcon").style.backgroundImage = "url(resource/images/mute.png)";
		document.getElementById("volumeBar").style.backgroundImage = "url(resource/images/muteBar.png)";
		
		widgetAPI.putInnerHTML(volumeElement, "MUTE");
		this.mute = this.YMUTE;
	}
}

Main.noMuteMode = function()
{
	/*if (this.mute != this.NMUTE)
	{
		Audio.plugin.SetSystemMute(false);
		this.mute = this.NMUTE;
	}*/
	
	if (this.mute != this.NMUTE)
	{
		Audio.plugin.SetSystemMute(false);
		document.getElementById("volumeBar").style.backgroundImage = "url(resource/images/volumeBar.png)";
		document.getElementById("volumeIcon").style.backgroundImage = "url(resource/images/volume.png)";

		VDisplay.setVolume( Audio.getVolume() );
		this.mute = this.NMUTE;
	}
	
}

Main.muteMode = function()
{
switch (this.mute)
{
	case this.NMUTE:
		 this.setMuteMode();
		 break;
		 
	case this.YMUTE:
		 this.noMuteMode();
		 break;
		 
	default:
		 alert("ERROR: unexpected mode in muteMode");
		 break;
	}
}

Main.selectNextVideo = function(down)
{
	Player.stopVideo();
	this.selectedVideo = (this.selectedVideo + 1) % Data_getVideoCount();
	this.updateCurrentVideo(down);
}

Main.selectPreviousVideo = function(up)
{
	Player.stopVideo();
	if (--this.selectedVideo < 0)
	{
		this.selectedVideo += Data_getVideoCount();
	}
	this.updateCurrentVideo(up);
}



var Display =
{
	telaAnterior : "",
	telaAtual : "",
	videoList : new Array(), //videoList: []
	videoImg : new Array(),
	videoTitulos : new Array(),
	
	videoList_BookMarked : new Array(), //videoList: []
	videoImg_BookMarked : new Array(),
	videoTitulos_BookMarked : new Array(),
	
	videoList_List : new Array(), //videoList: []
	videoImg_List : new Array(),
	videoTitulos_List : new Array(),
	
	statusDiv : null,
	FIRSTIDX : 0,
    LASTIDX : 4,
    currentWindow : 0,

    selector : 0,
    LIST : 1,
	SCROLLBAR_SIZE : 17,
	scrollTop : 140,
	scrollHeight : 312,
	offsetHeight: 244,
    indice : 1,
	controllerIndice : 0,
	vetorScroll : new Array()
}

var opcao = null;
var idList = 1;
//var videoNames_List = [];
var idListBookmarked = 1;

Display.setValores_List = function(){
	this.FIRSTIDX = 0;
    this.LASTIDX = 4;
    this.currentWindow = 0;
    this.selector = 0;
    this.LIST = 1;
}

Display.setValores_MenuBookmarked = function(){
	this.FIRSTIDX = 0;
    this.LASTIDX = 4;
    this.currentWindow = 0;
    this.selector = 0;
    this.LIST = 1;
}

Display.adjustScrollBar = function(opcao) {
    
	if(opcao == "left"){
	
    if (this.scrollHeight <= this.offsetHeight) {
        //this.hideScrollBar();
		
    }
    else {
        var position = parseInt((this.scrollTop)/(this.scrollHeight-this.offsetHeight) * this.SCROLLBAR_SIZE);
	
		position = position * this.indice;
		if(position > this.offsetHeight){
		   position = 227;
		   document.getElementById("UIContentsScrollBead").style.top = position + "px";
		}
		else{
		
		this.vetorScroll[this.indice] = position;
		this.indice = this.indice + 1;
        document.getElementById("UIContentsScrollBead").style.top = position + "px";
		
		}
        //this.showScrollBar();
		alert("SCROLLBEAD TOP : " + position);
    }
	
	}
	else if(opcao == "right"){
	
	var position;
	
	if(this.indice > 0){
		
		if(this.indice != 1){
		    this.indice = this.indice - 1;
			position = this.vetorScroll[this.indice];
			alert("SCROLLBEAD TOP RETOUR: " + position);
			document.getElementById("UIContentsScrollBead").style.top = position + "px";
		}
		else{
		
		this.controllerIndice = 1;
		position = 0;
		alert("SCROLLBEAD TOP RETOUR: " + position);
		document.getElementById("UIContentsScrollBead").style.top = position + "px";
		}
	}
	
	}
	else
	{}

}

Display.setList = function(){

	var list1 = "";
	var frase = "";
	for (var i=0; i<8; i++)
    {
        list1 = document.getElementById("titulo"+i);
        frase = "titulo"+i ;
        widgetAPI.putInnerHTML(list1, frase);
	}
}

Display.setImagensTitulos = function(id){

	document.getElementById(id).style.backgroundImage= "url(resource/images/azul1.png)";
}

Display.setCurrentWindow = function(valor){

	this.currentWindow = 0;
}

Display.getVideoList = function(){

	return this.videoList;
}


Display.getVideoList_List = function(){

	return this.videoList_List;
}

Display.getVideoList_BookMarked = function(){

	return this.videoList_BookMarked;
}


Display.setVideoList = function(nameList)
{
    var listHTML = "";
	var listIMG = "";
	var text = "";
    var i=0;
	var j=0;
    for (var name in nameList)
    {
        this.videoTitulos[i] = document.getElementById("titulo"+i);
		this.videoList[i] = document.getElementById("video"+i);
		this.videoImg[i] = document.getElementById("img"+i);
		this.videoImg[i].style.backgroundImage= "url(resource/images/verde1.png)";
		j = i%5;
		
		/*
		if(i<5){
		this.videoImg[i] = document.getElementById("img"+i);
		this.videoImg[i].style.backgroundImage= "url(resource/images/verde1.png)";
		}
		else{
		
		this.videoImg[j] = document.getElementById("img"+j);
		this.videoImg[j].style.backgroundImage= "url(resource/images/verde1.png)";
		alert("indice" + j);
		}
		
		*/
        listHTML = nameList[name] ;
		listImg = "url(resource/images/verde1.png)";
        widgetAPI.putInnerHTML(this.videoTitulos[i], listHTML);
		
        i++;
    }
	this.videoList[this.FIRSTIDX].style.backgroundImage= "url(app/images/listbox/selector.png)";
	Display.setDescription( Data_getVideoDescription(0));
	
    if(i>5)
    {
        document.getElementById("next").style.opacity = '1.0';
        document.getElementById("previous").style.opacity = '1.0';
    }
    listHTML = "1 / " + i;
    widgetAPI.putInnerHTML(document.getElementById("videoCount"), listHTML);
}

Display.setVideoListPosition = function(position, move)
{    
    var listHTML = "";
    listHTML = (position + 1) + " / " + Data_getVideoCount();
    widgetAPI.putInnerHTML(document.getElementById("videoCount"), listHTML);
   if(Data_getVideoCount() <= 10)
    {alert("ENTREI AQUI1");
        for (var i = 0; i < Data_getVideoCount(); i++)
        {
            if(i == position)
                this.videoList[i].style.backgroundImage= "url(app/images/listbox/selector.png)";
            else
                this.videoList[i].style.backgroundImage= "url(none)";
        }
    }
    else if((this.currentWindow!=this.LASTIDX && move==Main.DOWN) || (this.currentWindow!=this.FIRSTIDX && move==Main.UP))
    {alert("ENTREI AQUI2"+this.currentWindow);
        if(move == Main.DOWN)
            this.currentWindow ++;
        else
            this.currentWindow --;
            
			
        for (var i = 0; i <= this.LASTIDX; i++)
        {
			//MODIFICADO...
			
			
            if(i == this.currentWindow)
                this.videoList[i].style.backgroundImage= "url(app/images/listbox/selector.png)";
				
            else
                this.videoList[i].style.backgroundImage= "url(none)";
		
		}
    }
    else if(this.currentWindow == this.LASTIDX && move == Main.DOWN)
    {
		alert("ENTREI AQUI3"+this.currentWindow);
        if(position == this.FIRSTIDX)
        {
            this.currentWindow = this.FIRSTIDX;
            
            for(i = 0; i <= this.LASTIDX; i++)
            {
                listHTML = videoNames[i] ;
				
                widgetAPI.putInnerHTML(this.videoList[i], listHTML);
				
				//MODIFICADO...
				
				//Display.hide(this.videoImg[i]);
				//this.videoImg[i] = document.addElementById("img"+i);
				//this.videoImg[i%5] = document.getElementById("img"+(i%5));
				//this.videoImg[i%5].style.backgroundImage= "url(resource/images/verde1.png)";
                
                if(i == this.currentWindow)
                    this.videoList[i].style.backgroundImage= "url(app/images/listbox/selector.png)";
					
                else
                    this.videoList[i].style.backgroundImage= "url(none)";
            }
        }
        else
        {            
            for(i = 0; i <= this.LASTIDX; i++)
            {
                listHTML = videoNames[i + position - this.currentWindow] ;
				
                widgetAPI.putInnerHTML(this.videoList[i], listHTML);
				//MODIFICADO...
				
				//Display.hide(this.videoImg[i]);
				//this.videoImg[i].style.backgroundImage= "url(resource/images/verde1.png)";
            }
        }
    }
    else if(this.currentWindow == this.FIRSTIDX && move == Main.UP)
    {alert("ENTREI AQUI4"+this.currentWindow);
        if(position == Data_getVideoCount()-1)
        {
            this.currentWindow = this.LASTIDX;
            
            for(i = 0; i <= this.LASTIDX; i++)
            {
                listHTML = videoNames[i + position - this.currentWindow] ;
				
                widgetAPI.putInnerHTML(this.videoList[i], listHTML);
				
                //MODIFICADO...
				//Display.hide(this.videoImg[i]);
				//this.videoImg[i].style.backgroundImage= "url(resource/images/verde1.png)";
                if(i == this.currentWindow)
                    this.videoList[i].style.backgroundImage= "url(app/images/listbox/selector.png)";
                else
                    this.videoList[i].style.backgroundImage= "url(none)";
            }
        }
        else
        {            
            for(i = 0; i <= this.LASTIDX; i++)
            {
                listHTML = videoNames[i + position] ;
				
                widgetAPI.putInnerHTML(this.videoList[i], listHTML);
				//MODIFICADO...
				
				//Display.hide(this.videoImg[i]);
				//this.videoImg[i].style.backgroundImage= "url(resource/images/verde1.png)";
            }
        }
    }
}

//PARA MENU BOOKMARKED, CANAIS MONITORDOS...


Display.setVideoList_List = function(nameList)
{

	//videoNames_List = nameList;
    var listHTML = "";
    
    var i=0;
    for (var name in nameList)
    {
        this.videoList_List[i] = document.getElementById("video"+i+"_List");
        listHTML = nameList[name] ;
        widgetAPI.putInnerHTML(this.videoList_List[i], listHTML);
        i++;
    }
    this.videoList_List[this.FIRSTIDX].style.backgroundImage= "url(app/images/listbox/selector.png)";
	alert("valor dele"+this.FIRSTIDX);
    if(i>5)
    {
        document.getElementById("next_List").style.opacity = '1.0';
        document.getElementById("previous_List").style.opacity = '1.0';
    }
    listHTML = "1 / " + i;
    widgetAPI.putInnerHTML(document.getElementById("videoCount_List"), listHTML);
	//Display.setDescription_List(getVideoDescription_List(0));
}


/*
Display.setVideoList_List = function(nameList)
{
    var listHTML = "";
	var listIMG = "";
	var text = "";
    var i=0;
	var j=0;
	
    for (var name in nameList)
    {
        //this.videoTitulos_List[i] = document.getElementById("titulo"+i+"_BookMarked");
		this.videoList_List[i] = document.getElementById("video"+i+"_BookMarked");
		//this.videoImg_List[i] = document.getElementById("img"+i+"_BookMarked");
		//this.videoImg[i].style.backgroundImage= "url(resource/images/verde1.png)";
		j = i%5;
		
        listHTML = nameList[name] ;
        widgetAPI.putInnerHTML(this.videoTitulos_List[i], listHTML);
		
        i++;
    }
	this.videoList_List[this.FIRSTIDX].style.backgroundImage= "url(resource/images/selectorBkm.png)";
	//Display.setDescription( Data_getVideoDescription(0));
	
	
    if(i>5)
    {
        document.getElementById("next").style.opacity = '1.0';
        document.getElementById("previous").style.opacity = '1.0';
    }
	
    listHTML = "1 / " + i;
    widgetAPI.putInnerHTML(document.getElementById("videoCount_BookMarked"), listHTML);
}

*/

Display.setVideoList_BookMarked = function(nameList)
{
    var listHTML = "";
	var listIMG = "";
	var text = "";
    var i=0;
	var j=0;
	
    for (var name in nameList)
    {
        this.videoTitulos_BookMarked[i] = document.getElementById("titulo"+i+"_BookMarked");
		this.videoList_BookMarked[i] = document.getElementById("video"+i+"_BookMarked");
		this.videoImg_BookMarked[i] = document.getElementById("img"+i+"_BookMarked");
		
		//this.videoImg[i].style.backgroundImage= "url(resource/images/verde1.png)";
		j = i%5;
		
        listHTML = nameList[name] ;
        widgetAPI.putInnerHTML(this.videoTitulos_BookMarked[i], listHTML);
		
        i++;
    }
	this.videoList_BookMarked[this.FIRSTIDX].style.backgroundImage= "url(resource/images/selectorBkm.png)";
	//Display.setDescription( Data_getVideoDescription(0));
	
	
    if(i>5)
    {
		
        document.getElementById("next_BookMarked").style.opacity = '1.0';
        document.getElementById("previous_BookMarked").style.opacity = '1.0';
    }
	
    listHTML = "1 / " + i;
    widgetAPI.putInnerHTML(document.getElementById("videoCount_BookMarked"), listHTML);
}

Display.getId = function(){

	return idList;
}

Display.getIdBookmarked = function(){

	return idListBookmarked;
}

Display.setVideoListPosition_List = function(position, move)
{    
	alert("idList:"+idList);
	idList = position + 1;
    var listHTML = "";
    listHTML = (position + 1) + " / " + getMenuCount();
    widgetAPI.putInnerHTML(document.getElementById("videoCount_List"), listHTML);
   if(getMenuCount() < 5)
    {alert("ENTREI AQUI1");
        for (var i = 0; i < getMenuCount(); i++)
        {
            if(i == position)
                this.videoList_List[i].style.backgroundImage= "url(app/images/listbox/selector.png)";
            else
                this.videoList_List[i].style.backgroundImage= "url(none)";
        }
    }
    else if((this.currentWindow!=this.LASTIDX && move==Main.DOWN) || (this.currentWindow!=this.FIRSTIDX && move==Main.UP))
    {alert("ENTREI AQUI2"+this.currentWindow);
        if(move == Main.DOWN)
            this.currentWindow ++;
        else
            this.currentWindow --;
            
			
        for (var i = 0; i <= this.LASTIDX; i++)
        {
			//MODIFICADO...
			
			
            if(i == this.currentWindow)
                this.videoList_List[i].style.backgroundImage= "url(app/images/listbox/selector.png)";
				
            else
                this.videoList_List[i].style.backgroundImage= "url(none)";
		
		}
    }
    else if(this.currentWindow == this.LASTIDX && move == Main.DOWN)
    {
		alert("ENTREI AQUI3"+this.currentWindow);
        if(position == this.FIRSTIDX)
        {
            this.currentWindow = this.FIRSTIDX;
            
            for(i = 0; i <= this.LASTIDX; i++)
            {
                listHTML = videoNames_List[i] ;
				
                widgetAPI.putInnerHTML(this.videoList_List[i], listHTML);
				
				//MODIFICADO...
				
				//Display.hide(this.videoImg[i]);
				//this.videoImg[i] = document.addElementById("img"+i);
				//this.videoImg[i%5] = document.getElementById("img"+(i%5));
				//this.videoImg[i%5].style.backgroundImage= "url(resource/images/verde1.png)";
                
                if(i == this.currentWindow)
                    this.videoList_List[i].style.backgroundImage= "url(app/images/listbox/selector.png)";
					
                else
                    this.videoList_List[i].style.backgroundImage= "url(none)";
            }
        }
        else
        {            
            for(i = 0; i <= this.LASTIDX; i++)
            {
                listHTML = videoNames_List[i + position - this.currentWindow] ;
				
                widgetAPI.putInnerHTML(this.videoList_List[i], listHTML);
				//MODIFICADO...
				
				//Display.hide(this.videoImg[i]);
				//this.videoImg[i].style.backgroundImage= "url(resource/images/verde1.png)";
            }
        }
    }
    else if(this.currentWindow == this.FIRSTIDX && move == Main.UP)
    {alert("ENTREI AQUI4"+this.currentWindow);
        if(position == getMenuCount()-1)
        {
            this.currentWindow = this.LASTIDX;
            
            for(i = 0; i <= this.LASTIDX; i++)
            {
                listHTML = videoNames_List[i + position - this.currentWindow] ;
				
                widgetAPI.putInnerHTML(this.videoList_List[i], listHTML);
				
                //MODIFICADO...
				//Display.hide(this.videoImg[i]);
				//this.videoImg[i].style.backgroundImage= "url(resource/images/verde1.png)";
                if(i == this.currentWindow)
                    this.videoList_List[i].style.backgroundImage= "url(app/images/listbox/selector.png)";
                else
                    this.videoList_List[i].style.backgroundImage= "url(none)";
            }
        }
        else
        {            
            for(i = 0; i <= this.LASTIDX; i++)
            {
                listHTML = videoNames_List[i + position] ;
				
                widgetAPI.putInnerHTML(this.videoList_List[i], listHTML);
				//MODIFICADO...
				
				//Display.hide(this.videoImg[i]);
				//this.videoImg[i].style.backgroundImage= "url(resource/images/verde1.png)";
            }
        }
    }
}


Display.setVideoListPosition_BookMarked = function(position, move)
{    

	alert("idListBookmarked:"+idListBookmarked);
	idListBookmarked = position + 1;
    var listHTML = "";
    listHTML = (position + 1) + " / " + getMenuCount();
    widgetAPI.putInnerHTML(document.getElementById("videoCount_BookMarked"), listHTML);
   if(getMenuCount() <= 10)
    {alert("ENTREI AQUI1");
        for (var i = 0; i < getMenuCount(); i++)
        {
            if(i == position)
                this.videoList_BookMarked[i].style.backgroundImage= "url(resource/images/selectorBkm.png)";
            else
                this.videoList_BookMarked[i].style.backgroundImage= "url(none)";
        }
    }
    else if((this.currentWindow!=this.LASTIDX && move==Main.DOWN) || (this.currentWindow!=this.FIRSTIDX && move==Main.UP))
    {alert("ENTREI AQUI2"+this.currentWindow);
        if(move == Main.DOWN)
            this.currentWindow ++;
        else
            this.currentWindow --;
            
			
        for (var i = 0; i <= this.LASTIDX; i++)
        {
			//MODIFICADO...
			
			
            if(i == this.currentWindow)
                this.videoList_BookMarked[i].style.backgroundImage= "url(resource/images/selectorBkm.png)";
				
            else
                this.videoList_BookMarked[i].style.backgroundImage= "url(none)";
		
		}
    }
    else if(this.currentWindow == this.LASTIDX && move == Main.DOWN)
    {
		alert("ENTREI AQUI3"+this.currentWindow);
        if(position == this.FIRSTIDX)
        {
            this.currentWindow = this.FIRSTIDX;
            
            for(i = 0; i <= this.LASTIDX; i++)
            {
                listHTML = videoNames[i] ;
				
                widgetAPI.putInnerHTML(this.videoList_BookMarked[i], listHTML);
				
				//MODIFICADO...
				
				//Display.hide(this.videoImg[i]);
				//this.videoImg[i] = document.addElementById("img"+i);
				//this.videoImg[i%5] = document.getElementById("img"+(i%5));
				//this.videoImg[i%5].style.backgroundImage= "url(resource/images/verde1.png)";
                
                if(i == this.currentWindow)
                    this.videoList_BookMarked[i].style.backgroundImage= "url(resource/images/selectorBkm.png)";
					
                else
                    this.videoList_BookMarked[i].style.backgroundImage= "url(none)";
            }
        }
        else
        {            
            for(i = 0; i <= this.LASTIDX; i++)
            {
                listHTML = videoNames_BookMarked[i + position - this.currentWindow] ;
				
                widgetAPI.putInnerHTML(this.videoList_BookMarked[i], listHTML);
				//MODIFICADO...
				
				//Display.hide(this.videoImg[i]);
				//this.videoImg[i].style.backgroundImage= "url(resource/images/verde1.png)";
            }
        }
    }
    else if(this.currentWindow == this.FIRSTIDX && move == Main.UP)
    {alert("ENTREI AQUI4"+this.currentWindow);
        if(position == getMenuCount()-1)
        {
            this.currentWindow = this.LASTIDX;
            
            for(i = 0; i <= this.LASTIDX; i++)
            {
                listHTML = videoNames_Bookmarked[i + position - this.currentWindow] ;
				
                widgetAPI.putInnerHTML(this.videoList_Bookmarked[i], listHTML);
				
                //MODIFICADO...
				//Display.hide(this.videoImg[i]);
				//this.videoImg[i].style.backgroundImage= "url(resource/images/verde1.png)";
                if(i == this.currentWindow)
                    this.videoList_Bookmarked[i].style.backgroundImage= "url(resource/images/selectorBkm.png)";
                else
                    this.videoList_Bookmarked[i].style.backgroundImage= "url(none)";
            }
        }
        else
        {            
            for(i = 0; i <= this.LASTIDX; i++)
            {
                listHTML = videoNames_Bookmarked[i + position] ;
				
                widgetAPI.putInnerHTML(this.videoList_Bookmarked[i], listHTML);
				//MODIFICADO...
				
				//Display.hide(this.videoImg[i]);
				//this.videoImg[i].style.backgroundImage= "url(resource/images/verde1.png)";
            }
        }
    }
}


Display.setDescription_List = function(output)
{
	var varElement = document.getElementById("videoBox_top_List");
	widgetAPI.putInnerHTML(varElement, output);
}

Display.setDescription = function(output)
{
	var varElement = document.getElementById("videoBox_top");
	widgetAPI.putInnerHTML(varElement, output);
}

Display.MostrarTela = function(){
	
	if(Display.getTelaAnterior() == "telaNavi"){
		
		Display.ApagarTela();
		Display.show("Tnavi");
		
	}
	else if(Display.getTelaAnterior() == "telaMais"){
	
		Display.ApagarTela();
		document.getElementById("TitlesList").style.backgroundImage= "url(resource/images/listBox.png)";
		Display.show("bg13Paint");
		document.getElementById("videoBox_top").style.backgroundImage= "url(resource/images/framePaintReady5.png)";
	
	}
	else if(Display.getTelaAnterior() == "telaApr"){
	
		Display.ApagarTela();
		document.getElementById("TitlesList").style.backgroundImage= "url(resource/images/listBox.png)";
		Display.show("bg13Paint");
		document.getElementById("videoBox_top").style.backgroundImage= "url(resource/images/framePaintReady5.png)";
	
	}
	else{
	
	}
}

Display.ApagarTela = function(){

	if(Display.getTelaAtual() == "telaNavi"){
	
		Display.hide("Tnavi");
	}
	else if(Display.getTelaAtual() == "telaMais"){
	
		Display.hide("leftHalf");
		Display.hide("Tnavi");
	}
	else if(Display.getTelaAtual() == "telaApr"){
	
		Display.hide("leftHalf");
		Display.hide("Tnavi");
	
	}
	else{
	
	}

}

Display.setTelaAnterior = function(tela){

	this.telaAnterior = tela;
}

Display.setTelaAtual = function(tela){

	this.telaAtual = tela;
}

Display.getTelaAnterior = function(){

	return this.telaAnterior;
}

Display.getTelaAtual = function(){

	return this.telaAtual;
}

Display.hide = function(id)
{
	document.getElementById(id).style.display="none";
}

Display.show = function(id)
{
	if(id != ""){
	
	document.getElementById(id).style.display="block";
	
	}

}


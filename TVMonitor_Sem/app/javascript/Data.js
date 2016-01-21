
var videoNames =[];
var	videoUrls =[];
var videoDescriptions =[];
	

var Data_setVideoNames = function(list){

	videoNames = list;
}

var Data_setVideoUrls = function(list){

	videoUrls = list;
}

var Data_setVideoDescriptions = function(list){

	videoDescriptions = list;
}

var Data_getVideoUrl = function(index){

	var url = videoUrls[index];
	
	if(url){  //Check for undefined entry (outside of valid array)
	
		return url;
	}
	else{
	
		return null;
	}
}

var Data_getVideoCount = function(){

	return videoUrls.length;

}

var Data_getVideoNames = function(){

	return videoNames;

}

var Data_getVideoDescription = function(index){

	var description = videoDescriptions[index];
	
	if(description){
	
		return description;
	}
	else{
	
		return "No description";
	}
}








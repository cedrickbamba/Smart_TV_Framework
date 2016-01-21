//Aux function
//Method to include js files dynamicaly
var include     = function( fullPath ){
    if( fullPath.indexOf(".") !== -1 ){
        
        var arrAux = fullPath.split(".");
        var scriptType = arrAux[ arrAux.length - 1 ];
        
        if( scriptType === "js" ){
            document.write( "\n<script type='text/javascript' src='"
            + fullPath
            +"' ></script>\n" );
        } else if( scriptType === "css" ){
            document.write( "\n<link rel='stylesheet' href='"
            + fullPath
            +"' />\n" );
        }
        
    }
};
//AMQ Message Handler
var amqMsgHandler = {
    rcvMessage: function( message ){
        var objReceived = ($.parseJSON( message.textContent )).result;
        
        //Load preferences
        var bBeep       = kaeptor.ls.select( kaeptor.config.USER_BEEP );
        var bVibrate    = kaeptor.ls.select( kaeptor.config.USER_VIBRATE );
        var iN10nTime   = kaeptor.ls.select( kaeptor.config.USER_N10NTIME );
        var iN10nRepeat = kaeptor.ls.select( kaeptor.config.USER_N10NREPEAT );
        
        //Beep check
        if( bBeep ){
            
            if( iN10nRepeat === ""
                || iN10nRepeat === null ){
                //Default
                iN10nRepeat = 0;
            }
            navigator.notification.beep( iN10nRepeat + 1 );
            
        }
        
        //Vibrate check
        if( bVibrate ){
            
            if( iN10nTime === ""
                || iN10nTime === null ){
                //Default
                iN10nTime = 0;
            }
            navigator.notification.vibrate( iN10nTime * 2000 + 1000 );
            
        }
        
        navigator.notification.alert( 
            ( (objReceived.message === "back")?("Programa Voltou!!"):("Programa em intervalo comercial!!") ), 
            function(){}, 
            "Aviso de Programação", 
            "Ok!"
        );
        

    }
};

/*******************************************************************************
 * Kaeptor App Class
 * 
 * 
 */
function KaeptorApplication( args ){     
    
    
    /**************************************************************************\ 
    | Private Attribute:
    \**************************************************************************/ 
    var fnOnInit = function(){};
    var currChannelDetail;
    var currMoreDetail;
    var currContent;
    var myself_app;
    var bTokenErr;
    var bAmqReady;
    var amq;
    
    /**************************************************************************\ 
    | Constructor:
    \**************************************************************************/
    currChannelDetail = "";
    currMoreDetail    = "";
    currContent       = "";
    myself_app        = this;
    bTokenErr         = false;
    bAmqReady         = false;
    amq               = org.activemq.Amq;
    
    //Arguments
    if( args ){
        if( args.onInit !== null
            && args.onInit !== "" ){
            //onInit function setted
            fnOnInit = args.onInit;
        }
        
    }
    
    //Include scripts
    include( "css/kaeptor.css" );                                       //CSS - Kaeptor App
    
    include( "js/todataurl.js" );                                       //JS  - toDataURL aux functions
    include( "js/kaeptor/logger.js" );                                  //JS  - logger functions
    include( "js/kaeptor/jaux.js" );                                    //JS  - jQuery aux extensions
    
    include( "js/kaeptor/core.js" );                                    //JS  - Kaeptor Core Classes
    
    include( "js/pageAuth.js" );                                        //JS  - App Authentication Page
    include( "js/pageMyChannel.js" );                                   //JS  - App MyChannels Page
    include( "js/pageChannelDetail.js" );                                   //JS  - App ChannelDetails Page
    
    //Initiated callback
    fnOnInit();
    
    
    /**************************************************************************\ 
    | Privileged Methods:
    \**************************************************************************/
    //Getters
    this.__defineGetter__("currChannelDetail", function(){
        return currChannelDetail;
    });
    this.__defineGetter__("currMoreDetail", function(){
        return currMoreDetail;
    });
    this.__defineGetter__("currContent", function(){
        return currContent;
    });
    
    //Setters
    this.__defineSetter__("currChannelDetail", function(val){
        currChannelDetail = val;
    });
    this.__defineSetter__("currMoreDetail", function(val){
        currMoreDetail = val;
    });
    this.__defineSetter__("currContent", function(val){
        currContent = val;
    });
    
    //Add listener to receive AMQ messages
    this.amqAddListener = function( topic ){
        //If AMQ is ready to handle messages  
        if( bAmqReady
            && topic !== "" ){
            //Add AMQ listener
            amq.addListener( "hdlRcv_"+topic+"", "topic://"+topic+"", amqMsgHandler.rcvMessage);
            
            return 0;
        } 
        
        return 1;
    };
    //Remove listener to receive AMQ messages
    this.amqRemoveListener = function( topic ){
        //If AMQ is ready to handle  
        if( bAmqReady
            && topic !== "" ){
            //Remove AMQ listener
            amq.removeListener( "hdlRcv_"+topic+"", "topic://"+topic+"" );
            
            return 0;
        } 
        
        return 1;
    };    
    //Start app / binding pages
    this.start      = function(){
        /**
         *Init vars
         */
        //Update objUser
        kaeptor.auth.user.device = deviceId;

        /**
        * Bindings:
        *
        $(window).bind(
            kaeptor.config.TOKEN_ERROR,
            function( evt, err ){
                
                $("#dialog-page #dialog-content").text(err);
                $("#dialog-link").trigger("click");
            }
        );
        /*
        * Init Auth MyChannel Controller
        */
        $("#authentication-page").live(
            'pageinit', 
            function(){
                console.log("Inicializando Authentication Page");
                /**
                * Init Page Auth Controller
                */
                var objPageAuth = new PageAuth();
                        
                //>Init and bind elements
                objPageAuth.init({
                    textUsername :           $("#username-text").val("admin"),
                    textPassword :           $("#password-text").val("admin"),
                    checkRemainConected :    $("#remainconected-checkbox"),
                    buttonLogin :            $("#logon-button")
                });
                

                //Load preferences in view
                //objPageAuth.loadPreferences();

                //Redirect if remain conected is true(secret ok)
                kaeptor.auth.token({
                    success:    function(){
                        //Save data
                        kaeptor.ls.save( 
                            kaeptor.config.USER_TOKEN, 
                            kaeptor.auth.user.tokenid 
                        );
                        kaeptor.ls.save( 
                            kaeptor.config.USER_EXPIRATION, 
                            kaeptor.auth.user.expiration
                        );
                        console.log("Token generated2: "+kaeptor.auth.user.tokenid);
                        console.log("Expiration generated2: "+kaeptor.auth.user.expiration);
                        
                        $( window ).bind(
                            kaeptor.config.TOKEN_ERROR,
                            function( evt, data ){
                                
                                navigator.notification.alert( 
                                    "Verifique seus dados de autenticação.", 
                                    function(){}, 
                                    "Erro de credencial", 
                                    "Ok!"
                                );
                            }
                        );

                        $.mobile.changePage("#mychannel-page");
                    },
                    error:      function( error ){
                        console.log( "Token Error: " + error );
                        
                        $( window ).bind(
                            kaeptor.config.TOKEN_ERROR,
                            function( evt, data ){
                                
                                navigator.notification.alert( 
                                    "Verifique seus dados de autenticação.", 
                                    function(){}, 
                                    "Erro de credencial", 
                                    "Ok!"
                                );
                            }
                        );
                    }
                });

                $(".status").css({"background":"#333"});
                
                //>Auto login
                $("#logon-button").trigger("tap");

            }
        );
        
        /**
        * Init Page MyChannel Controller
        */
        var objPageMyChannel = new PageMyChannel();
        var channel = new KaeptorChannel();
        
        //MyChannel list
        $("#mychannel-page").live(
            'pageinit', 
            function(){

                console.log("Inicializando MyChannel Page");
                //Init persistence layer
                //epg.init( kaeptor.auth.user.tokenid, function(){

                    //Set and bind elements
                    objPageMyChannel.init({
                        listViewMyChannel   : $("#mychannel-listview"),
                        token               : kaeptor.auth.user.tokenid
                    });

                    
                    console.log("Bind page show");
                    //Load list on every page show 
                    $("#mychannel-page").live( 
                        'pageshow',
                        function(event, ui){
                            console.log("show");
                            //Select the menu button
                            $("div[data-role='navbar'] a").removeClass( "ui-btn-active" );
                            $("div[data-role='navbar'] #mychannel-menu").addClass( "ui-btn-active" );
                            //Show loading div
                            $.mobile.showPageLoadingMsg();
                            //Try load list
                            objPageMyChannel.loadList( kaeptor.auth.user.tokenid );
                        }
                    );

                    //First list
                    //setTimeout( "objPageMyChannel.loadList( objUser.getToken() );", 5000 );
                    $("div[data-role='navbar'] a").removeClass( "ui-btn-active" );
                    $("div[data-role='navbar'] #mychannel-menu").addClass( "ui-btn-active" );
                    //$.mobile.showPageLoadingMsg();
                    $(".status").css({"background":"#333 url('images/clock.png')"});
                    //objPageMyChannel.loadList( kaeptor.auth.user.tokenid );
                    
                    amq.init({ 
                        uri                         : 'http://14bis.i-brasil.com:8161/demo/amq', //Broker
                        logging                     : false,                                     //Debug log
                        timeout                     : 60,                                        //Connection timeout (s)
                        pollDelay                   : 500,                                       //Polling interval (ms)
                        clientId                    : kaeptor.auth.user.tokenid,                 //Client unique identification
                        sessionInitializedCallback  : function(){                                //First 'GET' received
                            //Bind events only when it is ready
                            bAmqReady = true;
                            
                        }
                    });

                //});
            }
        );
            
        
        /**
        * Init ChannelsList Page
        */
       //Channel list
        $("#channellist-page").live(
            'pageshow', 
            function(){
                //Select the menu button
                $("div[data-role='navbar'] a").removeClass( "ui-btn-active" );
                $("div[data-role='navbar'] #mychannel-menu").addClass( "ui-btn-active" );
                //Show loading div
                $.mobile.showPageLoadingMsg();
                var arrListElem = $("#channel-listview").children( "li" );
                                                                
                console.log("Loading ChannelList Page");
                var channelList = kaeptor.channel.list({
                    token       : kaeptor.auth.user.tokenid,
                    max         : 100,
                    success     : function( channelList ){
                        
                        
                        var myChannelList = kaeptor.channel.bookmarked({
                            token       : kaeptor.auth.user.tokenid,
                            success     : function( myChannelList ){
                                
                                //Length of channel array
                                var len = channelList.length;
                                
                                //Clear old listItems from dom
                                //$("#channel-listview").empty();
                                //$("#channel-listview").listview("refresh");
                                                               
                                $.each( channelList, function( index, value ){
                                    var checkicon     = "checkbox-off";
                                    var classselected = "";

                                    $.each( myChannelList, function( index2, value2 ){
                                        if( value.id == value2.id ){
                                            checkicon       = "star";
                                            classselected   = "kaeptor-selected";
                                            return false;   //Break $.each iteration
                                        }
                                    });
                                    
                                    var isDisplayed = false;
                                    var elementLi;

                                    $.each(
                                        arrListElem,
                                        function( index3, liElem ){
                                            //Check if the channel is current displayed
                                            var jqElem = $( liElem );
                                            if( value.id === jqElem.data("kaeptorchannel-id") ){
                                                //Control var for check if update is required
                                                isDisplayed = true;
                                                elementLi   = jqElem;

                                                return false;   //Break iterations proccess
                                            }
                                        }
                                    );
                                    
                                    //Decide if it should be updated or completely retrieved
                                    if( isDisplayed ){
                                        
                                        //Check if it was subscribed and is no more subscribed
                                        if( classselected === ""
                                            && elementLi.hasClass( "kaeptor-selected" ) ){
                                            //Remove class from it
                                            elementLi.removeClass( "kaeptor-selected" );
                                            elementLi.attr("data-icon", "");

                                        //If it was not subscribed and is now subscribed
                                        } else if( classselected !== ""
                                            && !(elementLi.hasClass( "kaeptor-selected" )) ){
                                            //Add class to it
                                            elementLi.addClass( "kaeptor-selected" );
                                            elementLi.attr("data-icon", "star");
                                            
                                        } else {
                                            //Nothing to do
                                        }
                                        
                                        if( index + 1 === len ){
                                            //Hide loading
                                            $.mobile.hidePageLoadingMsg();
                                        }
                                        
                                    } else {
                                        /*kaeptor.cache.image({ 
                                            imgURL      : kaeptor.config.STATIC_SERVER+"logos/"+value.icon,
                                            success     : function( imgData ){*/
                                                var imgPath = kaeptor.config.STATIC_SERVER+"logos/"+value.icon;//imgData;

                                                $("#channel-listview").append("\
                                                        <li data-kaeptorchannel-id=\""+value.id+"\" data-icon=\""+checkicon+"\" class=\"channel-listitem "+classselected+" \" >\
                                                            <a>\
                                                                <img src=\""+imgPath+"\" />\
                                                                <h3>"+value.name+"</h3>\
                                                                <p>"+value.id+"</p>\
                                                            </a>\
                                                        </li>"
                                                );


                                                //If last item refresh counter
                                                if( index + 1 === len ){
                                                    //Hide loading
                                                    $.mobile.hidePageLoadingMsg();
                                                    $("#channel-listview").listview("refresh");
                                                }
                                            /*},
                                            error     : function(){
                                                $("#channel-listview").append("\
                                                        <li data-kaeptorchannel-id=\""+value.id+"\" data-icon=\""+checkicon+"\" class=\"channel-listitem "+classselected+" \" >\
                                                            <a>\
                                                                <img src=\"\" />\
                                                                <h3>"+value.name+"</h3>\
                                                                <p>"+value.id+"</p>\
                                                            </a>\
                                                        </li>"
                                                );

                                                $("#channel-listview").listview("refresh");

                                                //If last item refresh counter
                                                if( index + 1 === len ){
                                                    //Hide loading
                                                    $.mobile.hidePageLoadingMsg();
                                                }
                                            }
                                        });*/
                                        
                                    }
                                    
                                });
                                
                                console.log("Realizando Bind Channel listitem");
                                $('#channel-listview .channel-listitem').live(
                                    'tap',
                                    function( event, data ){
                                        var elem = $(this);
                                        var channel = new KaeptorChannel();
                                        channel.id  = elem.attr("data-kaeptorchannel-id");

                                        //console.log( "Clicou: " + elem.find("span.ui-icon").hasClass("ui-icon-checkbox-off") );
                                        //var t1 = new Date();
                                        if( elem.find("span.ui-icon").hasClass("ui-icon-checkbox-off") ){
                                            elem.find("span.ui-icon").removeClass("ui-icon-checkbox-off").addClass("ui-icon-star");

                                            kaeptor.channel.bookmark({
                                                object      : channel,
                                                token       : kaeptor.auth.user.tokenid,
                                                argSuccess  : {
                                                    element     : elem
                                                },
                                                success     : function( argSuccess ){
                                                    argSuccess.element.addClass("kaeptor-selected");
                                                },
                                                error       : function( error ){
                                                    console.log( "Bookmark Error: "+error );
                                                }
                                            });
                                        } else {
                                            elem.find("span.ui-icon").removeClass("ui-icon-star").addClass("ui-icon-checkbox-off");
                                            
                                            kaeptor.channel.unbookmark({
                                                object      : channel,
                                                token       : kaeptor.auth.user.tokenid,
                                                argSuccess  : {
                                                    element     : elem
                                                },
                                                success     : function( argSuccess ){
                                                    argSuccess.element.removeClass("kaeptor-selected");
                                                },
                                                error       : function( error ){
                                                    console.log( "Unbookmark Error: "+error );
                                                }
                                            });
                                        }
                                    }
                                );
                                
                                
                                
                            },
                            error       : function( error ){
                                console.log( "MyChannel Error List: " + error.message );
                            }
                        });
                    },
                    error       : function( error ){
                        console.log( "Channel Error List: " + error.message );
                    }
                });
                
            }
        );
            
        /**
        * Init Page ChannelDetail Controller
        */
        var objPageChannelDetail = new PageChannelDetail();
        
        //ChannelDetail list
        $("#channeldetail-page").live(
            'pageinit', 
            function(){

                console.log("Inicializando ChannelDetail Page");
                //Init persistence layer
                //epg.init( kaeptor.auth.user.tokenid, function(){

                    //Set and bind elements
                    objPageChannelDetail.init({
                        listViewChannelDetail   : $("#channeldetail-listview"),
                        token                   : kaeptor.auth.user.tokenid
                    });

                    
                    console.log("Bind page show");
                    //Load list on every page show 
                    $("#channeldetail-page").live( 
                        'pageshow',
                        function(event, ui){
                            console.log("show");
                            //Select the menu button
                            //$("div[data-role='navbar'] a").removeClass( "ui-btn-active" );
                            //$("div[data-role='navbar'] #mychannel-menu").addClass( "ui-btn-active" );
                            //Show loading div
                            $.mobile.showPageLoadingMsg();
                            //Try load list
                            objPageChannelDetail.loadList( kaeptor.auth.user.tokenid );
                        }
                    );

                    //First list
                    //setTimeout( "objPageMyChannel.loadList( objUser.getToken() );", 5000 );
                    //$("div[data-role='navbar'] a").removeClass( "ui-btn-active" );
                    //$("div[data-role='navbar'] #mychannel-menu").addClass( "ui-btn-active" );
                    //$.mobile.showPageLoadingMsg();
                    //$(".status").css({"background":"#333 url('images/clock.png')"});
                    //objPageMyChannel.loadList( kaeptor.auth.user.tokenid );
                    
                //});
            }
        );
            
            
        /**
         *Init
         */
        console.log("Inicializando em "+device.uuid);
        $.mobile.defaultPageTransition       = 'none';
        $.mobile.loadingMessageTextVisible   = 'true';
        $.mobile.loadingMessage              = 'Carregando..';
        kaeptor.auth.user.device             = device.uuid ;  
        
    };
    
} 

/******************************************************************************\
| Public:
\******************************************************************************/
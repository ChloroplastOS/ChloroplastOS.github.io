var serial = null;

$(document).ready(function () {

    $("#scratchx-start").on("click",function(){
        window.open('http://scratchx.org/?url=http://chloroplastos.github.io/qcoo.js#scratch');
    });

    chrome.runtime.onConnectExternal.addListener(function(port){
        console.log("chrome.runtime.onConnect "+port);
        port.postMessage({greeting:"hello"});
    });

    chrome.runtime.onMessageExternal.addListener(function(msg, sender, respFun){
        console.log("msg:"+msg.proto);
        if(msg.proto=='probe'){
            respFun({'proto':'online'});
        }else if(msg.proto=="qcoo"){
            console.log("qcoo: "+msg.data);
            writeBuff(msg.data);
        }
    });

    /* serial */
    serial = new SerialConnection();
    console.log(serial);
    serial.getDevices(function(ports){
        console.log(ports);
        var serialDrop = $("#serial-dropdown");
        serialDrop.empty();
        ports.forEach(function(port){
            var portStr = port.path;
            serialDrop.append("<li><a href='#'>"+portStr+"</a></li>");
            console.log("ser dev "+portStr);
        });
    });

    serial.onReadLine.addListener(onReadLine);

    $("#serial-dropdown").on("click",'li a',function(event){
        $("#serial-current").html(event.target.text+"<span class='caret'>");
    });

    $("#btnConnect").on("click",function(event) {
        if (serial.connectionId == -1) {
            var portStr = $("#serial-current").text().trim();
            console.log("conn to "+portStr);
            serial.connect(portStr, {bitrate: 115200}, onOpen);
        }else{
            var portStr = $("#serial-current").text();
            serial.disconnect(onClose);
        }
    });

    $("#armflight").on("click",function(){
        console.log("arm flight");
        //armflight(0);
		motorAllNormal();
    });
	
	/* use remote */
	var bIsOnlineStart = true;
	
    $("#calibrate").on("click",function(){
		
        /* console.log("calibrate flight"); */
        /* calibrate(); */
		
		/* borrow calibrate btn */
		/* use remote need 'mode' key */
		if (true == bIsOnlineStart)
		{
			console.log("start online Module");
			onlineStart();
			bIsOnlineStart = false;
		}
		else
		{
			console.log("stop online Module");
			onlineStop();
			bIsOnlineStart = true;
		}
		
    });
	
	$("#motorA").on("click",function(){
        console.log("motorA idling flight");		
        motorAIdling();
    });
	
	$("#motorB").on("click",function(){
        console.log("motorB idling flight");
        motorBIdling();
    });
	
	$("#motorC").on("click",function(){
        console.log("motorC idling flight");		
        motorCIdling();
    });
	
	$("#motorD").on("click",function(){
        console.log("motorD idling flight");
        motorDIdling();
    });

    $('#fileupload').fileupload({
        url: "http://120.76.118.117:9999/upload",
        //url: "http://192.168.10.109:9999/upload",
        autoUpload: true,
        add: function (e, data) {
            console.log("add:"+e+","+data);
            data.submit();
        },
        done: function (e, data) {
            console.log("upload done:"+data);
            $.each(data.files, function (index, file) {
                console.log("upload done:"+index+","+file.name);
                $('#saveino').attr('href', data.result);
                $("#saveino").removeAttr("disabled");
                $("#filename").text(file.name);
            });
        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            console.log("upload %"+progress);
        },
        fail: function(e, data) {
            alert('Fail!');
        }
    });

});

function writeBuff(buf){
    var ary = Object.keys(buf).map(function (key) {return buf[key]});
    var sendbuff = new Uint8Array(ary);
    serial.sendbuf(sendbuff.buffer);
}

function onReadLine(msg){
    //console.log('read line: ' + msg);
}

function onOpen(openInfo){
    console.log("ser open "+openInfo);
    $("#btnConnect").text("disconn");

}

function onClose(){
    $("#btnConnect").text("connect");
}


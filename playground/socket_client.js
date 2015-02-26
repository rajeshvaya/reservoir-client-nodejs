/**
 * TODO: NEED TO REWRITE THIS AS WE ARE GOING TO USE BATCH AND JSON ON SERVER SIDE WITH MORE FLEXIBILTY
 */

var net = require('net');

var client = net.Socket();
client.connect('3142','localhost',function(){
    console.log("\nConnected to reservoir server");
});

client.on("data", function(data){
    console.log("\nDATA FROM SERVER: " + data);
});


function communicate(){
    client.write("GET pk_movie", function(){
        console.log("\nRequest #1 sent to the server");
    });

    client.write("GET pk_movie", function(){
        console.log("\nRequest #2 sent to the server");
    });
}

communicate();


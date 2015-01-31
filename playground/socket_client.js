var net = require('net');

var client = net.Socket();
client.connect('3142','localhost',function(){
    console.log("\nConnected to localhost:3142");
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


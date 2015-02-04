var net = require('net');

module. exports = {
    client: {},
    connect: function(port, host, then) {
        var $this = this;
        var client = net.Socket();
        
        client.connect(port, host, function(){
            then && then();
        });

        client.on("data", function(data) {
            $this._process(data);
        });

        this.client = client;
        return this;
    },
    get: function(key, then) {
        var $this = this;
        $this.client.write(key, function() {
            $this._handle(key, then);
        });
        return this;
    },
    _handlers: {},
    _commands: ['GET', 'SET', 'DEL'],
    _handle: function(key, handler) {
        //remove commands from the key, because server doesn't return them (you can check here if its a valid command)
        var keyParts = key.split(' ');
        keyParts.shift();

        this._handlers[keyParts] = handler;
    },
    _process: function(data) {
        var response = JSON.parse(data.toString());
        var handler = this._handlers[response.incoming_message];
        if (handler) {
            if (response.message) {
                handler(null, response.message);
            } else {
                handler(new Error(response.error), null);
            }
        }
        delete this._handlers[response.incoming_message];
    }
};
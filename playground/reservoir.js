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
        var batch_string = JSON.stringify({
            key: key
        });
        return this.send('GET', key, batch_string, then);
    },
    set: function(data, then) {
        var $this = this;
        var batch_string = JSON.stringify({
            key: data['key'],
            data: data['value'],
            expiry: data['expiry'],
        });
        return this.send('SET', data['key'], batch_string, then);
    },
    delete: function(key, then) {
        var batch_string = JSON.stringify({
            key: key
        });
        return this.send('DEL', key, batch_string, then);
    },
    bucket: function(bucket, then) {
        var batch_string = JSON.stringify({
            batch: batch
        });
        return this.send('BKT', bucket, batch_string, then);
    },
    tpl: function(data, then) {
        var $this = this;
        var batch_string = JSON.stringify({
            key: data['key'],
            data: data['value'],
            expiry: data['expiry'],
        });
        return this.send('TPL', data['key'], batch_string, then);
    },
    ota: function(data, then) {
        var $this = this;
        var batch_string = JSON.stringify({
            key: data['key'],
            data: data['value'],
            expiry: data['expiry'],
        });
        return this.send('OTA', data['key'], batch_string), then;
    },
    icr: function(key, then) {
        var batch_string = JSON.stringify({
            key: key
        });
        return this.send('ICR', key, batch_string, then);
    },
    dcr: function(key, then) {
        var batch_string = JSON.stringify({
            key: key
        });
        return this.send('ICR', key, batch_string, then);
    },

    send: function(type, key, batch_string, then){
        var $this = this;
        var data_string =  type + " " + batch_string;

        $this.client.write(data_string, function() {
            $this._handle(key, then);
        });
        return this;
    },
    _handlers: {},
    _handle: function(key, handler) {
        this._handlers[key] = handler;
    },
    _process: function(data) {
        var response = JSON.parse(data.toString());
        if(response.data){
            for(i=0; i<response.data.length; i++){
                element = response.data[i];
                var handler = this._handlers[element.key];
                if (handler) {
                    if (element.data) {
                        handler(null, element.key);
                    }
                }
                delete this._handlers[element.key];
            }
        }
    }
};
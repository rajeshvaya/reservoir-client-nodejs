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
        var batch_string = JSON.stringify([{
            key: key
        }]);
        return this.send('GET', key, batch_string, then);
    },

    get_batch: function(list, then){
        var batch = [];
        var batch_string = '';
        list.forEach(function(element, index, array){
            batch.push({key: element});
        });
        batch_string = JSON.stringify(batch);
        return this.send('GET', list, batch_string, then);
    },

    set: function(data, then) {
        var $this = this;
        var batch_string = JSON.stringify([{
            key: data['key'],
            data: data['value'],
            expiry: data['expiry'],
        }]);
        return this.send('SET', data['key'], batch_string, then);
    },

    set_batch: function(list, then) {
        var $this = this;
        var batch = [];
        var batch_string = '';
        list.forEach(function(data, index, array){
            batch.push({
                key: data['key'],
                data: data['value'],
                expiry: data['expiry']
            });
        });
        batch_string = JSON.stringify(batch);
        return this.send('SET', list, batch_string, then);
    },

    delete: function(key, then) {
        var batch_string = JSON.stringify([{
            key: key
        }]);
        return this.send('DEL', key, batch_string, then);
    },

    delete_batch: function(list, then){
        var batch = [];
        var batch_string = '';
        list.forEach(function(element, index, array){
            batch.push({key: element});
        });
        batch_string = JSON.stringify(batch);
        return this.send('DEL', list, batch_string, then);
    },

    bucket: function(bucket, then) {
        var batch_string = JSON.stringify([{
            batch: batch
        }]);
        return this.send('BKT', bucket, batch_string, then);
    },

    tpl: function(data, then) {
        var $this = this;
        var batch_string = JSON.stringify([{
            key: data['key'],
            data: data['value'],
            expiry: data['expiry'],
        }]);
        return this.send('TPL', data['key'], batch_string, then);
    },

    tpl_batch: function(list, then) {
        var $this = this;
        var batch = [];
        var batch_string = '';
        list.forEach(function(data, index, array){
            batch.push({
                key: data['key'],
                data: data['value'],
                expiry: data['expiry']
            });
        });
        batch_string = JSON.stringify(batch);
        return this.send('TPL', list, batch_string, then);
    },

    ota: function(data, then) {
        var $this = this;
        var batch_string = JSON.stringify([{
            key: data['key'],
            data: data['value'],
            expiry: data['expiry'],
        }]);
        return this.send('OTA', data['key'], batch_string), then;
    },

    ota_batch: function(list, then) {
        var $this = this;
        var batch = [];
        var batch_string = '';
        list.forEach(function(data, index, array){
            batch.push({
                key: data['key'],
                data: data['value'],
                expiry: data['expiry']
            });
        });
        batch_string = JSON.stringify(batch);
        return this.send('OTA', list, batch_string, then);
    },

    icr: function(key, then) {
        var batch_string = JSON.stringify([{
            key: key
        }]);
        return this.send('ICR', key, batch_string, then);
    },
    icr_batch: function(list, then){
        var batch = [];
        var batch_string = '';
        list.forEach(function(element, index, array){
            batch.push({key: element});
        });
        batch_string = JSON.stringify(batch);
        return this.send('ICR', list, batch_string, then);
    },

    dcr: function(key, then) {
        var batch_string = JSON.stringify([{
            key: key
        }]);
        return this.send('DCR', key, batch_string, then);
    },

    dcr_batch: function(list, then){
        var batch = [];
        var batch_string = '';
        list.forEach(function(element, index, array){
            batch.push({key: element});
        });
        batch_string = JSON.stringify(batch);
        return this.send('DCR', list, batch_string, then);
    },

    send: function(type, key, batch_string, then){
        var $this = this;
        var data_string =  type + " " + batch_string;

        var keymap = key instanceof String ? [key] : key;
        $this._add_to_queue(function(){
            $this.client.write(data_string, function() {
                $this._handle(keymap, then);
            });
        });
        
        return this;
    },
    _handlers: {},
    _handle: function(key, handler) {
        this._handlers[key] = handler;
    },
    _queue: [],
    _add_to_queue: function(f){
        this._queue.push(f);
        if(this._queue.length === 1)
            this._next_in_queue();
    },
    _next_in_queue: function(){
        if(this._queue.length){
            f = this._queue[0];
            f();
        }
        return;
    },
    _process: function(data) {
        var response = JSON.parse(data.toString());
        if(response.data){
            r = JSON.parse(response.data);
            keymap = [];
            r.forEach(function(element, index, array){
                keymap.push(element.key);
            });

            var handler = this._handlers[keymap];
            if(typeof(handler) == 'function'){
                if(r.length === 1)
                    handler(null, r[0].data);
                else
                    handler(null, r);
            }
            delete this._handlers[keymap];
        }
        // process the next item in the queue
        f = this._queue.shift();
        this._next_in_queue();
    }

};
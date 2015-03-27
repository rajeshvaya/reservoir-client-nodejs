var reservoir = require('./reservoir');
var onConnect = function() {
    console.log("\nConnected.");
    reservoir.get('pk_movie', function(err, response) {
        console.log(response);
    });
};
reservoir.connect('3142', 'localhost', onConnect);
var reservoir = require('./reservoir');
var onConnect = function() {
    console.log("\nConnected.");
    reservoir.get('GET pk_movie', function(err, response) {
        console.log(response);
    });
};
reservoir.connect('3142', 'aswat-office.aswtel.com', onConnect);
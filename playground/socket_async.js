var reservoir = require('./reservoir');
var onConnect = function() {
    console.log("\nConnected.");
    // GET 
    reservoir
    .get('pk_movie', function(err, response) {
        console.log(response);
    })
    .get('pk_actor', function(err, response) {
        console.log(response);
    })
    .get_batch(['pk_actor', 'pk_movie'], function(err, response) {
        console.log(response);
    });
    
    // SET
    set_data = {
        key: "pk_movie_votes",
        value: "1000",
        expiry: "0"
    };
    reservoir.set(set_data, function(err, response) {
        console.log(response);
    });

    // ICR
    reservoir.get('pk_movie_votes', function(err, response){
		console.log(response);
    });

    reservoir.icr('pk_movie_votes', function(err, response){
		console.log(response);
	}).get('pk_movie_votes', function(err, response){
		console.log(response);
    });

    // DELETE
    reservoir.delete("pk_movie_votes", function(err, response){
		console.log(response);
	}).get('pk_movie_votes', function(err, response){
		console.log(response);
    });


};
reservoir.connect('3142', 'localhost', onConnect);
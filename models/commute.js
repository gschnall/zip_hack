var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyDpHsG1eJG_aFi9BB7Q-dLLgdS23840weo'
});


function getGeocode(address, callback) {
  var latLon = {};

  googleMapsClient.geocode({
    address: address
  }, function(err,res){
    if (err){
      console.log("GC ERR: " + err);
    } else {
      var latLon = res.json.results[0].geometry.location;
      callback(latLon);
    }
  });
}

function getCommuteTime(startAddr, endAddr, callback)
{
  var transitModes = ['driving', 'bicycling', 'transit', 'walking'];
  var startLatlon, endLatlon;
  var results = {};
  getGeocode(startAddr, function(res){
    startLatlon = res;
    getGeocode(endAddr, function(res){
      endLatlon = res;
      transitModes.forEach(function(mode){
        googleMapsClient.directions({
            origin: startLatlon,
            destination: endLatlon,
            mode: mode
          }, function(err, res){
            if (err) {
              console.log('DIR ERR: ' + err);
            } else {
              results[mode] = res.json.routes[0].legs[0].duration;
              if (Object.keys(results).length === 4)
              {
                callback(results);
              }
            }
          });
      });





    });
  });

}

getCommuteTime('USC', '2268 28th st., santa monica, ca 90401', function(results){
  console.log(results);
});

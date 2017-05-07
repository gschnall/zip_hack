//persKey: AIzaSyBl9dkTrB28BcxG4ArsEdA_1yx7ZrquqIQ
//zcKey: 'AIzaSyDpHsG1eJG_aFi9BB7Q-dLLgdS23840weo'

var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyBl9dkTrB28BcxG4ArsEdA_1yx7ZrquqIQ'
});


function getGeocode(address, callback) {
    googleMapsClient.geocode({
      address: address
    }, function(err,res){
      if (err){
        callback(err);
      } else {
        if (res.json.results[0])
        {
          var county = "";
          var latLon = res.json.results[0].geometry.location;
          res.json.results[0].address_components.forEach(function(component){
            //console.log(component.long_name);
            var splitName = component.long_name.split(" ");
            splitName.forEach(function(part){
              if (part === 'County')
              {
              splitName.pop();
              county = splitName.join(' ');
              }
            });
            if (component.types[0] === 'administrative_area_level_1')
            {
              county += ", " + component.short_name;
            }
            latLon.county = county;
          });
        } else{
          var latLon = {lat: '', lng: ''};
        }

        callback(err, latLon);
      }
    });
}


function getCommuteTimes(jobsArray)
{
  return new Promise(function(resolve, reject) {
    var transitModes = ['driving', 'bicycling', 'transit', 'walking'];
    var jobsProcessed = 0;
    jobsArray.forEach(function(job, index, array){
      if (job.transit.endLatlon.lng === '')
      {
        jobsProcessed++;
      } else {
        transitModes.forEach(function(mode){
          googleMapsClient.directions({
            origin: job.transit.startLatlon,
            destination: job.transit.endLatlon,
            mode: mode
          }, function(err, res){
            if (err)
            {
              console.log("Dir ERR: " + err);
              jobsProcessed++;
            } else {
              job.transit[mode] = {};
              job.transit[mode].duration = res.json.routes[0].legs[0].duration;
              job.transit[mode].distance = res.json.routes[0].legs[0].distance;
              if (Object.keys(job.transit).length === 6)
              {
                jobsProcessed++;
                console.log(jobsProcessed);
              }
            }
            if (jobsProcessed === array.length)
            {
              resolve(jobsArray);
            }
          });
        });

      }
    });
  });

}

function getLatlon(startLocation, jobsArray)
{
  return new Promise(function(resolve, reject) {
    getGeocode(startLocation, function(err, data){
      console.log(err);
      var startLatlon = data;

      var jobsProcessed = 0;
      jobsArray.forEach((job, index, array)=>{
        job.transit = {};
        job.transit.startLatlon = startLatlon;
        var searchString = job.company + ", " + job.formattedLocationFull;
        getGeocode(searchString, function(err, data){
          if (err){
            console.log("JP : " + err);
          } else {
            jobsProcessed++;
            job.transit.endLatlon = data;
          }

          if (jobsProcessed == array.length)
          {
            resolve(jobsArray);
          }
        })
      });
    })
  });
}

module.exports = {
  getLatlon: getLatlon,
  getCommuteTimes: getCommuteTimes
}

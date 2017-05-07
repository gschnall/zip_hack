var fs = require('fs');
var parse = require('csv-parse');

var county_MSA_array = [];
var msa_rpp_array = []

var parser = parse({delimiter : ','}, function(err, data){
  county_MSA_array = data;
});


var parser2 = parse({delimiter: ','}, function(err, data){
  msa_rpp_array = data;
});

fs.createReadStream('./csvs/metrolist.csv').pipe(parser);
fs.createReadStream('./csvs/msa_rpp.csv').pipe(parser2);


function getRpps(jobsArray)
{
  return new Promise(function(resolve, reject) {
    var jobsProcessed = 0;
    jobsArray.forEach((job, index, array) => {
      if (job.transit.endLatlon.county)
      {
        job.rpp = {};
        var msa;
        county_MSA_array.forEach(function(county){
          if (county.indexOf(job.transit.endLatlon.county) !== -1)
          {
            msa_rpp_array.forEach(function(msa){
              if (msa.indexOf(county[0]) !== -1)
              {
                job.rpp[msa[3]] = msa[4];
              }
            })
          }
        })
        jobsProcessed++;
      } else {
        jobsProcessed++;
      }
      if (jobsProcessed === array.length)
        resolve(jobsArray);
    })
  });
}

module.exports = {
  getRpps: getRpps
}

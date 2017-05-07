let publisherId = '9640920784315304'
var api = require('indeed-jobs-api').getInstance(publisherId);
var request = require('request');
var $ = require('cheerio');


function findJobs(city, state, keywords, length, radius, sort)
{
  return new Promise(function(resolve, reject) {
    // do a job search
    api.JobSearch()
    	.Radius(radius)
    	.WhereLocation({
    		city : city,
    		state : state
    	})
    	.WhereKeywords(keywords)
      .Limit(length)
    	.SortBy(sort)
    	.UserIP("1.2.3.4")
    	.UserAgent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36")
    	.Search(
    		function (results) {
    		resolve(JSON.parse(results).results);
    	},
    		function (error) {
          reject(err);
    	})
    ;
  });
}

function getSummaries(jobsArray)
{
  return new Promise(function(resolve, reject) {
    var jobsProcessed = 0;
    jobsArray.forEach((job, index, array)=>{
      request(job, function(err, res, body){
        if (err){
          job.summary = "Could not retrieve...";
          jobsProcessed++;
        } else {
          jobsProcessed++;
          job.summary = $('#job_summary', body).text();
        }
        if (jobsProcessed === array.length){
          resolve(jobsArray);
        }
      });
    })
  });
}



module.exports = {
  findJobs: findJobs,
  getSummaries: getSummaries
}

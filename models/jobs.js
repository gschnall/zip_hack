let publisherId = '9640920784315304'
var api = require('indeed-jobs-api').getInstance(publisherId);


// do a job search
api.JobSearch()
	.Radius(20)
	.WhereLocation({
		city : "Santa Monica",
		state : "CA"
	})
	.WhereKeywords(["nodejs"])
  .Limit(5)
	.SortBy("date")
	.UserIP("1.2.3.4")
	.UserAgent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36")
	.Search(
		function (results) {
		// do something with the success results
		console.log(JSON.parse(results).results);
	},
		function (error) {
		// do something with the error results
		console.log(error);
	})
;


//get job

/*
api.GetJob()
  .WhereJobKeys(['410b59e35b33f448'])
  .Retrieve(function(res){
    console.log("result: " + JSON.stringify(JSON.parse(res).results[0], null, 2));
  }, function(err){
    console.log(err);
  });
  */

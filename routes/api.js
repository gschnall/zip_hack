//external includes
var express = require('express');
var router = express.Router();

//model includes
var Indeed = require('../models/jobs');
var Directions = require('../models/commute');
var Reviews = require('../models/employee_review');

//routes
router.get('/search', function(req, res){
  var jobSearchStartLocation = '312 Arizona Ave, Santa Monica, CA 90401';
  var jobSearchCity = 'Santa Monica';
  var jobSearchState = "CA";
  var jobSearchKeywords = ["nodejs, ios"];
  var jobSearchResultsLength = 5;
  Indeed.findJobs(jobSearchCity, jobSearchState, jobSearchKeywords, jobSearchResultsLength)
        .then(Indeed.getSummaries)
        .then(Reviews.getEmployeeReview)
        .then(Directions.getLatlon.bind(null, jobSearchStartLocation))
        .then(Directions.getCommuteTimes)
        .then(function(data){
          res.json(data);
        });
});

module.exports = router;

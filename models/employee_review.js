let partnerID = '148645';
let partnerKey = 'iVChl8nVGOu';

var Glassdoor = require('node-glassdoor').initGlassdoor({
  partnerId: partnerID,
  partnerKey: partnerKey
});



function getEmployeeReview(jobsArray)
{
  return new Promise(function(resolve, reject){
    var jobsProcessed = 0;
    jobsArray.forEach((job, index, array)=>{
      Glassdoor.findOneCompany(job.company, {
        city: job.city,
        state: job.state,
        country: job.country
      })
      .then(function(data){
        jobsProcessed++;
        job.review = data;
        return jobsProcessed;
      })
      .then(function(data){
        if (data === array.length)
        {
          resolve(jobsArray);
        }
      })
      .catch(function(err){
        jobsProcessed++;
        console.error(err);
      });
    });
  });
}


module.exports = {
  getEmployeeReview: getEmployeeReview
}

var fs = require('fs');

function getSkills(jobsArray)
{
  return new Promise(function(resolve, reject) {
    fs.readFile("./models/new_skills.json", function (err, data) {
      skillsHash = JSON.parse(data);
        jobsArray.forEach((job, index, array)=> {
          var summaryArr = job.summary.split(" "); 
          var totalSkills = [];
          summaryArr.forEach((word)=> {
            if(skillsHash[word]) {
              totalSkills.push(word); 
            }
          });
          job.skills = totalSkills;
        });
        resolve(jobsArray);
    });
  })
}

module.exports = {
  getSkills: getSkills 
}





//function to get the open jobs
function getOpenJobs(jobs){
    var jobListArry = new Array();

    jobs.forEach(element =>{
        var currentDate = new Date().toLocaleDateString("en-US");
        var closingDate = new Date(Date.parse(element.closingDate)).toLocaleDateString("en-US");
        if(Date.parse(closingDate) > Date.parse(currentDate)){
            jobListArry.push(element);
        }
    });
   return jobListArry;
}

//function to get the expired jobs
function getExpiredJobs(jobs){
    var jobListArry = new Array();

    jobs.forEach(element =>{
        var currentDate = new Date().toLocaleDateString("en-US");
        var closingDate = new Date(Date.parse(element.closingDate)).toLocaleDateString("en-US");
        if(Date.parse(closingDate) < Date.parse(currentDate)){
            jobListArry.push(element);
        }
    });
   return jobListArry;
}

// function to get the job role by job type
function getJobRoleByJobType(jobs){

    var jobRoleArry = new Array();
    jobs.forEach(element =>{
        // console.log(element.jobRole);
         if(!jobRoleArry.includes(element.jobRole)){
             jobRoleArry.push(element.jobRole);
         }
     });

     return jobRoleArry;
}

//===========================================
//            Export Functions
//============================================
module.exports.getOpenJobs =  getOpenJobs;
module.exports.getExpiredJobs = getExpiredJobs;
module.exports.getJobRoleByJobType = getJobRoleByJobType;
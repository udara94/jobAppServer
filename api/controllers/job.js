const JobItem = require('../../models/JobItem');
const JobTypeItem = require('../../models/JobTypeItem');
const JobItemList = require('../../models/JobItemList').jobItemList;
const jobRoleList = require('../../models/JobItemList').jobRoleList;
const verify = require('../routes/veriftToken');
const utilities = require('../../utilities/utilities');

exports.add_new_job = (req, res) => {
    const job = new JobItem({
        jobId: req.body.jobId,
        jobType: req.body.jobType,
        jobDescription: req.body.jobDescription,
        jobRole: req.body.jobRole,
        employer: req.body.employer,
        employerEmail: req.body.employerEmail,
        imgUrl: req.body.imgUrl,
        closingDate: req.body.closingDate,
        isExpired: req.body.isExpired,
    })
    job.save()
    .then(result => {
        console.log(result);
        var jobId = result._id;
        utilities.create_activity(jobId,jobId,"likes")
        res.status(201).json({
            message: 'Job created'
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
          message: err.message
        });
    })
    // try {

    //     //saving new job in job list
    //     const savedJob = await job.save()

    //     //get the jobtype id and update the job count by one
    //     var jobTypeId = req.body.jobType;
    //     const post = await JobTypeItem.findById(jobTypeId);
    //     var jobCount = parseInt(post.jobCount) + 1;

    //     const updateJobType = await JobTypeItem.updateOne(
    //         { _id: jobTypeId },
    //         { $set: { jobCount: jobCount.toString() } }
    //     );
    //     //utilities.create_activity(user._id,tour._id,"likes")
    //     res.json(savedJob);
    // } catch (err) {
    //     res.status(400).send('Bad request');
    // }
}
const JobItem = require('../../models/JobItem');
const JobItemList = require('../../models/JobItemList').jobItemList;
const jobRoleList = require('../../models/JobItemList').jobRoleList;
const utilities = require('../../utilities/utilities');
const OpenJobs = require('../../utilities/JobUtils');
const JobTypeItem = require('../../models/JobTypeItem');
const Notification = require('../../models/Notification');
const NotificationController = require('../controllers/notificationController');

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
            var jobType = result.jobType;

            //update the job count
            update_job_count(jobType, true, 0);

            //add notification to notification document
            //add_notification(result);
            NotificationController.add_notification(result);

            //create notifiaction
            //utilities.create_activity("5e6b6d72e8416f3ef89c8745","5e6b6d72e8416f3ef89c8745","likes")
            res.status(200).json({
                message: "Job Crated Successfully"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: err.message
            });
        })
}


//search jobs
exports.search_jobs = (req, res) => {

    var key = req.query.key;

    JobItem.find({
        "employer": { '$regex': key, $options: "i" }
    })
        .exec()
        .then(jobs => {
            var jobListArry = new Array();
            jobListArry = OpenJobs.getOpenJobs(jobs);

            const jobItemList = new JobItemList({
                jobItemList: jobListArry,
                jobType: req.query.jobType
            });
            res.json(jobItemList);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: err.message
            });
        })
}

exports.get_expired_jobs = (req, res) => {

    JobItem.find()
        .exec()
        .then(jobs => {
            var jobListArry = new Array();
            jobListArry = OpenJobs.getExpiredJobs(jobs)

            const jobItemList = new JobItemList({
                jobItemList: jobListArry,
                jobType: "okok"
            });

            res.status(200).json(jobItemList);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: err.message
            });
        })

}

exports.get_all_jobs_by_type = (req, res) => {

    const limit = Math.max(0, req.query.limit)
    const offset = Math.max(0, req.query.offset)

    JobItem.find({ jobType: req.query.jobType })
        .limit(limit)
        .skip(offset)
        .exec()
        .then(jobs => {
            var jobListArry = new Array();
            var expiredJobArray = new Array();
            jobListArry = OpenJobs.getOpenJobs(jobs);
            expiredJobArray = OpenJobs.getExpiredJobs(jobs)

            if (expiredJobArray.length > 0) {
                update_job_count(req.query.jobType, false, expiredJobArray.length)
                delete_job(expiredJobArray);
            }
            const jobItemList = new JobItemList({
                jobItemList: jobListArry,
                jobType: req.query.jobType
            });
            res.status(200).json(jobItemList);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: err.message
            });
        })
}

exports.get_job_role_by_type = (req, res) => {

    JobItem.find({
        jobType: req.query.jobType
    })
        .exec()
        .then(jobs => {
            var jobRoleArry = new Array();
            jobRoleArry = OpenJobs.getJobRoleByJobType(jobs);

            const response = new jobRoleList({
                jobRoleList: jobRoleArry
            });
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: err.message
            });
        })
}

exports.get_jobs_by_job_role = (req, res) => {

    JobItem.find({
        jobType: req.query.jobType,
        jobRole: req.query.jobRole
    })
        .exec()
        .then(jobs => {
            var jobListArry = new Array();
            jobListArry = OpenJobs.getOpenJobs(jobs);;

            const jobItemList = new JobItemList({
                jobItemList: jobListArry,
                jobType: req.query.jobType,
                jobRole: req.query.jobRole
            });
            res.status(200).json(jobItemList);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: err.message
            });
        })
}

exports.get_specific_job = (req, res) => {

    JobItem.findById(req.query.jobId)
        .exec()
        .then(job => {
            res.status(200).json(job);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: err.message
            });
        })
}

exports.update_job = (req, res) => {

    JobItem.updateOne(
        { _id: req.query.jobId },
        {
            $set: {
                jobType: req.body.jobType,
                jobDescription: req.body.jobDescription,
                jobRole: req.body.jobRole,
                employer: req.body.employer,
                employerEmail: req.body.employerEmail,
                imgUrl: req.body.imgUrl,
                closingDate: req.body.closingDate,
                isExpired: req.body.isExpired,
                postedDate: req.body.postedDate
            }
        }
    )
        .exec()
        .then(job => {
            res.status(200).json(job);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: err.message
            });
        })
}

exports.delete_job = (req, res) => {
    JobItem.deleteMany({
        _id: req.query.jobId
    })
    .exec()
    .then(job => {
        update_job_count(req.query.jobType, false, 1)
        res.status(200).json(job);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: err.message
        });
    })
}

function update_job_count(jobType, isAdded, expiredSize) {
    JobTypeItem.findById(jobType)
        .then(jobType => {
            var jobCount;
            if (isAdded) {
                jobCount = parseInt(jobType.jobCount) + 1;
            } else {
                jobCount = parseInt(jobType.jobCount) - expiredSize;
            }
            JobTypeItem.updateOne(
                { _id: jobType._id },
                { $set: { jobCount: jobCount.toString() } }
            )
                .exec()
                .then(result => {
                    console.log("Successfully update");

                }).catch(err => {
                    console.log(err);
                })
        })
        .catch(err => {
            console.log(err);
        })
}

function delete_job(expiredJobArray) {
    expiredJobArray.forEach(item => {
        JobItem.deleteMany({
            _id: item._id
        })
            .exec()
            .then(job => {
                console.log("Successfully deleted");
                // console.log(job);
            })
            .catch(err => {
                console.log(err);
            })
    })
}


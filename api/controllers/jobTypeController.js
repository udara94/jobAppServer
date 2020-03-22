const JobTypeItem = require('../../models/JobTypeItem');
const JobTypeItemList = require('../../models/JobTypeItemList');
const JobItem = require('../../models/JobItem');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

//get all jobs types
exports.get_job_types = (req, res) => {
    JobTypeItem.find({
        jobField: req.query.jobField
    })
        .exec()
        .then(jobTyps => {
            const jobTypeItemList = new JobTypeItemList({
                jobTypeItemList: jobTyps
            });
            res.status(200).json(jobTypeItemList);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: err.message
            });
        })
}

//submit a job type
exports.add_job_type = (req, res) => {
    const jobType = new JobTypeItem({
        jobField: req.body.jobField,
        jobType: req.body.jobType,
        isDeleted: req.body.isDeleted,
        jobCount: "0"
    });
    jobType.save()
        .then(jobType => {
            res.status(200).json(jobType);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: err.message
            });
        })
}

// specific job type
exports.get_specific_job_type = (req, res) => {

    JobTypeItem.findById(req.params.jobTypeId)
        .exec()
        .then(jobType => {
            res.status(200).json(jobType);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: err.message
            });
        })


}

// update job type
exports.update_job_type = (req, res) => {

    JobTypeItem.updateOne(
        { _id: req.params.jobTypeId },
        { $set: { jobType: req.body.jobType } }
    )
        .exec()
        .then(jobType => {
            res.status(200).json(jobType);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: err.message
            });
        })

}

//delete specific post
exports.delete_job_type = (req, res) => {
    JobTypeItem.remove({
        _id: req.params.jobTypeId
    })
        .exec()
        .then(jobType => {
            res.status(200).json(jobType);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: err.message
            });
        })
}
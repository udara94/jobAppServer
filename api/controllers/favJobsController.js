const JobItem = require('../../models/JobItem');
const JobItemList = require('../../models/JobItemList').jobItemList;
const UserFavJobs = require('../../models/User_Fav');
const mongoose = require('mongoose');
const FavStatus = require('../../models/FavStatus');
mongoose.Promise = require('bluebird');

exports.get_is_favourite = (req, res) => {
    UserFavJobs.countDocuments({
        userId: req.user._id,
        jobId: req.query._id
    })
        .exec()
        .then(count => {
            var status = false;

            if (count == 0) {
                status = false;
            } else {
                status = true;
            }

            const favStatus = new FavStatus({
                isExist: status
            });
            res.status(200).json(favStatus);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: err.message
            });
        })
}

exports.get_fav_jobs = (req, res) => {

    UserFavJobs.find({ userId: req.user.userId })
        .exec()
        .then(user => {
            var favJobItems = [];
            user.forEach(function (u) {
                var jobId = u.jobId;
                favJobItems.push(JobItem.findById(jobId));
            });
            return Promise.all(favJobItems);
        })
        .then(jobList => {
            const jobItemList = new JobItemList({
                jobItemList: jobList
            });
            res.status(200).json(jobItemList);
        })
        .catch(err => {
            res.status(500).json({
                message: err.message
            });
        })
}

exports.add_fav_job = (req, res) => {
    const favJob = new UserFavJobs({
        userId: req.user.userId,
        jobId: req.query._id,
    });

    favJob.save()
        .then(favJob => {
            res.status(200).json(favJob);
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({
                message: err.message
            });
        })
}

exports.delete_fav_job = (req, res) => {

    UserFavJobs.deleteMany({
        jobId: req.query._id
    })
        .exec()
        .then(favJob => {
            res.status(200).json(favJob);
        })
        .catch(err => {
            res.status(500).json({
                message: err.message
            });
        })
}

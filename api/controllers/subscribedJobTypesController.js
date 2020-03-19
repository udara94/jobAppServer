const SubscribeJobTypes = require('../../models/SubscribedJobType')
const JobTypeItem = require('../../models/JobTypeItem');
const SubsJobTypeItemList = require('../../models/SubsJobsItemList');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

exports.get_subscribed_job_types = (req, res) => {
    JobTypeItem.find()
        .select('jobType')
        .exec()
        .then(jobTyps => {
            var jobTypeArry = new Array();
            var subsJobsArray = [];

            jobTyps.forEach(element => {
                jobTypeArry.push(element);
            })

            SubscribeJobTypes.find({
                userId: req.user.userId
            })
            .select('jobType')
                .exec()
                .then(subsResult => {
                    subsResult.forEach(function (u) {
                        subsJobsArray.push(JobTypeItem.find({ _id: u.jobType }))
                    })
                    return Promise.all(subsJobsArray);
                }).then(result => {

                    var subsArray = new Array();
                    result.forEach(element => {
                        subsArray.push(element[0])
                    })

                    const subsAndJonTypes = new SubsJobTypeItemList({
                        jobTypeItemList: jobTypeArry,
                        subsJobTypeItemList: subsArray
                    });
                    res.status(200).json(subsAndJonTypes);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        message: err.message
                    });
                })


        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: err.message
            });
        })
}

exports.add_subscribed_job_types = (req, res) => {

    var jobTypeArry = new Array();
    jobTypeArry = req.body.jobTypeArry;

    SubscribeJobTypes.find({
        userId: req.user.userId
    })
        .then(subscribedResult => {

            var subscribedArry = new Array();
            subscribedResult.forEach(element => {
                subscribedArry.push(element.jobType);
            })
            jobTypeArry.forEach(element => {
                if (subscribedArry.indexOf(element) == -1) {
                    //add new subscriptions
                    var subscribeJobType = new SubscribeJobTypes({
                        userId: req.user.userId,
                        jobType: element
                    })
                    subscribeJobType.save()
                }
            })
            subscribedArry.forEach(element => {
                if (jobTypeArry.indexOf(element) == -1) {
                    SubscribeJobTypes.deleteMany({
                        jobType: element
                    }).exec()
                }
            })
            res.status(201).json({
                message: 'Job type subscription updated',
            });

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: err.message
            });
        })

}


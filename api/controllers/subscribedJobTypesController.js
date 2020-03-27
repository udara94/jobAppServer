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
                .exec()
                .then(subsResult => {
                    subsResult[0].jobType.forEach(function (u) {
                        //console.log(u);
                        subsJobsArray.push(JobTypeItem.find({ _id: u }))
                    })
                    return Promise.all(subsJobsArray);
                })
                .then(result => {
                    console.log(result);
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
exports.subscribe_all_job_types = (req, res) =>{

    JobTypeItem.find()
        .exec()
        .then(jobTyps => {
            var jobTypeArry = new Array();
            jobTyps.forEach(element =>{
                jobTypeArry.push(element._id);
            })
            var subscribeJobType = new SubscribeJobTypes({
                userId: req.user.userId,
                jobType: jobTypeArry
            })
            subscribeJobType.save()
        
            res.status(201).json({
                message: 'Job type subscription created',
            });
           
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


            if (subscribedResult.length > 0) {
                var subscribeJobTypeArry = [];
                var tempArray = [];
                subscribeJobTypeArry = subscribedResult[0].jobType;
                // console.log(jobTypeArry);

                jobTypeArry.forEach(jobType => {
                    if (subscribeJobTypeArry.indexOf(jobType) == -1) {
                        subscribeJobTypeArry.push(jobType)
                    }
                })
                subscribeJobTypeArry.slice(0).forEach(jobType =>{
                    if(jobTypeArry.indexOf(jobType) == -1){
                       var index = subscribeJobTypeArry.indexOf(jobType)
                       subscribeJobTypeArry.splice(index, 1);
                    }
                })
                SubscribeJobTypes.updateOne({ userId: req.user.userId },
                    {
                        $set: {
                            jobType: subscribeJobTypeArry
                        }
                    })
                    .exec()
                    .then(result => {
                        res.status(200).json({
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
            else {
                var subscribeJobType = new SubscribeJobTypes({
                    userId: req.user.userId,
                    jobType: jobTypeArry
                })
                subscribeJobType.save()

                res.status(201).json({
                    message: 'Job type subscription created',
                });

            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: err.message
            });
        })

}


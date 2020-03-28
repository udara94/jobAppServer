const Notification = require('../../models/Notification');
const NotificationList = require('../../models/NotificationList');
const SubsJobs = require('../../models/SubscribedJobType')
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


exports.get_all_notifications = (req, res) => {

    const limit = Math.max(0, req.query.limit)
    const offset = Math.max(0, req.query.offset)
    var isSubsJobs = false;

    SubsJobs.countDocuments({userId: req.user.userId})
    .then(count =>{
        if(count > 0){
            SubsJobs.find({ userId: req.user.userId })
            .exec()
            .then(user => {
                var jobTypeArry = new Array();
                var notificationArray = [];
                
                if(user != null && user.length > 0){
                    if(user[0].jobType.length > 0){
                        isSubsJobs = true
                        jobTypeArry = user[0].jobType
                    }
                }
                jobTypeArry.forEach(function (u) {
                    notificationArray.push(Notification.find({jobType:u})
                    .sort({postedDate: -1})
                    .limit(limit)
                    .skip(offset)
                    .exec());
                   
                })
                return Promise.all(notificationArray);
            })
            .then(result =>{
                if(isSubsJobs){
                    var resultArray = [];
                    result.forEach(element=>{
                       element.forEach(u =>{
                        resultArray.push(u);
                       })
                    })
                   
                const notificationList = new NotificationList({
                    notificationList: resultArray,
                });
                    res.status(200).json(notificationList);
                }else{
                        Notification.find()
                        .sort({postedDate: -1})
                        .limit(limit)
                        .skip(offset)
                        .exec()
                        .then(result =>{
                            const notificationList = new NotificationList({
                                notificationList: result,
                            });

                            res.status(200).json(notificationList);
                        })
                }
           
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    message: err.message
                });
            })
        }
        else{
            Notification.find()
            .sort({postedDate: -1})
            .limit(limit)
            .skip(offset)
            .exec()
            .then(result =>{
                const notificationList = new NotificationList({
                    notificationList: result,
                });
                res.status(200).json(notificationList); 
            })
        }
    })
}

exports.add_notification = (res) => {
    const notification = new Notification({
        jobId: res._id,
        jobType: res.jobType,
        employer: res.employer,
        jobRole:res.jobRole,
        notification: res.employer+" posted new job vacancy",
        imgUrl: res.imgUrl
    })
    notification.save()
        .then(result => {
            return;
        })
}
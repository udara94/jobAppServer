const Notification = require('../../models/Notification');
const NotificationList = require('../../models/NotificationList');
const SubsJobs = require('../../models/SubscribedJobType')
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


exports.get_all_notifications = (req, res) => {

    // const limit = Math.max(0, req.query.limit)
    // const offset = Math.max(0, req.query.offset)

    // Notification.find()
    //     .limit(limit)
    //     .skip(offset)
    //     .exec()
    //     .then(notification => {

    //         const notificationList = new NotificationList({
    //             notificationList: notification,
    //         });
    //         res.status(200).json(notificationList);
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         res.status(500).json({
    //             message: err.message
    //         });
    //     })
    // console.log(req.user.userId);
    SubsJobs.countDocuments({userId: req.user.userId})
    .then(count =>{
        console.log(count);
        if(count > 0){
            SubsJobs.find({ userId: req.user.userId })
            .exec()
            .then(user => {
                var jobTypeArry = new Array();
                var notificationArray = [];
                // console.log(user);
                user.forEach(element =>{
                    jobTypeArry.push(element.jobType);
                })
    
                jobTypeArry.forEach(function (u) {
                    notificationArray.push(Notification.find({jobType:u}));
                   
                })
                return Promise.all(notificationArray);
            })
            .then(result =>{
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
        notification: "New job added"
    })
    notification.save()
        .then(result => {
            return;
        })
}
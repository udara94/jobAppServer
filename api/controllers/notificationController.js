const Notification = require('../../models/Notification');
const NotificationList = require('../../models/NotificationList');


exports.get_all_notifications = (req, res) => {

    const limit = Math.max(0, req.query.limit)
    const offset = Math.max(0, req.query.offset)

    Notification.find()
        .limit(limit)
        .skip(offset)
        .exec()
        .then(notification => {

            const notificationList = new NotificationList({
                notificationList: notification,
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

exports.add_notification = (res) => {
    const notification = new Notification({
        jobId: res._id,
        notification: "New job added"
    })
    notification.save()
    .then(result =>{
        return;
    })
}

const SubscribeJobTypes = require('../models/SubscribedJobType')
const Fcm = require('../api/controllers/fcmController');
const FcmTemp = require('../models/FcmTemp');

module.exports = {
  create_activity: function (result) {
    
    SubscribeJobTypes.find()
    .exec()
    .then(subsResult => {

      subsResult.forEach(element =>{
        var jobTypeArry = new Array();
         jobTypeArry = element.jobType;
        
         if(jobTypeArry.indexOf(result.jobType) >= 0){
          //console.log(element.userId);
          Fcm.trigerNotifications(element.userId, result);
         }
      })

      FcmTemp.find()
        .exec()
        .then(tempTokens => {
          var tempTokenList = []
          tempTokens.forEach((eachToken) => {
            if (eachToken.fcmtoken)
              tempTokenList.push(eachToken.fcmtoken)
          });

          if (tempTokenList && tempTokenList.length > 0) {
            Fcm.tigerToAll(tempTokenList, result);
          }
        })
        .catch(err => {
          console.log(err);
        });

    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: err.message
      });
    })
  },
}

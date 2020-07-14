const functions = require('firebase-functions');
const admin = require('firebase-admin');


admin.initializeApp(functions.config().firebase);

exports.updateDealStatus = functions.https.onRequest((req, res) => {

 // Update the Deal in Cloud Firestore using the Firebase Admin SDK
const body = req.body;
const updateDeal = admin.firestore().collection('Deals')
  .doc(body.hs_deal_id)
  .update({
    deal_stage: body.deal_stage,
    update_date: body.update_date,
    deal_value: body.deal_value,
    deal_name: body.deal_name
    })
    .then( function(){
      res.send("Deal Updated Success")
    })
    .catch(error => { 
        console.log(error)
        res.status(500).send(error)
      })
});


const functions = require('firebase-functions');
const admin = require('firebase-admin');


admin.initializeApp(functions.config().firebase);

exports.updateDealStatus = functions.https.onRequest((req, res) => {

  // Update the Deal in Cloud Firestore using the Firebase Admin SDK
  const updateDeal = await admin.firestore().collection('Deals')
  .doc(req.DEALID)
  .update({
    deal_stage: "",
    update_date: "" 
    });
  
  // Send back a message that we've succesfully udpdated the deal 
  res.json({result: `Message with ID: ${writeResult.id} added.`});

});


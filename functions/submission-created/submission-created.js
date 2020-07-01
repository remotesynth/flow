const admin = require('firebase-admin')
const serviceAccount = require('../flowServiceAcc.json')

admin.initializeApp({

  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://flow-br.firebaseio.com"
})

const db = admin.firestore()

exports.handler = async (event, context, callback) => {
  const body = JSON.parse(event.body).payload;
  const data = body.data;
  const timestamp = admin.firestore.FieldValue.serverTimestamp();

  await db.collection('Leads').add({
    "firstName": data.firstName, 
    "lastName": data.lastName, 
    "email": data.email, 
    "phone": data.phone, 
    "cnpj": data.cnpj, 
    "ip": data.ip, 
    "user_agent": data.user_agent, 
    "created": timestamp    
  }, function(error) {
    if (error) {
      console.log('failed')
      return callback(null, {
        statusCode: error.status,
        body: JSON.stringify({
          message: error.message,
          error: error,
        })
      })
    }
    console.log('saved')
    return callback(null, {
      statusCode: 200,
      body: "Beep, boop, you just got serverless."
    })
  })
}

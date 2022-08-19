const functions = require("firebase-functions");
const sql = require('mssql')
const sgMail = require ('@sendgrid/mail');
const port = 1433


exports.writeToDB = functions.runWith({secrets:['SQL_USER','SQL_SERVER','SQL_PASSWORD','SENDGRID_API_KEY']}).auth.user().onCreate((user) => {
 sgMail.setApiKey(process.env.SENDGRID_API_KEY)
 sendEmail('otto_281@hotmail.com','Wohoo! Montelo new user signup!',`User details: \n email: ${user.email} \n name: ${user.displayName} \n uid: ${user.uid}`)

})


sendEmail = (recipient,emailSubject,body) => {
    console.log('Sending Email...');
    const msg = {
        to: recipient, // Change to your recipient
        from: 'info@montelo.com.au', // Change to your verified sender
        subject: emailSubject,
        text: body,
      }
      sgMail
      .send(msg)
      .then(() => {
        
        console.log('Email sent')
        return 'Email Sent'
      })
      .catch((error) => {
        console.error(error)
        return error
      })
}

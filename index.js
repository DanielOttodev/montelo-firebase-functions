const functions = require("firebase-functions");
const sql = require('mssql')
const sgMail = require ('@sendgrid/mail');
const port = 1433


exports.writeToDB = functions.runWith({secrets:['SQL_USER','SQL_SERVER','SQL_PASSWORD','SENDGRID_API_KEY']}).auth.user().onCreate((user) => {
 sgMail.setApiKey(process.env.SENDGRID_API_KEY)
 
// Writes the user info to the main database
sql.on('error', err => {
    return err
})
sql.connect(`Server=${process.env.SQL_SERVER},${port};Database=montelo;User Id=${process.env.SQL_USER};Password=${process.env.SQL_PASSWORD};Encrypt=false`).then(pool => {
    // Query
    return pool.request()
       // .input('input_parameter', sql.Int, value)
        .query(`INSERT into Users VALUES ('${user.uid}','${user.email}','${user.displayName}','Doe','${user.phoneNumber}');`)
}).then(result => {
    sendEmail('otto_281@hotmail.com','Wohoo! Montelo new user signup!',`User details: \n email: ${user.email} \n name: ${user.displayName} \n uid: ${user.uid}`)
    return {status:200,message:'Added User',res: result}
}).catch(err => {
   return err
});
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

import { email_status_counter, METRIC_STATUS } from '../metrics/index.js'
import { createTransport } from 'nodemailer'

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// TODO: don't use credential in code. Retrieve them in a safer way
const email_user = 'your-email@gmail.com'
const email_password = 'your-gmail-password'
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// const transporter = nodemailer.createTransport({
const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: email_user,
    pass: email_password
  }
});

/**
 * 
 * @param {*} _to : email recipients. It can be a comma separated email addresses (eg. "email_one@email.com, email_two@email.com")
 * @param {*} _subject : subject of the email
 * @param {*} _text : email content
 */
export const sendEmail = async (_to, _subject, _text) => {
  try
  {
      let info = await transporter.sendMail({
        from: email_user,
        to: _to,
        subject: _subject,
        text: _text
      })

      console.log(`[email]: info.envelope: ${JSON.stringify(info.envelope, null, 2)}`)
      console.log(`[email]: info.messageId: ${info.messageId}`)
      console.log(`[email]: info.response: ${info.response}`)

      email_status_counter.inc({ status: METRIC_STATUS.SUCCESS });
      return Promise.resolve(true)
  }
  catch(error){
    console.error(`[email]: error. ${error}`);
    email_status_counter.inc({ status: METRIC_STATUS.ERROR });
    return Promise.resolve(false)
  }
}

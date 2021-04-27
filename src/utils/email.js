
import config from 'config'
import _ from 'lodash'
import { createTransport } from 'nodemailer'

import { email_status_counter, METRIC_STATUS } from '../metrics'

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// TODO: don't use credential in code. Retrieve them in a safer way
const email_password = 'tuaPassword'
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// CHANGE THIS TO USE DIFFERENT DOMAIN LIKE GOOGLE
const domain = config.transporter.outlook //config.transporter.gmail

const auth = {
  user: config.email,
  pass: email_password
}

const transport = Object.assign({}, _.cloneDeep(domain), { auth })

const transporter = createTransport(transport)

/**
 * 
 * @param {*} _to : email recipients. It can be a comma separated email addresses (eg. "email_one@email.com, email_two@email.com")
 * @param {*} _subject : subject of the email
 * @param {*} _text : email text content
 * @param {*} _html : html format content
 */
export const sendEmail = async (_to, _subject, _text, _html) => {
  try {
    let info = await transporter.sendMail({
      from: `Fantasta Team <${config.email}>`,
      to: _to,
      subject: _subject,
      text: _text,
      html: _html
    })

    // console.log(`[email]: info.envelope: ${JSON.stringify(info.envelope, null, 2)}`)
    // console.log(`[email]: info.messageId: ${info.messageId}`)
    // console.log(`[email]: info.response: ${info.response}`)

    email_status_counter.inc({ status: METRIC_STATUS.SUCCESS });
    return Promise.resolve()
  }
  catch (error) {
    console.error(`[email]: error. ${error}`);
    email_status_counter.inc({ status: METRIC_STATUS.ERROR });
    return Promise.reject(error)
  }
}

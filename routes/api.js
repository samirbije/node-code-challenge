const express = require('express');
const router = express.Router();
const moment = require('moment');
const MailerService = require('../service/MailerService');
const wrapAsync = require('../service/GlobalErrorHandlerService').wrapAsync;

// some mailer specific constant values
const sender = "do_not_reply@northpole.com";
const receiver = "samirbije@gmail.com"//"santa@northpole.com";
const subject = "Free text message";

// simple mail body custom template
const text_body = 
`Hello %{username}%
Address: %{address}%
Reqeusted Text:
%{text}%`;

// A test route to check server alive with data context
router.get(
  '/test',
  (req, res, next) => {
    let data = {
      "msg":"Server Alive",
      "code":"200",
      "data":req.app.locals.data
    }
    console.log("test::", data);
    res.json(data);
  }
)

// Route for receiving Mail message request
router.post(
  '/message',
  wrapAsync(async (req, res, next) => {
    let formdata = req.body;

    // a basic empty feilds check is done
    validateEmptyValue(formdata);

    // retrive the data from app context
    let serverdata = req.app.locals.data;

    // retrive form user if exist
    let user = getUserInfo(formdata, serverdata);
    //console.log("user", user)

    //throw error if user does not exist
    if(!user) {
      throw new Error("User not found!!");
    }

    let dateofbirth = user.profile.birthdate;
    
    if (!validateDate(dateofbirth)){
      throw new Error("User Over 10 years old!!");
    }

    let body = text_body
    .replace("%{username}%", user.username)
    .replace("%{address}%", user.profile.address)
    .replace("%{text}%", formdata.text);

    let mail_object = {
      "from" : sender,
      "to": receiver,
      "subject": subject,
      "text": body,
      "html": body
    };
    //console.log("m_obj", mail_object); DEBUG
    //sendMail(mail_object, res); // to process mail immediately on each request

    let task_queue = req.app.locals.queue;
    // add task to the queue stored in app context
    task_queue.enqueue(mail_object);
    res.json("Success");
  })
)

/// helper functions
/*
  Function that checks if the user refered 
  in the form exists.
  Returns the user with profile if exists
 */
let getUserInfo = (formdata, serverdata) => {
  formUser = formdata.username;
  matchUser = null;
  matchUser = serverdata.users[formUser]; // assuming username are unique

  if (matchUser) {
    matchUser.profile = serverdata.profiles[matchUser.uid];
  }
  return matchUser;
}

/* 
  Function to check if the dateofbirth is valid
  Only user who are less than 10 years are valid
*/
let validateDate = (dateofbirth) => {
  dateofbirth = moment(dateofbirth, 'YYYY/MM/DD');
  let now =  moment();

  let diff = now.diff(dateofbirth, 'years');
  
  // the user(child) should be less that 10 years
  if (diff < 10) {
    return true;
  }
  return false;
}

/* 
 Function to check if the required feilds
 in the form are not empty
 throws an error if any value is empty
*/
let validateEmptyValue = (form) => {
  if(form.username.trim() == "" || form.text.trim() == "" ) {
    throw new Error("Either username or text feild is blank");
  }
}

/*
  Function to send email and provide 
  response on success or failure
*/
let sendMail = (mail_object, res) => {
  let mailer = new MailerService();

  mailer.sendMail(mail_object).then(()=>{
    res.json("Success")
  }).catch((err)=>{
    console.log("POST Message Failed", err)
    res.status(500)
  });
}

module.exports = router;
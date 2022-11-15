const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const port = 3000;
const mailchimp = require("@mailchimp/mailchimp_marketing");


app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

let fin = mailchimp.setConfig({
  apiKey: "147b416138aae4530104b2e06247f9b2",
  server: "us21",
});

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/signup.html`);
});
app.post("/", (req, res) => {
  let firstName = req.body.first;
  let lastName = req.body.last;
  let email = req.body.email;

  // const listId = "75abbe797e";
  // const subscribingUser = {
  //   firstName: firstName,
  //   lastName: lastName,
  //   email: email,
  // };
  // async function adduser() {
  //   const response = await mailchimp.lists.addListMember(listId, {
  //     email_address: subscribingUser.email,
  //     status: "subscribed",
  //     merge_fields: {
  //       FNAME: subscribingUser.firstName,
  //       LNAME: subscribingUser.lastName,
  //     },
  //   });
  //   console.log(`Succesfully added conatact. contact id is ${response.detail}`);
  // }
  // adduser();
  let data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  let jsondata = JSON.stringify(data);
  let options = {
    url: `https://us21.api.mailchimp.com/3.0/lists/75abbe797e`,
    method: "POST",
    headers: {
      Authorization: "auth 147b416138aae4530104b2e06247f9b2-us21",
    },
    body: jsondata,
  };
  request(options, (error, response, body) => {
    if (error) {
      res.sendFile(`${__dirname}/failure.html`);
      
    }
    else {
      if (response.statusCode === 200) {
        res.sendFile(`${__dirname}/success.html`);
        
      } 
      else {
        res.sendFile(`${__dirname}/failure.html`);
      }
    }
  });
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});
app.listen(process.env.PORT||port, () => {
  console.log(`Server is running on port ${port}`);
});

//147b416138aae4530104b2e06247f9b2-us21

//75abbe797e.
// https://us21.api.mailchimp.com/3.0/lists/75abbe797e/members/5f8f56e0e78bc17b37dac16f5c300bfc/

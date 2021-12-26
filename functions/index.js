const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const request = require("request");
const crypto = require("crypto");
exports.test = functions.https.onRequest((req, res) => {
  const { name } = req.body;
  res.send(`Hello ${name}`);
});
exports.send = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    res.send("Hello");
  });
  const phoneNumber = req.body.phoneNum;
  let NCP_accessKey = "41hzvfNYAedKNMSCw5zj";

  // access key id (from portal or sub account)
  let NCP_secretKey = "avoGMaAXYsuaY0ZpA3aheAaR4KacVara3mj9ROlD";

  // secret key (from portal or sub account)
  let NCP_serviceID = "ncp:sms:kr:262735726740:attendance";
  if (req.body.userId === "MpANmUY3D") {
    NCP_accessKey = "Xo0rePPS8OOL0M2GPRpZ";
    NCP_secretKey = "tavxS7jaHbOwoJV9ub08gYvqGycknrUz6BSj0fnl";
    NCP_serviceID = "ncp:sms:kr:263170396434:attendance";
  }

  // sens serviceID
  const myPhoneNumber = req.body.myphone;

  const space = " "; // one space
  const newLine = "\n"; // new line
  const method = "POST"; // method

  const url = `https://sens.apigw.ntruss.com/sms/v2/services/${NCP_serviceID}/messages`;
  console.log({ url });
  // url (include query string)
  const url2 = `/sms/v2/services/${NCP_serviceID}/messages`;

  const timestamp = Date.now().toString(); // current timestamp (epoch)
  let message = [];
  let hmac = crypto.createHmac("sha256", NCP_secretKey);

  message.push(method);
  message.push(space);
  message.push(url2);
  message.push(newLine);
  message.push(timestamp);
  message.push(newLine);
  message.push(NCP_accessKey);
  const signature = hmac.update(message.join("")).digest("base64");

  request(
    {
      method: method,
      json: true,
      uri: url,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-ncp-iam-access-key": NCP_accessKey,
        "x-ncp-apigw-timestamp": timestamp,
        "x-ncp-apigw-signature-v2": signature.toString(),
      },
      body: {
        type: "SMS",
        contentType: "COMM",
        countryCode: "82",
        from: myPhoneNumber,
        content: req.body.message,
        messages: [
          {
            to: phoneNumber,
          },
        ],
      },
    },
    function (err, res, html) {
      if (err) console.log(err);
      console.log(html);
    }
  );
  // res.send("전송되었습니다!");
});
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const crypto = require('crypto')
const { JSEncrypt } = require('js-encrypt')
var axios = require('axios');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

function encrypt_rsa(plainText) {

  const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAquiugN6mW6EsNIxDAVtFovN1yGHEaQNybzkgmBp+hbgfS5knFsMcPMRNE1NqM6fOLwnJue43PouBAIkdvVNfg6sKMeJpg2Lc8LyXjtSr0xnOR0JFxwHrPQGxw33G0oKdi7wFlhZYQvCdNNe59dS2uKuYx0PKgVJlcrdZdwYqdOdUTFcbt1U2WFLfjLdS5wph0CiNxMyfSbSoQzmTKsMeg4QKRO/ZZCVLjoOdhJdpAgrUL3nnLu5w90BDJDtR0AJoAbX0gi0daIh/XqU3+XRbLTPaWmpkHjGFpiN5PtOxwLr2uFrqw9sGH3aLUfGCNGGsdZKipacF5GcncRrv5rUFcQIDAQAB
-----END PUBLIC KEY-----`
  var ciphertext = crypto.publicEncrypt(
    {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING
    }, 
    Buffer.from(plainText,'utf8')
)


  return ciphertext.toString('base64')

}

function stringFilter(text){

  let filtered_text= text.replaceAll('//','/')


   if (filtered_text.indexOf('//') == -1) { 
    return filtered_text
  }else{
    return stringFilter(filtered_text)
}
}


// defining the Express app
const app = express();
// defining an array to work as the database (temporary solution)


// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// defining an endpoint to return all ads
app.get('/', (req, res) => {
  res.send(ads);
});


app.post('/login', (req,res) => {
    let username = req.body.username
    let password  = req.body.password
    let OtherParams = `{"Password":"${password}","UserId":"${username}"}`
    let json_data ={"Uuid":"8f1605203f153258","Platform":"Android","Model":"Google Pixel 3a","Manufacturer":"Genymobile","DeviceToken":"","UserId":username,"OtherParams":encrypt_rsa(OtherParams),"isGAPSLite":"0","Channel":"GTWORLDv1.0","appVersion":"1.9.22","GLUserId":"","GLUsername":""}
    let burp0_headers = {"Origin": "http://localhost:8080", "Accept-Encoding": "gzip, deflate", "Accept-Language": "en-US,en;q=0.9", "User-Agent": "Mozilla/5.0 (Linux; Android 10; Google Pixel 3a Build/QQ1D.200105.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.186 Mobile Safari/537.36", "Content-Type": "application/json;charset=UTF-8", "Accept": "application/json, text/plain, */*", "Referer": "http://localhost:8080/index.html", "X-Requested-With": "com.gtbank.gtworldv1", "Connection": "close"}


    return axios.post("https://gtworld.gtbank.com/GTWorldApp/api/Authentication/login-enc",json_data,
    {headers:burp0_headers})
    .then(res2 => {
        return res.json({
                  response:JSON.parse(stringFilter(res2.data)),
                  OtherParams:encrypt_rsa(OtherParams)
                })
    })
})

// starting the server
app.listen(3001, () => {
  console.log('listening on port 3001');
});

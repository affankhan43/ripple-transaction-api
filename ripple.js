const express = require('express');
const RippleAPI = require('ripple-lib').RippleAPI
const crypto = require('crypto');
const bodyParser = require('body-parser')
const app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

  app.post('/sendMoney', function(req, res){
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip.substr(0, 7) == "::ffff:") {
      ip = ip.substr(7)
    }
    if(ip=='127.0.0.1'){
      var address1 = req.body.address1;
      var address2 = req.body.address2;
      const des_tag = req.body.des_tag;
      var privkey = req.body.privkey;
      var smount = req.body.smount;
      
      if(!address1 || !address2 || !des_tag || !privkey || !smount){
        res.send({'status' :false, 'message':'Fields Missing'});
      }
      else{
        const RippleAPI = require('ripple-lib').RippleAPI
        // TESTNET ADDRESS 1
        const ADDRESS_1 = address1
        const SECRET_1 = privkey
        // TESTNET ADDRESS 2
        const ADDRESS_2 = address2
        const instructions = {maxLedgerVersionOffset: 5}
        const currency = "XRP"
        const amount = smount
        const des_tags = des_tag
        const payment = {
          source: {
            address: ADDRESS_1,
            maxAmount: {
              value: amount,
              currency: currency
            }
          },
          destination: {
            address: ADDRESS_2,
            tag:des_tags,
            amount: {
              value: amount,
              currency: currency
            }
          }
        }
        const api = new RippleAPI({
          //server: 'wss://s1.ripple.com'                 // MAINNET
          server: 'wss://s.altnet.rippletest.net:51233'   // TESTNET
        })
        api.connect().then(function(response) {
          console.log(response)
          api.preparePayment(ADDRESS_1, payment, instructions).then(prepared => {
            const {signedTransaction, id} = api.sign(prepared.txJSON, SECRET_1)
            console.log(id)
            api.submit(signedTransaction).then(result => {
              res.send({'status' :false, 'message':result.resultCode})
              console.log(JSON.stringify(result, null, 2))
              api.disconnect()
            })
          })
        }).catch()
      }
    }
    else{
      res.send({'status' : 'error','message':'Unauthorized Request'});
    }
  });
app.listen(3000);
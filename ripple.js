const express = require('express');
const RippleAPI = require('ripple-lib').RippleAPI
const crypto = require('crypto');
const bodyParser = require('body-parser')
const WAValidator = require('wallet-address-validator');
const app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

  app.post('/ripple/sendMoney',async function(req, res){
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
        try{
          await api.connect().then(async function(msg){
            console.log("Conneted ...")
            try{
              await api.preparePayment(ADDRESS_1, payment, instructions).then(prepared => {
                const {signedTransaction, id} = api.sign(prepared.txJSON, SECRET_1)
                console.log(id)
                api.submit(signedTransaction).then(result=>{
                  console.log(JSON.stringify(result, null, 2))
                  api.disconnect()
                  if(result.resultCode == "tesSUCCESS"){
                    res.send({'status':true,'txid':result.tx_json.hash}) 
                  }
                  else{
                    res.send({'status':false,'message':"Transaction Failed"})
                  }  
                })
              })
            }catch(error){
              res.send({'status':false,'message':'Transaction error'});  
            }
          }).catch()
        }catch(error){
          res.send({'status':false,'message':'connection error'});
        }
      }
    }
    else{
      res.send({'status':false,'message':'Unauthorized Request'});
    }
  });
  app.post('/ripple/validateAddress',async function(req, res){
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip.substr(0, 7) == "::ffff:") {
      ip = ip.substr(7)
    }
    if(ip=='127.0.0.1'){
      var Vaddress = req.body.Vaddress;
      if(!Vaddress){
        res.send({'status' :false, 'message':'Fields Missing'});
      }
      else{
        var valid = WAValidator.validate(Vaddress, 'XRP');
        if(valid)
          res.send({'status':true,'valid':true});
        else
          res.send({'status':true,'valid':false});
      }
    }
    else{
      res.send({'status':false,'message':'Unauthorized Request'});
    }
  });
  app.post('/bitcoin/validateAddress',async function(req, res){
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip.substr(0, 7) == "::ffff:") {
      ip = ip.substr(7)
    }
    if(ip=='127.0.0.1'){
      var Vaddress = req.body.Vaddress;
      if(!Vaddress){
        res.send({'status' :false, 'message':'Fields Missing'});
      }
      else{
        var valid = WAValidator.validate(Vaddress, 'bitcoin');
        if(valid)
          res.send({'status':true,'valid':true});
        else
          res.send({'status':true,'valid':false});
      }
    }
    else{
      res.send({'status':false,'message':'Unauthorized Request'});
    }
  });
  app.post('/eth/validateAddress',async function(req, res){
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip.substr(0, 7) == "::ffff:") {
      ip = ip.substr(7)
    }
    if(ip=='127.0.0.1'){
      var Vaddress = req.body.Vaddress;
      if(!Vaddress){
        res.send({'status' :false, 'message':'Fields Missing'});
      }
      else{
        var valid = WAValidator.validate(Vaddress, 'ETH');
        if(valid)
          res.send({'status':true,'valid':true});
        else
          res.send({'status':true,'valid':false});
      }
    }
    else{
      res.send({'status':false,'message':'Unauthorized Request'});
    }
  });
  app.post('/komodo/validateAddress',async function(req, res){
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip.substr(0, 7) == "::ffff:") {
      ip = ip.substr(7)
    }
    if(ip=='127.0.0.1'){
      var Vaddress = req.body.Vaddress;
      if(!Vaddress){
        res.send({'status' :false, 'message':'Fields Missing'});
      }
      else{
        var valid = WAValidator.validate(Vaddress, 'komodo');
        if(valid)
          res.send({'status':true,'valid':true});
        else
          res.send({'status':true,'valid':false});
      }
    }
    else{
      res.send({'status':false,'message':'Unauthorized Request'});
    }
  });
app.listen(3000);
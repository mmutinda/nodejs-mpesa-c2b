var request = require('request');
var configs = require('./../config');



const mainController = {};
// Empty object

mainController.get = (req, res) => {
    res.send(" Nodejs is up and running.. ");
};

mainController.registerUrl = (req, res) => {

    //

    const consumer_key = configs.consumer_key;
    const consumer_secret = configs.consumer_secret;
    const url = configs.mpesa_token_url;

    let auth = "Basic " + new Buffer(consumer_key + ":" + consumer_secret).toString("base64");

    request(
        {
            url,
            headers: {
                "Authorization": auth
            }
        },
        function (error, response, body) {
            var results = {
                error: true,
                message: configs.error_message
            }
            if (error) {
                res.json(results);
                return;
            }

            let resParsed = JSON.parse(body);
          
            var oauth_token = resParsed.access_token,
                auth = "Bearer " + oauth_token;

            request(
                {
                    method: 'POST',
                    url: configs.mpesa_register_url,
                    headers: {
                        "Authorization": auth
                    },
                    json: {
                        "ShortCode": configs.shortcode,
                        "ResponseType": "Completed",
                        "ConfirmationURL": configs.mpesa_callback_url,
                        "ValidationURL": configs.mpesa_validation_url
                    }
                },
                function (error, response, body) {
                    if (error) {
                        res.json(results);
                        return;
                    }
                    // console.log(body);
                    res.json(body);
                }
            )

        }
    )



};

mainController.validate = (req, res) => {

    //



};

mainController.callback = (req, res) => {

    //



};

mainController.init_payment = (req, res) => {

    const amount  = req.body.amount;
    const phone_number  = req.body.phone_number;

    if(!amount || !phone_number)
    {

        res.json({error : true, message: "amount or phone number missing.."});
    }

    const processedPhone = "254" + phone_number.slice(-9);
    const consumer_key = configs.consumer_key;
    const consumer_secret = configs.consumer_secret;
    const url = configs.mpesa_token_url;

    let auth = "Basic " + new Buffer(consumer_key + ":" + consumer_secret).toString("base64");

    request(
        {
            url,
            headers: {
                "Authorization": auth
            }
        },
        function (error, response, body) {
            var results = {
                error: true,
                message: configs.error_message
            }
            if (error) {
                res.json(results);
                return;
            }
            //

            let resParsed = JSON.parse(body);
          
            var oauth_token = resParsed.access_token,
                auth = "Bearer " + oauth_token;

            var d = new Date();

            var month = d.getMonth().toString().length == 1 ?  `0${d.getMonth() + 1 }` : `${d.getMonth()}`;
        
            var timestamp = `${d.getFullYear()}${month }${d.getDay()}${d.getHours()}${d.getMinutes()}0000`
            //yyyymmddhhiiss

            console.log(timestamp);
            const json = {
                "BusinessShortCode": configs.shortcode,
                "Password": new Buffer(`${configs.shortcode}${configs.online_checkout_passkey}${timestamp}`).toString("base64"),
                "Timestamp": timestamp,
                "TransactionType": "CustomerPayBillOnline",
                "Amount": amount,
                "PartyA": processedPhone,
                "PartyB": configs.shortcode,
                "PhoneNumber": processedPhone,
                "CallBackURL": configs.mpesa_stkstatus_url,
                "AccountReference": "Test123", // TODO 
                "TransactionDesc": "Testing" // TODO 
            };

            request(
                {
                    method: 'POST',
                    url: configs.mpesa_stkpush_url,
                    headers: {
                        "Authorization": auth
                    },
                    json
                },
                function (error, response, body) {
                    if (error) {
                        res.json(results);
                        return;
                    }
                    res.json(body);
                }
            )
        })

};

module.exports = mainController;
var express  = require('express');

// Controller imports
var mainController = require('./controllers/mainController');


const routes = express();

// Basic routes
routes.get('/', mainController.get);
routes.get('/register_url', mainController.registerUrl);
routes.get('/validate', mainController.validate);
routes.get('/callback', mainController.callback);
routes.post('/init_payment', mainController.init_payment);


module.exports  =  routes;
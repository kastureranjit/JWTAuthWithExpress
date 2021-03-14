const serviceController = require('../controllers/service.controller');
const { body, param } = require('express-validator');
const { validate,authenticateJWT } = require('../utilities/helpers');


module.exports = (router) => {

    router.post('/jsonPatch', authenticateJWT,validate([
        //body('message').not().isEmpty().isString().trim().escape().withMessage("message body is required to sent message in slack"),
    ]),
    serviceController.jsonPatch);

    router.post('/getThumbnail', authenticateJWT, serviceController.getThumbnail)

    router.post('/createAddress', /* authenticateJWT, */ serviceController.createAddress);
   
}
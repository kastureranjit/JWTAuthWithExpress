const serviceRoute = require('./service.route');

module.exports = (router) => {
    serviceRoute(router);
    return router;
};

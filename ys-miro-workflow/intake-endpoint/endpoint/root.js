const debug = require('debug')('rootEndpoint');
function rootEndpoint(){
    return {
        version
    };
    function version(req, res) {
        debug('Request','version');
        const package = require('../package.json');
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(
            {
                app: package.name,
                version: package.version
            }));
    }
}
module.exports = rootEndpoint;
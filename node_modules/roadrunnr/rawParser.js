/**
 * Created by Sidhant Panda on 15/03/16.
 */

module.exports = {
  rawParser : function(req, res, next) {
    req.rawBody = '';
    req.setEncoding('utf8');

    req.on('data', function(chunk) {
      req.rawBody += chunk;
    });

    req.on('end', function() {
      req.rawBody = JSON.parse(req.rawBody);
      next();
    });
  }
};
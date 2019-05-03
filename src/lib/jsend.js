module.exports = createJsendHandler = (handler) => {
  return (event, context, callback) => {
    handler.handle(event, context, (err, resp) => {
      let response;
      let extraHeaders;
      if (err === null) {
        let { code, headers, body } = resp || {};
        response = {
          statusCode: code || 200,
          body: JSON.stringify({
            status: "success",
            ...body
          })
        };
        extraHeaders = headers;
      } else {
        //console.log(err);
        let code = 500;
        if (err.code) code = err.code;
        let message = err;
        if (err.message) message = err.message;

        response = {
          statusCode: code,
          body: JSON.stringify({
            status: "error",
            message: message
          })
        };
      }

      //CORS
      response.headers={
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        ...extraHeaders
      };

      callback(null, response);
    });
  }
}



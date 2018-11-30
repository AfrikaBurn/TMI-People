# express-body-parser-json-error

# install

```js
npm install --save express-body-parser-json-error
```

# usage

```js
var express = require('express');
var bodyParser = require('body-parser');
var bodyParserJsonError = require('express-body-parser-json-error');

var app = express();

app.use(bodyParser.json());

app.use(bodyParserJsonError());


app.post('/test', function (req, res) {

    res.json({result: 'ok'});

});

app.listen(8080);
```

on invalid json body to POST /test, got response

```json
400 Bad Request HTTP/1.1

{
    "error": {
        "message": "Invalid Json Body",
        "code": "invalid_json"
    }
}
```

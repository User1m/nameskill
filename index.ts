

// Allow this module to be reloaded by hotswap when changed
module.change_code = 1;

// var vui = require('vui-app');
// var app = new vui.app('nameskill');

var app = require('./bundle.js');

app.launch(function (req, res) {
    res
        .say("Welcome to your name skill. Tell me your name and I’ll repeat it back")
        .shouldEndSession(false)
        .send();
});

app.intent('NameIntent', {
    "slots": { "NAME": "LITERAL" }
    , "utterances": ["{My name is|my name's} {matt|bob|bill|jake|nancy|mary|jane|NAME}"]
}, function (req, res) {
    res
        .say(`You said your name is ${req.slot("NAME")}`)
        .shouldEndSession(false)
        .send();
});

export = app;

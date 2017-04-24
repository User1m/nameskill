# NameSkill

A cross platform skill that repeats your name

## Getting Started

Sample code written for video screencast demoing how to build cross platform Cortana & Alexa skills. 

### Prerequisites

This repo is best used in association with the [screencast series]().

### Installing

1. Clone repo `git clone https://github.com/User1m/nameskill`
 
2. run `npm install --development`

3. [Follow the rest of the video]()


## Running the tests

simply run `npm test`

### Tests break down

Bootstrap an express server instance:

```
describe('nameskill', function () {
    var server;
    var skill = require('../index.js');

    beforeEach(function () {
        var app = express();
        skill.express({
            expressApp: app,
            debug: true,
            checkCert: false
        });
        server = app.listen(3000);
    });

    afterEach(function () {
        server.close();
    });
```

Test response for invalid data:

```
    it('responds to invalid data', function () {
        return request(server)
            .post('/nameskill')
            .send({})
            .expect(200).then(function (response) {
                return expect(response.body).to.eql({
                    version: '1.0',
                    response: {
                        directives: [],
                        shouldEndSession: true,
                        outputSpeech: {
                            type: 'SSML',
                            ssml: '<speak>Error: not a valid request</speak>'
                        }
                    },
                    sessionAttributes: {}
                });
            });
    });

```

Test for launch intent:

```
    it('responds to a launch intent', function () {
        let intent = _.cloneDeep(requestTypes.launch);
        return request(server)
            .post('/nameskill')
            .send(intent)
            .expect(200).then(function (response) {
                let resp = response.body;
                let ssml = resp.response.outputSpeech.ssml;
                expect(resp.response.shouldEndSession).to.be.false;
                expect(ssml).to.eql(
                    "<speak>Welcome to your name skill. Tell me your name and I’ll repeat it back</speak>"
                );
            });
    });
```
   
Test defined intent:
   
```
    it('responds to a name intent', function () {
        let intent = _.cloneDeep(requestTypes.intent);
        intent.request.intent.name = "NameIntent";
        intent.request.intent.slots["NAME"] = {
            name: "NAME", value: "Claudius"
        }
        return request(server)
            .post('/nameskill')
            .send(intent)
            .expect(200).then(function (response) {
                let resp = response.body;
                let ssml = resp.response.outputSpeech.ssml;
                expect(resp.response.shouldEndSession).to.be.false;
                expect(ssml).to.eql(
                    "<speak>You said your name is Claudius</speak>"
                );
            });
    });
});
```

## Deployment
Deploy on either:

* [Azure Functions](https://azure.microsoft.com/en-us/services/functions/)
* AWS Lambda


## Built With

* [vui-app](http://github.com/user1m/vui-app) - The sdk used

## Authors

* **Claudius Mbemba** - *Initial work* - [User1m](https://github.com/user1m)


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details


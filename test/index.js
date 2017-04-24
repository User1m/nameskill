"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../typings/globals/mocha/index.d.ts" />
var express = require("express");
var _ = require("lodash");
var request = require("supertest");
var Chai = require("chai");
var expect = Chai.expect;
var requestTypes = {
    launch: {
        "version": "1.0",
        "session": {
            "new": true,
            "sessionId": "amzn1.echo-api.session.abeee1a7-aee0-41e6-8192-e6faaed9f5ef",
            "application": {
                "applicationId": "amzn1.echo-sdk-ams.app.mbembac"
            },
            "attributes": {},
            "user": {
                "userId": "amzn1.account.AM3B227HF3FAM1B261HK7FFM3A2"
            }
        },
        "request": {
            "type": "LaunchRequest",
            "requestId": "amzn1.echo-api.request.9cdaa4db-f20e-4c58-8d01-c75322d6c423",
            "timestamp": "2015-05-13T12:34:56Z"
        }
    },
    intent: {
        "version": "1.0",
        "session": {
            "new": false,
            "sessionId": "amzn1.echo-api.session.abeee1a7-aee0-41e6-8192-e6faaed9f5ef",
            "application": {
                "applicationId": "amzn1.echo-sdk-ams.app.mbembac"
            },
            "attributes": {},
            "user": {
                "userId": "amzn1.account.AM3B227HF3FAM1B261HK7FFM3A2"
            }
        },
        "request": {
            "type": "IntentRequest",
            "requestId": "amzn1.echo-api.request.6919844a-733e-4e89-893a-fdcb77e2ef0d",
            "timestamp": "2015-05-13T12:34:56Z",
            "intent": {
                "name": "",
                "slots": {}
            }
        }
    },
    sessionEnd: {
        "version": "1.0",
        "session": {
            "new": false,
            "sessionId": "amzn1.echo-api.session.abeee1a7-aee0-41e6-8192-e6faaed9f5ef",
            "application": {
                "applicationId": "amzn1.echo-sdk-ams.app.mbembac"
            },
            "attributes": {},
            "user": {
                "userId": "amzn1.account.AM3B227HF3FAM1B261HK7FFM3A2"
            }
        },
        "request": {
            "type": "SessionEndedRequest",
            "requestId": "amzn1.echo-api.request.d8c37cd6-0e1c-458e-8877-5bb4160bf1e1",
            "timestamp": "2015-05-13T12:34:56Z",
            "reason": "USER_INITIATED"
        }
    }
};
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
    it('responds to a launch intent', function () {
        var intent = _.cloneDeep(requestTypes.launch);
        return request(server)
            .post('/nameskill')
            .send(intent)
            .expect(200).then(function (response) {
            var resp = response.body;
            var ssml = resp.response.outputSpeech.ssml;
            expect(resp.response.shouldEndSession).to.be.false;
            expect(ssml).to.eql("<speak>Welcome to your name skill. Tell me your name and I’ll repeat it back</speak>");
        });
    });
    it('responds to a name intent', function () {
        var intent = _.cloneDeep(requestTypes.intent);
        intent.request.intent.name = "NameIntent";
        intent.request.intent.slots["NAME"] = {
            name: "NAME", value: "Claudius"
        };
        return request(server)
            .post('/nameskill')
            .send(intent)
            .expect(200).then(function (response) {
            var resp = response.body;
            var ssml = resp.response.outputSpeech.ssml;
            expect(resp.response.shouldEndSession).to.be.false;
            expect(ssml).to.eql("<speak>You said your name is Claudius</speak>");
        });
    });
});
//# sourceMappingURL=index.js.map
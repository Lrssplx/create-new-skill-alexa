 
const { getRequestType, getIntentName, getSlot, SkillBuilders} = require('ask-sdk-core');
const charactersMessages = require('./messages/charactersMessages.json');
const commonMessages = require('./messages/commonMessages.json');
const { getCharacter } = require('./util');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Bem vindo a sua primeira skill! Você pode encerrar a qualquer momento dizendo: pare ou pedir ajuda dizendo: ajuda. O que posso fazer por você?';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const GetCharacterIntent = {
    canHandle(handlerInput) {
        return getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && getIntentName(handlerInput.requestEnvelope) === 'GetCharacterIntent';
    },
    handle(handlerInput) {

        const { requestEnvelope } = handlerInput;
        
        let slot = getSlot(requestEnvelope, 'hero');
        
        let slotValue = getSlotValue(slot);
        
        const character = getCharacter(slotValue);

        const speakOutput = charactersMessages[character];
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const WhatsTheIntentAbout = {
    canHandle(handlerInput) {
        return getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && getIntentName(handlerInput.requestEnvelope) === 'WhatsTheIntentAbout';
    },
    handle(handlerInput) {
        const speakOutput = commonMessages.whatsIntentAbout;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const InfoAboutCharacters = {
    canHandle(handlerInput) {
        return getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && getIntentName(handlerInput.requestEnvelope) === 'InfoAboutCharacters';
    },
    handle(handlerInput) {
        const speakOutput = commonMessages.charactersInfo;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Como posso ajudar?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Até mais!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

 
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

 
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Desculpe, não entendi o que você disse. Podemos tentar novamente?`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

 
exports.handler = SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        GetCharacterIntent,
        InfoAboutCharacters,
        WhatsTheIntentAbout,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();

const getSlotValue = (slot) => {
    if (slot.resolutions && slot.resolutions.resolutionsPerAuthority.length) {
        for (let resolution of slot.resolutions.resolutionsPerAuthority) {
            if (resolution.status && resolution.status.code === 'ER_SUCCESS_MATCH') {
                return resolution.values[0].value.name;
            }
        }
    }
}

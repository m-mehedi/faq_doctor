const Alexa = require('ask-sdk-core');
const util = require('./util');

const {
    getAirData,
    putData,
    searchData
} = require('./app.js');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {
        await getAirData(handlerInput, 'Welcome','Name','General FAQS', 'Message');
        // const speakOutput = "Welcome to your SmartNurse's GPT3 based General FAQs about your procedure and clinic. How may I help you?";

        return handlerInput.responseBuilder
            // .speak(speakOutput)
            // .reprompt(speakOutput)
            .getResponse();
    }
};

const AddFAQAPIHandler = {
    canHandle(handlerInput) {
        return (Alexa.getRequestType(handlerInput.requestEnvelope) === 'Dialog.API.Invoked'
            && handlerInput.requestEnvelope.request.apiRequest.name === 'AddFAQ')
        || (Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AddFAQ') ;
    },
    async handle(handlerInput) {
        const apiRequest = handlerInput.requestEnvelope.request.apiRequest;
        let faq = apiRequest.slots.faq.value;
        let answer = apiRequest.slots.answer.value;
        let segment = apiRequest.slots.segment.value;
        let gpt = apiRequest.slots.gpt.value;
        let approval = apiRequest.slots.approval.value;
        const userId = Alexa.getUserId(handlerInput.requestEnvelope);
        
        // let faq = resolveEntity(apiRequest.slots, "faq");
        // let answer = resolveEntity(apiRequest.slots, "answer");
        // let segment = resolveEntity(apiRequest.slots, "segment");
        // let gpt = resolveEntity(apiRequest.slots, "gpt");
        
        const recommendationEntity = {};
        if (faq !== null && answer !== null && segment !== null) {
            const key = `${faq}-${answer}-${segment}`;
            console.log(key);
            recommendationEntity.faq = apiRequest.arguments.faq
            recommendationEntity.answer = apiRequest.arguments.answer
            recommendationEntity.segment = apiRequest.arguments.segment
            recommendationEntity.gpt = apiRequest.arguments.gpt;
            recommendationEntity.approval = apiRequest.arguments.approval;
            recommendationEntity.userId = apiRequest.arguments.userId;
            
            await putData(faq, answer, segment, gpt, approval, userId);
        }

        const response = buildSuccessApiResponse(recommendationEntity);
        console.log('AddFAQAPIHandler', JSON.stringify(response));

        return response;
    }
};

const GQAPIHandler = {
    canHandle(handlerInput) {
        return (Alexa.getRequestType(handlerInput.requestEnvelope) === 'Dialog.API.Invoked'
            && handlerInput.requestEnvelope.request.apiRequest.name === 'getQuery');
    },
    async handle(handlerInput) {
        const apiRequest = handlerInput.requestEnvelope.request.apiRequest;
        let faq = apiRequest.slots.faq.value;
        
        const recommendationEntity = {};
        recommendationEntity.faq = apiRequest.arguments.faq;

        const response = buildSuccessApiResponse(recommendationEntity);
        console.log('AddFAQAPIHandler', JSON.stringify(response));

        return response;
    }
};

const buildSuccessApiResponse = (returnEntity) => {
    return { apiResponse: returnEntity };
};

// *****************************************************************************
// Resolves slot value using Entity Resolution
const resolveEntity = function(resolvedEntity, slot) {

    //This is built in functionality with SDK Using Alexa's ER
    let erAuthorityResolution = resolvedEntity[slot].resolutions
        .resolutionsPerAuthority[0];
    let value = null;
    console.log('Entity Resolution: '+ erAuthorityResolution.status.code)

    if (erAuthorityResolution.status.code === 'ER_SUCCESS_MATCH') {
        value = erAuthorityResolution.values[0].value.name;
    }

    return value;
};


//Brush Teeth
const brushTeethHandler= {
    canHandle(handlerInput) {
        return (Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'brushTeeth') 
            || (Alexa.getRequestType(handlerInput.requestEnvelope) === 'Dialog.API.Invoked'
            && handlerInput.requestEnvelope.request.apiRequest.name === 'brushTeeth') ;
    },
    handle(handlerInput) {
        
    // let intentRequest = Alexa.getRequestType(handlerInput.requestEnvelope);
    // const updatedIntent = handlerInput.requestEnvelope.request.intent;
    // if (intentRequest.dialogState !== "COMPLETED"){
    //   return handlerInput.responseBuilder
    //           .addDelegateDirective(updatedIntent)
    //           .getResponse();
    // } else {
    //     // Once dialoState is completed, do your thing.
    //     return handlerInput.responseBuilder
    //           .speak(speechOutput)
    //           .reprompt(reprompt)
    //           .getResponse();
    // }

        return handlerInput.responseBuilder
            .speak('Yes. You may brush your teeth and swish with a small amount of water to rinse.')
            .reprompt('Yes. You may brush your teeth and swish with a small amount of water to rinse.')
             .withStandardCard('Yes. You may brush your teeth and swish with a small amount of water to rinse.')
            .getResponse();
    }
};

//drink alcohol
const drinkAlcoholHandler = {
    canHandle(handlerInput) {
        return (Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'drinkAlcohol')
            || (Alexa.getRequestType(handlerInput.requestEnvelope) === 'Dialog.API.Invoked'
            && handlerInput.requestEnvelope.request.apiRequest.name === 'drinkAlcohol');
    },
    handle(handlerInput) {
        

        return handlerInput.responseBuilder
            .speak('drinkAlcohol')
            .reprompt('you cannot drink any alcohol after 12PM midnight before the day of your procedure')
             .withStandardCard('you cannot drink any alcohol after 12PM midnight before the day of your procedure')
            .getResponse();
    }
};

//Smoke_Before_Procedure
const Smoke_Before_ProcedureHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'Smoke_Before_Procedure';
    },
    handle(handlerInput) {
       

        return handlerInput.responseBuilder
            .speak('You should not smoke after 12PM midnight before the day of your procedure')
            .reprompt('You should not smoke after 12PM midnight before the day of your procedure')
             .withStandardCard('You should not smoke after 12PM midnight before the day of your procedure')
            .getResponse();
    }
};



//should_i_not_wear
const should_i_not_wearHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'should_i_not_wear';
    },
    handle(handlerInput) {

        return handlerInput.responseBuilder
            .speak('Makeup, Nail Polish, Jewelry (including body jewelry)')
            .reprompt('Makeup, Nail Polish, Jewelry (including body jewelry)')
             .withStandardCard('Makeup, Nail Polish, Jewelry (including body jewelry)')
            .getResponse();
    }
};

//bringClothes
const bringClothesHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'bringClothes';
    },
    handle(handlerInput) {
        
        return handlerInput.responseBuilder
            .speak('Yes - Wear loose, casual, comfortable clothing to fit over dressings')
            .reprompt('Yes - Wear loose, casual, comfortable clothing to fit over dressings')
             .withStandardCard('Yes - Wear loose, casual, comfortable clothing to fit over dressings')
            .getResponse();
    }
};

//safeValuables
const safeValuablesHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'safeValuables';
    },
    handle(handlerInput) {
       
        return handlerInput.responseBuilder
            .speak('No – Please leave all your valuables at home')
            .reprompt('No – Please leave all your valuables at home')
             .withStandardCard('No – Please leave all your valuables at home')
            .getResponse();
    }
};

//medications
const medicationsHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'medications';
    },
    handle(handlerInput) {
        
        return handlerInput.responseBuilder
            .speak('Yes- You make take your medications with sips of water the morning of the procedure. For diabetics, please follow the instructions regarding dosing of diabetic medications provided by the provider. ')
             .reprompt('Yes- You make take your medications with sips of water the morning of the procedure. For diabetics, please follow the instructions regarding dosing of diabetic medications provided by the provider. ')
             .withStandardCard('Yes- You make take your medications with sips of water the morning of the procedure. For diabetics, please follow the instructions regarding dosing of diabetic medications provided by the provider. ')
            .getResponse();
    }
};


//dietPills
const dietPillsHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'dietPills';
    },
    handle(handlerInput) {

        return handlerInput.responseBuilder
            .speak('No – Please discontinue and confirm with your physician')
            .reprompt('No – Please discontinue and confirm with your physician')
             .withStandardCard('No – Please discontinue and confirm with your physician')
            .getResponse();
    }
};


//bringFood
const bringFoodHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'bringFood';
    },
    handle(handlerInput) {
        
        return handlerInput.responseBuilder
            .speak('No – please refer to post procedure food  guidelines')
            .reprompt('No – please refer to post procedure food  guidelines')
             .withStandardCard('No – please refer to post procedure food  guidelines')
            .getResponse();
    }
};

//visitors
const visitorsHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'visitors';
    },
    handle(handlerInput) {
 
        return handlerInput.responseBuilder
            .speak('Usually visitation is 12  hours after procedure')
            .reprompt('Usually visitation is 12  hours after procedure')
             .withStandardCard('Usually visitation is 12  hours after procedure')
            .getResponse();
    }
};

//rely on somebody
const relyONHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'relyON';
    },
    handle(handlerInput) {
       
        return handlerInput.responseBuilder
            .speak('It is advisable that you have someone with you for 24 hours post procedure.Talk to your physician before you head home after procedure.')
             .reprompt('It is advisable that you have someone with you for 24 hours post procedure. Talk to your physician before you head home after procedure.')
             .withStandardCard('It is advisable that you have someone with you for 24 hours post procedure ','Talk to your physician before you head home after procedure.')
            .getResponse();
    }
};



//dayProcedure
const dayProcedureHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'dayProcedure';
    },
    handle(handlerInput) {
       
        return handlerInput.responseBuilder
            .speak('Active Insurance cards, photo ID, Medicare or Medical Assistance information, numbers and addresses')
            .reprompt('Active Insurance cards, photo ID, Medicare or Medical Assistance information, numbers and addresses')
             .withStandardCard('Active Insurance cards, photo ID, Medicare or Medical Assistance information, numbers and addresses')
            .getResponse();
    }
};

//driveMyself
const driveMyselfHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'driveMyself';
    },
    handle(handlerInput) {
    
        return handlerInput.responseBuilder
            .speak('No - You cannot drive back home, and someone must be available to take you home or a taxi. ')
            .reprompt('No - You cannot drive back home, and someone must be available to take you home or a taxi. ')
             .withStandardCard('No - You cannot drive back home, and someone must be available to take you home or a taxi. ')
            .getResponse();
    }
};

//familyMember
const familyMemberHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'familyMember';
    },
    handle(handlerInput) {
        
        return handlerInput.responseBuilder
            .speak('Yes – A guardian must be with you at the procedure center all the time')
            .reprompt('Yes – A guardian must be with you at the procedure center all the time')
             .withStandardCard('Yes – A guardian must be with you at the procedure center all the time')
            .getResponse();
    }
};

//afterProcedure
const afterProcedureHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'afterProcedure';
    },
    handle(handlerInput) {
        
        return handlerInput.responseBuilder
            .speak('It’s normal to Have some blotting or sore throat or nausea for a short time after the procedure. If these persist for more than 1-2 days contact your doctor.')
             .reprompt('It’s normal to Have some blotting or sore throat or nausea for a short time after the procedure. If these persist for more than 1-2 days contact your doctor.')
             .withStandardCard('It’s normal to Have some blotting or sore throat or nausea for a short time after the procedure. If these persist for more than 1-2 days contact your doctor.')
            .getResponse();
            
    }
};




//old_medication
const old_medicationHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'old_medication';
    },
    handle(handlerInput) {
       
        return handlerInput.responseBuilder
            .speak('Resume your medications as before as per your schedule or as advised by your physician.')
            .reprompt('Resume your medications as before as per your schedule or as advised by your physician.')
             .withStandardCard('Resume your medications as before as per your schedule or as advised by your physician.')
            .getResponse();
    }
};


//emergency
const emergencyHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'emergency';
    },
    handle(handlerInput) {
        
        return handlerInput.responseBuilder
            .speak('Please click on emergency on app OR contact your physician or emergency care provider ')
            .reprompt('Please click on emergency on app OR contact your physician or emergency care provider ')
             .withStandardCard('Please click on emergency on app OR contact your physician or emergency care provider ')
            .getResponse();
    }
};

/**
 * FallbackIntentHandler - Handle all other requests to the skill
 *
 * @param handlerInput
 * @returns response
 *
 * See https://developer.amazon.com/en-US/docs/alexa/conversations/handle-api-calls.html
 */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name !== 'GetFavoriteColorApiHandler' && request.intent.name !== 'RecordColorApiHandler';
    },
    handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        console.log('In catch all intent handler. Intent invoked: ' + intentName);
        const speechOutput = "Hmm, I'm not sure. You can ask me your FAQ here.";

        return handlerInput.responseBuilder
            .speak(speechOutput)
            .reprompt(speechOutput)
            .getResponse();
    },
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};
// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
// *****************************************************************************
// These simple interceptors just log the incoming and outgoing request bodies to assist in debugging.

const LogRequestInterceptor = {
    process(handlerInput) {
        console.log(`REQUEST ENVELOPE = ${JSON.stringify(handlerInput.requestEnvelope)}`);
    },
};

const LogResponseInterceptor = {
    process(handlerInput, response) {
        console.log(`RESPONSE = ${JSON.stringify(response)}`);
    },
};
// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addErrorHandlers(ErrorHandler)
    .addRequestInterceptors(LogRequestInterceptor)
    .addResponseInterceptors(LogResponseInterceptor)
    .addRequestHandlers(
        LaunchRequestHandler,
        AddFAQAPIHandler,
        GQAPIHandler,
        brushTeethHandler,
        drinkAlcoholHandler,
        Smoke_Before_ProcedureHandler,
        should_i_not_wearHandler,
        bringClothesHandler,
        safeValuablesHandler,
        medicationsHandler,
        dietPillsHandler,
        bringFoodHandler,
        visitorsHandler,
        dayProcedureHandler,
        driveMyselfHandler,
        familyMemberHandler,
        afterProcedureHandler,
        emergencyHandler,
        relyONHandler,
        old_medicationHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler
    )
    .withCustomUserAgent('reference-skills/intro-to-alexa-conversations/v1')
    .lambda();

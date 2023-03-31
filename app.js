const dotenv = require('dotenv');
dotenv.config();
var Airtable = require('airtable');
var base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE);


const {
    supportsAPL,
    addAplIfSupported
} = require('./helper.js');

const APL_DOC = require('./json/apl_doc.json');

const getRanHex = size => {
    let result = [];
    let hexRef = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f','A','B','C','D','E','F'];
  
    for (let n = 0; n < size; n++) {
      result.push(hexRef[Math.floor(Math.random() * 16)]);
    }
    return result.join('');
  }
  
exports.getAirData = async (handlerInput, table, param1, param1v, out) => {
try{
    base(table).select({
        filterByFormula: `{${param1}} = "${param1v}"`,
        }).eachPage(function page(records, fetchNextPage) {
        records.forEach(function(record) {
        // console.log(record.get(`ID`), record.get(`Question`));
        let speakOutput = record.get(`${out}`);
        console.log('GET DATA: ' + speakOutput);
        
        if (!supportsAPL(handlerInput)) {
        handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            //  .withStandardCard(speakOutput)
            .getResponse();
                } else {
                    // Add visuals if supported
                    
                    handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .addDirective({
				type: 'Alexa.Presentation.APL.RenderDocument',
				document: APL_DOC,
				datasources:{
                  "staticData": {
                  "question": "Smart Nurse",
                  "answer": ''
                  }
                }
			})
            .getResponse();
            }

        
            
        });
        fetchNextPage();
        
        }
    );
    
} catch(err){
    console.log('Error occured: ' + err);
}
        
        // , function done(error) {
        //     console.log(`Error occured while reading Air Table Data.`);
        
        // }
};

const toSentenceCase = (str) => {
    return str.toLowerCase().charAt(0).toUpperCase() + str.slice(1);
}

exports.searchData = async (handlerInput, table, param1) => {

base(table).select(
    {
      maxRecords: 100,
      view: 'Grid view'
    }
  ).firstPage(function page(err, records)
    {
      if (err) { console.error(err); return;  }
      records.forEach(function(record) {
          if(record.get('Question') === toSentenceCase(param1))
          {
              let speakOutput = toSentenceCase(record.get('Help'));
            //   console.log('Searching ' + speakOutput);
              
              
                if (!supportsAPL(handlerInput)) {
                    return handlerInput.responseBuilder
                        .speak(speakOutput)
                        .reprompt(speakOutput)
                        .getResponse();
                } else {
                    // Add visuals if supported
                handlerInput.responseBuilder
                    .speak(speakOutput)
                    .addDirective({
    					type: 'Alexa.Presentation.APL.RenderDocument',
    					document: APL_DOC,
    					datasources:{
                          "staticData": {
                          "question": toSentenceCase(param1),
                          "answer": speakOutput
                          }
                        }
    				})
                    .reprompt(speakOutput)
                    .getResponse();
                }
                
          }
        });
      });
      
};

exports.putData = async (slotOne, slotTwo, slotThree, slotFour, slotFive, slotSix) => {
        const table = base(slotThree);
        
        const minifyRecord = (record) => {
            return {
                id: record.id,
                fields: record.fields,
            };
        };
        
        const createRecord = async (fields) => {
            const createdRecord = await table.create(fields);
            console.log(minifyRecord(createdRecord));
        };
        
        try{
            createRecord({
                Question: toSentenceCase(slotOne)+'?',
                Help: toSentenceCase(slotTwo),
                Type: slotThree,
                GPT4: slotFour,
                Approval: slotFive,
                recordID: 'rec' + getRanHex(13),
                UserID: slotSix
            }).catch(error => { throw error})
        
        } catch(err){
            console.log(err)
        }
        
}
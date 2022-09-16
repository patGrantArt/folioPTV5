

//FOLIO BUG FIXES
//long read - italics 
//long read line breaks
//fix timestamp bug
//add autorefresh to update from airtable function
// undefined showing up in empty title and pull quote boxes
// create function to handle pull quotes
//longread
//Set up git hub procedures
//Set up heroku deployment procedures




//SERVER - express.js basic server setup 
const express = require('express')
const app = express()
const port = 3000

//FILe HANDLING
const fs = require('fs')

//PATH  set current working directory to variable
require('process')
const homeDirectory = process.cwd();
const dataFilePath = homeDirectory+"/public/data.json";

//AIRTABLE CONFIG - hides private airtable api keys (env)
const Airtable = require('airtable')
const { all } = require('express/lib/application')
require('dotenv').config()
const KEY = process.env.PRIVATE_KEY
const BASE_ID = process.env.AIRTABLEBASE
const base = new Airtable({apiKey: KEY}).base(BASE_ID)


let masterDataSet = undefined;


async function goGetFromAirtable(){
    // pull data from the long form cards page
    const cardsData = await base('tblsWdjfSh745jrRI')
    .select({view: "Grid view"})
    .all()
    .then(records => {
        return records
    }).catch(err => {
        console.error(err)
    })
    // Pull data from the long form page
    const longFormData = await base('tblsUOsUd5CEtbHNY')
    .select({view: "Grid view"})
    .all()
    .then(records => {
        return records
    }).catch(err => {
        console.error(err)
    });
    let result = new Object;
    result.timeStamp = `last update from Airtable made at ${new Date}`;
    result.lfcards = cardsData;
    result.lfcopy = longFormData;
    return result;
}

async function updateAndSave(){
    console.log(`===== making data request to airtable `)
    masterDataSet = await goGetFromAirtable();
    sortedDataSet = await sortData(masterDataSet);
    console.log(sortedDataSet)
    console.log(`====== SUCCESS - handling datastream`)
    masterJSON = await JSON.stringify(sortedDataSet);
    console.log(`====== SUCCESS - saving to local file`)
    console.log()
    fs.writeFile(dataFilePath, masterJSON, function(err) {
    if (err) {
	    console.error(err);
        return err
    }});
    console.log(`====== Up to Date Data Pulled and saved`)
    return masterDataSet.timeStamp;
};
updateAndSave()


function sortData(object){
    console.log(`sorting data`);
    let result = new Object;
    result.timeStamp = object.timeStamp; 

    //sort long form cards
    result.lf_Cards = [];
    lfcardsArray = object.lfcards;
    lfcardsArray.forEach(element => {
        let cardID = element.fields.ID;
        let thisCard = new Object;
        thisCard.id = cardID;
        thisCard.fields = element.fields
        result.lf_Cards.push(thisCard);
    });
    //sort long form interviews
    result.lf_copy = [];
    lfintArray = object.lfcopy;
    lfintArray.forEach(element => {
        let cardID = element.fields.id;
        let thisCard = new Object;
        thisCard.id = cardID;
        thisCard.fields = element.fields
        result.lf_copy.push(thisCard);
    });
    console.log(`returning result Object: ${result}`)
    return result
}

//ROUTES and ROUTE HANDLING

//update request from client side
app.get('/update', (req, res) => {
        console.log(`Request for update made from client`)        
        //this function called below    
        async function myResponse() {
            console.log(`async function running`)
            let responseMessage = await updateAndSave();
            res.send(responseMessage);
            console.log(`=== UPDATE CONFIRMATION SENT! ===`)
            console.log(`sent: ${responseMessage}`);
        };
        //call the above function
        myResponse();
});

app.get('/local', (req, res) => {
    console.log(`local data request made`);
    res.sendFile(dataFilePath, function (err) {
        if (err) {
            console.log(err);            
        } else {
            console.log('==== success: Data Sent');
        }
    });
});




app.get('/card/:id', (req, res) => {
    console.log(`pulling all data associated with the card`);
    console.log(req.params)
})


// this sets the public folder to work as static web page
app.use(express.static('public'))

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

// app.get("/", (req, res)=> {
//     console.log(req)

//     res = 
// })
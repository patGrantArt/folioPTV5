console.log(`What up folio`);

//Global variables accessed by all functions
let data;
//pass word disable for devs
let pwDisable = true;


// higher order function initalises data and display
function init(){
    console.log("initialising...")
    console.log(`getting data`)
    getData('local');
    updateBuildLog();
    initEventListeners();
}
//event listeners
function listen(){
    console.log(`loaded and listening`);
    document.getElementById('pwInput').addEventListener("keypress", (e)=>{
        if(e.key==="Enter"){pwAuthenticate()};
    });        
    document.getElementById('updateButton').addEventListener('click', updateData)
    //password disabler
    pwDisable ? pwAuthenticate(): null;
}  
function pwAuthenticate(){
    let pwString = document.getElementById('pwInput').value;
    console.log(`Authenticating with: `+pwString);
    // here's where we make a http request to the server so we can hide the PW in a more sophisticated version
    if (pwString === "let me in" || pwDisable) {                         
        document.getElementById('pwLabel').innerText = "Hooray!";
        document.getElementById('pwLabel').classList = "greenType";
        //function to be called after timeout
        function pwTimey(){
            // === this is important higher order function called === 
            init();
            document.getElementById("pwInputBox").classList.add("noShow")
            document.getElementById("title").classList.replace("noShow", "show")
            document.getElementById("mainContainer").classList.replace("noShow", "show")
        };
        setTimeout(()=> pwTimey(), 1000);
    } else {
        document.getElementById('pwLabel').innerText = "nope!";
        document.getElementById('pwLabel').classList = "redType";
        //function to be called after timeout
        function pwTimey2(){
            console.log(`ping`);
            document.getElementById('pwLabel').innerText = "have another go...";
            document.getElementById('pwInput').value = "";
            document.getElementById('pwLabel').classList = "";
        }
        setTimeout(()=> pwTimey2(), 1500);
    }

};    

async function getData(instruction){
    console.log(`==== getData() is called with "${instruction}" argument`)
    let route = "/"+instruction;
    myResponse = await fetch(route);
    //console.log(myResponse)
    data = await myResponse.json();
    publish(data); 
};
async function updateData(event){
    console.log(`update data is called with instructions to: ${event.target.name}`)
    //get route information from the user event
    let instruction = event.target.name
    let route = "/"+instruction;
    //send fetch request
    let newStream = await fetch(route);
    //console.log(newStream)
    let responseString = await newStream.text();
    console.log("response recieved:")
    document.getElementById("updateLog").innerText = responseString;
    getData("local");
    publish(data); 
}
function publish(object){
    console.log(`==== publishing data`)
    dataSet = object;
    let longFormCards = dataSet.lf_Cards
    let cardContainer = document.getElementById("CardContainer");
    //clear existing cards
    cardContainer.innerHTML = "";
    longFormCards.forEach((card)=>{
        //console.log(`publishing card ${card.id}`);
        //create card element
        let idString = card.id
        let idArray = idString.split("_");
        //console.log(idArray)
        //console.table(card.fields);
        let thisCard = document.createElement("div")
        thisCard.id = card.fields.ID;
        thisCard.classList = "card"
        thisCard.classList.add(idArray[0]);
        thisCard.classList.add("card-med");
        thisCard.setAttribute("onclick","loadInterview(this.id);");
        //handle image
        let imagePath;
        if(card.fields.Attachments){
            //console.log(`image supplied`)
            imagePath = card.fields.Attachments[0].thumbnails.large.url;
            //console.log(imagePath);
        } else {
            //console.log(`no image yet bro`)
            imagePath = 'images/default1.png'
        }
        let thisImage = document.createElement("img");
        thisImage.classList = "card portrait";
        thisImage.setAttribute("src",imagePath);
        thisCard.appendChild(thisImage)
        //handle header
        let thisTitle = document.createElement('h1');
        thisTitle.innerText = card.fields.title;
        thisCard.appendChild(thisTitle) 
        //handle status tag
        let thisTag = document.createElement('p');
        let theStatus = card.fields.Status
        //console.log(theStatus)
        thisTag.classList = "tag"
        thisTag.classList.add(theStatus);
        thisTag.innerText = theStatus;
        thisCard.appendChild(thisTag);
        //append to container
        cardContainer.appendChild(thisCard); 
    })
    // ==================
    // == ENTITY CARDS == 
    let entContainer = document.getElementById("entitiesContainer")
    //clear existing cards
    entContainer.innerHTML = "";
    dataSet.ent_Cards.forEach((card)=>{
        //console.log(`publishing card ${card.id}`);
        //create card element
        let idString = card.id
        let idArray = idString.split("_");
        //console.log(idArray)
        //console.table(card.fields);
        let thisCard = document.createElement("div")
        thisCard.id = card.fields.ID;
        thisCard.classList = "card card-small"
        thisCard.classList.add(idArray[0]);
        thisCard.setAttribute("onclick","loadInterview(this.id);");
        //create card type tab
        console.table(card.fields);
        let thisTab = document.createElement('div');
        console.log(card.fields.cardType[0])
        thisTab.classList = `card-typeTab type-${card.fields.cardType[0]}`;
        let tabCopy = document.createElement('p');
        tabCopy.innerText = card.fields.cardType[0].replace("_", "").toUpperCase();
        thisTab.appendChild(tabCopy);
        thisCard.appendChild(thisTab);
        //handle image
        let imagePath;
        if(card.fields.Attachments){
            //console.log(`image supplied`)
            imagePath = card.fields.Attachments[0].thumbnails.large.url;
            //console.log(imagePath);
        } else {
            //console.log(`no image yet bro`)
            imagePath = 'images/default1.png'
        }
        let thisImage = document.createElement("img");
        thisImage.classList = "card portrait";
        thisImage.setAttribute("src",imagePath);
        thisCard.appendChild(thisImage)
        // //handle header
        let thisTitle = document.createElement('h1');
        thisTitle.innerText = card.fields.name;
        thisCard.appendChild(thisTitle) 
        //handle status tag
        let thisTag = document.createElement('p');
        let theStatus = card.fields.status
        //console.log(theStatus)
        thisTag.classList = "tag"
        thisTag.classList.add(theStatus);
        thisTag.innerText = theStatus;
        thisCard.appendChild(thisTag);
        //append to container
        entContainer.appendChild(thisCard); 
    });
    // ==================
    // == STORY CARDS == 
    // ==================

    let strContainer = document.getElementById("storiesContainer")
    //clear existing cards
    strContainer.innerHTML = "";
    //loop through the stories array creating a card for each
    dataSet.stories.forEach((card)=>{
        //skip this card if it's not marked for a card
        if (!card.fields.card) {return};
        //otherwise create card element
        let idString = card.id
        let idArray = idString.split("_");
        //console.log(idArray)
        //console.table(card.fields);
        let thisCard = document.createElement("div")
        thisCard.id = card.fields.id;
        thisCard.classList = "card card-small"
        thisCard.classList.add(idArray[0]);
        thisCard.setAttribute("onclick","examine(this.id);");
        //handle image
        let imagePath;
        if(card.fields.Attachments){
            //console.log(`image supplied`)
            imagePath = card.fields.Attachments[0].thumbnails.large.url;
            //console.log(imagePath);
        } else {
            //console.log(`no image yet bro`)
            imagePath = 'images/default1.png'
        }
        let thisImage = document.createElement("img");
        thisImage.classList = "card portrait";
        thisImage.setAttribute("src",imagePath);
        thisCard.appendChild(thisImage)
        // //handle header
        let thisTitle = document.createElement('h1');
        thisTitle.innerText = card.fields.name;
        thisCard.appendChild(thisTitle) 
        //handle status tag
        let thisTag = document.createElement('p');
        let theStatus = card.fields.status
        //console.log(theStatus)
        thisTag.classList = "tag"
        thisTag.classList.add(theStatus);
        thisTag.innerText = theStatus;
        thisCard.appendChild(thisTag);
        //append to container
        strContainer.appendChild(thisCard); 
    });

    // ==================
    // == PUBLICATION CARDS == 
    // ==================
    let pubsContainer = document.getElementById("pubsContainer")
    //clear existing cards
    pubsContainer.innerHTML = "";
    dataSet.publications.forEach(card =>{
        //console.log(card)
        //console.log(`publishing: ${card.fields.Name}`)
        //skip this card if it's not marked for a card
        //if (!card.fields.card) {return};
        //otherwise create card element
        let idString = card.id
        let idArray = idString.split("_");
        //console.log(idArray)
        //create card elelement
        let thisCard = document.createElement("div")
         thisCard.id = card.fields.id;
         thisCard.classList = "card card-small"
         thisCard.classList.add(idArray[0]);
         thisCard.setAttribute("onclick","examine(this.id);");
         //create card type tab
         let thisTab = document.createElement('div');
         console.log(card.fields.publication_type[0])
         thisTab.classList = `card-typeTab type-${card.fields.publication_type[0]}`;
         let tabCopy = document.createElement('p');
         tabCopy.innerText = card.fields.publication_type[0].toUpperCase();
         thisTab.appendChild(tabCopy);
         thisCard.appendChild(thisTab);
         //handle image if image attached
         let imagePath;
         if(card.fields.Attachments){
             imagePath = card.fields.Attachments[0].thumbnails.large.url;
         } else {            
            imagePath = 'images/ph_book_thumb.jpg'
         }
         let thisImage = document.createElement("img");
         thisImage.classList = "card portrait";
         thisImage.setAttribute("src",imagePath);
         thisCard.appendChild(thisImage)
         // handle card title header
         
         let thisTitle = document.createElement('h1');
         thisTitle.innerText = card.fields.Name;
         thisCard.appendChild(thisTitle) 
         //handle status tag
         let thisTag = document.createElement('p');
         let theStatus = card.fields.status
         //console.log(theStatus)
         thisTag.classList = "tag"
         thisTag.classList.add(theStatus);
         thisTag.innerText = theStatus;
         thisCard.appendChild(thisTag);
         //append to container
         pubsContainer.appendChild(thisCard); 
    })

    //update Timestamp on the Update Log
    document.getElementById("updateLog").innerText = dataSet.timeStamp;
};
function initEventListeners(){
    console.log("no event listeners to initialise")
}

function examine(idString){
    console.log(`looking closer at node: ${idString}`)
    let thisCard = document.getElementById(idString);
    thisCard.classList.replace("card-small", "card-focus");
    goGetSomeCards(idString);
}

function goGetSomeCards(idString){
    //here's where you put a http request to the node server 
    let theClickedCard = data.stories.find(item => item.id === idString);
    console.log(theClickedCard.fields.arrayOfLinks);
    
}
function loadInterview(idString){
    console.log(`retrieving the right interview data for ${idString}`)
    //console.log(idString);
    let theRightCard = data.lf_Cards.find(item => item.id === idString);
    //console.log(theRightCard);
    let arrayOfLinks = theRightCard.fields.copyLinks;
    let toPublish = [];
    arrayOfLinks.forEach((link)=>{
        //console.log(link);
        let theRightObject = data.stories.find(item=> item.id === link);
        toPublish.push(theRightObject);
    });
    //console.log(toPublish)
    prepareLongForm(toPublish)
    openLongForm();


}
// Longform functions
function prepareLongForm(obj){
    console.log(obj);
    //sort array of objects according to the order that they should appear
    obj.sort((a,b)=> (a.fields.order>b.fields.order)?1:-1);
    //set page variable to refer to the content box in the html markup
    let page = document.getElementById("longRead-content"); 
    page.classList = 'longRead-content'
    //loop through the content handling each by the story-type property
    obj.forEach((para) => {
        console.log(para.fields.story_type);
        //if the story type is a banner image handle it as an image
        if(para.fields.story_type[0] === 'img_banner'){
            let thisBanner = document.createElement('div');
            thisBanner.classList = "longRead-banner";
            let thisImage = document.createElement('img');
            thisImage.alt = para.fields.copy_rt;
            thisImage.src = para.fields.Attachments[0].url;
            thisBanner.appendChild(thisImage);
            let thisTitle = document.createElement('h1');
            thisTitle.innerText = para.fields.bigText
            page.appendChild(thisBanner);
            return;
        }
        //if the story type is a spot image handle it as a spot
        if (para.fields.story_type[0] === "img_spot"){
            console.log(`handling spot image`);
            return
        }
        if (para.fields.story_type[0] === "Intrv"){
            let rawText = para.fields.Copy_rt;
            let tidyText = tidyMyCopy(rawText);
            let headLine = para.fields.bigText;
            let pullQuote = para.fields.pullQuote;
            let chunk = document.createElement('div');
            chunk.classList = "longRead-copy";
            if (headLine) {
                let header = document.createElement('p')
                header.innerText = headLine;
                header.classList = "longRead-header";
                page.appendChild(header);
            }
            if (pullQuote) {
                console.log(`pull quote is: ${typeof(pullQuote)}`);
                let pull = document.createElement('p')
                pull.innerText = pullQuote;
                pull.classList = "longRead-pullQuote";
                page.appendChild(pull);
            }
            chunk.innerHTML = tidyText;
            page.appendChild(chunk);
            return;
        };    
    });

    
}
function openLongForm(){
    console.log(`opening Reader`)
    modal = document.getElementById("longRead-modal");
    modal.classList.replace('noShow', 'show');
}
function closeLongForm(){
    console.log(`opening Reader`)
    modal = document.getElementById("longRead-modal");
    modal.classList.replace('show', 'noShow');
    let page = document.getElementById("longRead-content"); 
    page.innerHTML = '';
}
// Password Functions


//this function parses Airtables variation on the Markdown language - Based on Randolph Perkins' medium post
function tidyMyCopy(longString){
    console.log(`tidying the copy - Parsing markdown to html`);
    const toHTML = longString
		.replace(/^### (.*$)/gim, '<h3>$1</h3>') // h3 tag
		.replace(/^## (.*$)/gim, '<h2>$1</h2>') // h2 tag
		.replace(/^# (.*$)/gim, '<h1>$1</h1>') // h1 tag
		.replace(/\*\*(.*)\*\*/gim, '<b>$1</b>') // bold text
		.replace(/\_(.{1,100})\_/gim, '<i>$1</i>') // italic text
        .replace(/(.*)\n\n/gim, '<p>$1</p>') //separate into pragraphs
	return toHTML.trim(); // using trim method to remove whitespace

    
}

//
function test(string){
    console.log("button clicked");
}

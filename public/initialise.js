console.log(`What up folio`);

//Global variables accessed by all functions
let data;
//pass word disable for devs
let pwDisable = true ;


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
        //console.table(card.fields);
        let thisTab = document.createElement('div');
        //console.log(card.fields.cardType[0])
        thisTab.classList = `card-typeTab type-${card.fields.cardType[0]}`;
        let tabCopy = document.createElement('p');
        tabCopy.innerText = card.fields.cardType[0].replace("_", "").toUpperCase();
        thisTab.appendChild(tabCopy);
        thisCard.appendChild(thisTab);
        //handle image
        let imagePath;
        // is there an image attachment?
        if(card.fields.Attachments){
            // if so create a path for the one attached
            imagePath = card.fields.Attachments[0].thumbnails.large.url;
        } else {
            //if not use a default image bassed on the card type
            imagePath = getImagePath(idArray[0]);
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
        //create card type tab
        let thisTab = document.createElement('div');
        //console.log(card.fields.publication_type[0])
        thisTab.classList = `card-typeTab type-${idArray[0]}`;
        let tabCopy = document.createElement('p');
        tabCopy.innerText = idArray[0].toUpperCase();
        thisTab.appendChild(tabCopy);
        thisCard.appendChild(thisTab);
        //handle image
        let imagePath;
        if(card.fields.Attachments){
            //console.log(`image supplied`)
            imagePath = card.fields.Attachments[0].thumbnails.large.url;
            //console.log(imagePath);
        } else {
            imagePath = getImagePath(idArray[0]);
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
         //console.log(card.fields.publication_type[0])
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
            imagePath = getImagePath(idArray[0]);
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
function getImagePath(classString){
    console.log(`getting a default image path for: ${classString}`);
    let numberOfImages;
    let randoPick;
    switch (classString){
        case "artist":
            numberOfImages = 3;
            randoPick = Math.floor(Math.random()*numberOfImages);
            return `images/folio_ph_artst${randoPick}.jpg`;
        case "interview":
            numberOfImages = 4;
            randoPick = Math.floor(Math.random()*numberOfImages);
            return `images/folio_ph_intrv${randoPick}.jpg`;
        case "institution":
            return "images/folio_ph_inst.jpg"; 
         case "artefact":
            return "images/folio_ph_artefact.jpg"; 
        case "event":
            return "images/folio_ph_evnt.jpg"; 
        case "webComic":
            return "images/folio_ph_web.jpg"; 
        case "book":
            return "images/folio_ph_book.jpg"; 
        case "anthology":
            return "images/folio_ph_anth.jpg"; 
        case "zine":
            return "images/folio_ph_zine.jpg";
        case "greatPanel":
            return "images/folio_ph_panel.jpg";                
    } 
}
//do I need to delete this?
function initEventListeners(){
    console.log("no event listeners to initialise")
}
function examine(idString){
    console.log(`looking closer at node: ${idString}`)
    let thisCard = document.getElementById(idString);
    //check whether the clicked card is already in-focus
    if (thisCard.classList.contains("card-focus")){
        //if so return this card to small size
        thisCard.classList.replace("card-focus", "card-small");
        let toRemove = thisCard.querySelector("#card-node-Container");
        thisCard.removeChild(toRemove);
        return
    } else {
        //check to see if there is already a card in focus
        let lastCard = document.querySelector(".card-focus");
        console.log(lastCard);
        if (lastCard){
            //if so, make it small again
            let cardToShrink = document.querySelector(".card-focus");
            let toRemove = cardToShrink.querySelector("#card-node-Container");
            console.log(toRemove);
            cardToShrink.removeChild(toRemove);
            cardToShrink.classList.replace("card-focus", "card-small")
        };
        //then bring the new clicked card into focus
        thisCard.classList.replace("card-small", "card-focus");
    }
    let cardCollection = goGetSomeCards(idString);
    //create a container for the nodes
    let nodeContainer = document.createElement("div");
    nodeContainer.id = "card-node-Container";
    nodeContainer.classList = "card-node-Container";
    //create 'related' title
    let titleBox = document.createElement("div");
    titleBox.classList = "grid-col-4";
    let thisCopy = document.createElement('h1');
    thisCopy.innerText = "Related:"
    titleBox.appendChild(thisCopy);
    nodeContainer.appendChild(titleBox);
    //create a node for each link
    cardCollection.forEach(card => {
        let node = document.createElement('div');
        node.classList = "card card-node";
        let thisTitle = document.createElement('h2');
        thisTitle.innerText = card;
        node.appendChild(thisTitle);
        nodeContainer.appendChild(node);
    });
    thisCard.appendChild(nodeContainer);
}
function goGetSomeCards(idString){
    //here's where you put a http request to the node server 
    let theClickedCard = data.stories.find(item => item.id === idString);
    //assemble all it ids for the linked cards and concatenate them
    let result = theClickedCard.fields.id_array_ent.concat(theClickedCard.fields.id_array_pub);
    return result;
    
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
    console.log(`==================`)
    console.log(obj);
    //then set page variable to refer to the content box in the html markup
    let page = document.getElementById("longRead-content"); 
    page.classList = 'longRead-content'
    //sort array of content objects according to the order that they should appear
    obj.sort((a,b)=> (a.fields.order>b.fields.order)?1:-1);
    //loop through the content handling each by the story-type in the id string
    obj.forEach((element) => {  
        //console.log(`working on ${element.id}`)
        let idArray = element.id.split("_");
        let contentType = idArray[0];
        //if the story type is a banner image handle it as an image
        if(contentType === 'imgBanner'){
            let thisBanner = document.createElement('div');
            thisBanner.classList = "longRead-banner";
            let thisImage = document.createElement('img');
            console.table(element.fields);
            thisImage.alt = element.fields.image_alt;
            console.log(element.fields);
            if (!element.fields.Attachments){
                console.log("no image");
                thisImage.src = "images/placeholder_ls.jpg";
                let thisLabel = document.createElement("p");
                thisLabel.innerText = element.fields.image_alt;
                thisBanner.appendChild(thisImage);
                thisBanner.appendChild(thisLabel)
                
            } else {
                thisImage.src = element.fields.Attachments[0].url;
                thisBanner.appendChild(thisImage);
            }
            let thisTitle = document.createElement('h1');
            thisTitle.innerText = element.fields.bigText
            page.appendChild(thisBanner);
            return;
        }
        //if the story type is a spot image handle it as a spot
        if (contentType === "img_spot"){
            console.log(`handling spot image`);
            return
        }
        if (contentType === "interview"){
            let rawText = element.fields.Copy_rt;
            let tidyText = tidyMyCopy(rawText);
            let headLine = element.fields.bigText;
            let pullQuote = element.fields.pullQuote;
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
    //console.log(`tidying the copy - Parsing markdown to html`);
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


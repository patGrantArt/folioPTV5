let BuildLogObj = [
    {
        date: "16-11-22",
        updates: [
            "NEW: READ MORE button on story cards clicks-through directly to story",
            "TAGS: unique story ID on show in long form view (a bit buggy)",
            "RICH CONTENT: New Story types in Airtable for spot / video / slideshow"
            ]    
    },
    {
        date: "9-11-22",
        updates: [
            "TWEAKED: Longform Publisher algo",
            "NEW CONTENT: Gavin Than Interview is up "
            ]    
    },
    {
        date: "2-11-22",
        updates: [
            "NEW PICS: Added basic placeholder image",
            "UI: create basic 'examine' funtionality",
            "LINKS: Basic expression of 'associations' for cards"
            ]    
    },
    {
        date: "28-10-22",
        updates: [
            "FIX BUG: manage UNDEFINED in card loop",
            "LAYOUT: better use of grid layout",
            "NEW CARDS: CSS Make everything smaller and gentler",
            "BACK END: Added publications sheet",
            "NEW THING: Images in long form article enabled"
            ]    
    },

//FIX BUG: manage UNDEFINED in card loop,LAYOUT: better use of grid layout,NEW CARDS: CSS Make everything smaller and gentler,BACK END: Added publications sheet,NEW THING: Images in long form article enabled
    {
        date: "25-10-22",
        updates: [
            "NEW THING: very basic password barrier for live site.",
            "LAYOUT: Make cream box centre aligned on big screen with FLEX.",
            "LAYOUT: tweaked grid on dev widgets",
            "ADDED: workflow link widget"
            ]    
    },
    {
    date: "20-10-22",
    updates: [
        "NEW THING: This 'site update' widget tracks changes to most recent build.",
        "FIXED: 'Update from airtable' button now refreshes visible content automatically.",
        "TWEAKED: CSS of main DEV DASH page now responds to different screen sizes - default style settings for phone."
        ]    
    }

]
function updateBuildLog(){
    console.log(`updating build log`);
    BuildLogObj.forEach(element => {
        let thisRow = document.createElement("div");
        thisRow.classList.add(`buildLogRow`);
        thisRow.classList.add(`log-grid-container`);
        let thisLeft = document.createElement("div");
        //thisLeft.classList.add("buildLogLeft");
        thisLeft.innerHTML = element.date;
        thisRow.appendChild(thisLeft);
        let thisRight = document.createElement("ul")
        thisRight.classList.add("grid-col-2");
        element.updates.forEach( (string)=> {
            let thisItem = document.createElement('li');
            thisItem.innerText = string;
            thisRight.appendChild(thisItem);
        });
        thisRow.appendChild(thisRight);
        document.getElementById("buildLog").appendChild(thisRow);
    });


    //document.getElementById("buildLog").appendChild()
}

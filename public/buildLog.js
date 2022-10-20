let BuildLogObj = [{
    date: "THURSDAY 20-10-22",
    updates: [
        "- NEW THING: This 'site update' widget tracks changes to most recent build.",
        "- FIXED: 'Update from airtable' button now refreshes visible content automatically.",
        "- TWEAKED: CSS of main DEV DASH page now responds to different screen sizes - default style settings for phone."
        ]    
    }
]
function updateBuildLog(){
    console.log(`updating build log`);
    BuildLogObj.forEach(element => {
        //console.log(element.date);
        //console.log(element.updates);
        let thisRow = document.createElement("div");
        thisRow.classList.add(`buildLogRow`);
        thisRow.classList.add(`log-grid-container`);
        let thisLeft = document.createElement("div");
        //thisLeft.classList.add("buildLogLeft");
        console.log(thisLeft);
        thisLeft.innerHTML = element.date;
        thisRow.appendChild(thisLeft);
        let thisRight = document.createElement("ul")
        thisRight.classList.add("grid-col-2-row-1");
        console.log("===========")
        element.updates.forEach( (string)=> {
            console.log(string)
            let thisItem = document.createElement('li');
            thisItem.innerText = string;
            thisRight.appendChild(thisItem);
        });
        console.log("===========")
        thisRow.appendChild(thisRight);
        document.getElementById("buildLog").appendChild(thisRow);
    });


    //document.getElementById("buildLog").appendChild()
}

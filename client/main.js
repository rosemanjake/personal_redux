const domain = 'https://jakeroseman.com/'
//const domain = 'http://localhost:8080/'
let sectionmap

async function fetchSections(data = {}){
    const req = new Request(`${domain}d`)
    fetch(req)
        .then(response => response.json())
        .then((data) => {
            sectionmap = data
            let menubar = document.getElementById("menubar")
            Object.keys(data).forEach((section) =>{
                let currsection = document.createElement('div')
                currsection.innerText = section
                currsection.className = "menubutton"
                currsection.onclick = fetchEntries
                currsection.id = currsection.innerText
                menubar.appendChild(currsection)
            })
        })
}

async function fetchEntries(){
    let section = this.innerText
    const req = new Request(`${domain}d?s=${section}`)
    fetch(req)
        .then(response => response.json())
        .then((data) => {
            let currbutton = document.getElementById(section)
            data.forEach((entry) => {
                let currentry = document.createElement('div')
                currentry.innerText = entry
                currentry.className = "entrybutton"
                currentry.onclick = fetchContent
                currentry.id = currentry.innerText
                currbutton.appendChild(currentry)
                
            })
        })
}

// Generic function for getting text content from the server
// Can use a button, or the URL params
async function fetchContent(urlentry){
    let entry
    // Check if we're coming in with url params
    if (typeof urlentry == 'string'){
        entry = urlentry
    } else{
        entry = addDash(this.innerText)
    }
    
    // Fetch data and push to content div
    const req = new Request(`${domain}d?e=${entry}`)
    fetch(req)
        .then(response => response.json())
        .then((data) => {
            let contentbox = document.getElementById("content")
            contentbox.innerText = data.text
            window.history.pushState("object or string", "Title", `/r?e=${entry}`);
        })
}

function addDash(title){
    return title.replace(/[ ]/gms, "-")
}

function removeDash(title){
    return title.replace(/[-]/gms, " ")
}

// Get the url params on page load
function getParams(){
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString);
    let entry = urlParams.get("e")
    if (entry){
        fetchContent(entry)
    }
}
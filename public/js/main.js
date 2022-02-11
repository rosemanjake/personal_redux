//const domain = 'https://jakeroseman.com/'
const domain = 'http://localhost:8080/'
let sectionmap

function highlightSVG(id){
    let img = document.getElementById(id)
    img.src = img.src.replace(/\.svg/, "_hover.svg")
}

function removeHighlight(id){
    let img = document.getElementById(id)
    img.src = img.src.replace(/_hover\.svg/, ".svg")
}

async function fetchSections(data = {}){
    const req = new Request(`${domain}d`)
    fetch(req)
        .then(response => response.json())
        .then((data) => {
            sectionmap = data
            let menubar = document.getElementById("menubar")
            Object.keys(data).forEach((section) =>{
                // Overall container - will contain the drop down as well
                let menucolumn = document.createElement('div')
                menucolumn.className ="menucolumn"
                menucolumn.id = `${section}_column`

                // Primary row with drop down
                let menurow = document.createElement('div')
                menurow.className ="menurow"
                menurow.onclick = routeSection
                menurow.id = `${section}_row`
                menucolumn.appendChild(menurow)

                // Name of section in row
                let currsection = document.createElement('div')
                currsection.innerText = section
                currsection.className = "menubutton"
                currsection.id = currsection.innerText
                menurow.appendChild(currsection)

                // Add drop down arrow if there is one more than one item and it's not just home/about
                if (sectionmap[section].length > 0 && sectionmap[section][0] != section.toLowerCase()){
                    menurow.appendChild(makeArrow(section))
                }

                menubar.appendChild(menucolumn)
            })
        })
}

function makeArrow(section){
    let h = 10
    let w = 10
    
    let container = document.createElement('div')
    container.className = "arrowcontainer"

    let arrow = document.createElement('svg')
    arrow.width = w
    arrow.height = h
    arrow.className = "dropdownimg"
    
    let img = document.createElement('img')
    img.src = "svg/downarrow.svg"
    img.width = w
    img.height = h
    img.className = "dropdownarrow"
    img.id = `${section}_arrow`

    container.append(arrow)
    arrow.appendChild(img)
    return container
}

function routeSection(){
    let section = this.innerText

    switch(section){
        case "Home":
            fetchContent("home")
            break
        case "About":
            fetchContent("about")
            break
        case "Gallery":
            injectGallery()
            break
        default:
            let column = document.getElementById(`${section}_column`)
            if(column.childElementCount > 1){
                closeMenu(column, section)
            }
            else{
                fetchEntries(section)
            }
            break
    }
}

function closeMenu(column, section){
    for (let i = column.childElementCount - 1; i > 0; i--){
        let target = column.childNodes[i]
        if (target != column.firstChild){
            column.removeChild(target)
        }
    }

    let arrow = document.getElementById(`${section}_arrow`)
    arrow.src = "svg/downarrow.svg"
}

async function fetchEntries(section){
    const req = new Request(`${domain}d?s=${section}`)
    fetch(req)
        .then(response => response.json())
        .then((data) => {
            let currbutton = document.getElementById(`${section}_column`)
            data.forEach((entry) => {
                let currentry = document.createElement('div')
                currentry.innerText = entry
                currentry.className = "entrybutton"
                currentry.onclick = fetchContent
                currentry.id = currentry.innerText
                currbutton.appendChild(currentry)

                let arrow = document.getElementById(`${section}_arrow`)
                arrow.src = "svg/uparrow.svg"
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
            contentbox.innerHTML = data.text
            switch(entry){
                case "home":
                    window.history.pushState("object or string", "Title", "/");
                    break
                case "about":
                    window.history.pushState("object or string", "Title", "/about");
                    break
                default:
                    window.history.pushState("object or string", "Title", `/r?e=${entry}`);
                    break
            }
        })
}

function addDash(title){
    return title.replace(/[ ]/gms, "-")
}

function removeDash(title){
    return title.replace(/[-]/gms, " ")
}

// Get the url params on page load
function init(){
    // If the URL ends with /gallery, inject gallery
    let loc = window.location.href
    if (loc.match(/\/gallery$/)){
        injectGallery()
        return
    }
    else if (loc.match(/\/about$/)){
        fetchContent("about")
        return
    }

    // Otherwise, look for routing to a particular entry
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString);
    let entry = urlParams.get("e")
    if (entry){
        fetchContent(entry)
    }
    // Go to home if we find nothing
    else{
        fetchContent("Home")
    }
    
}
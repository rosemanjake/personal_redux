const domain = 'https://jakeroseman.com/'
//const domain = 'http://localhost:8080/'
let sectionmap
let opencolumn = []
let ismobile
let firstload = true;
let currhomeimg = 0
let allloaded = false

window.addEventListener('scroll', throttle(lazy, 100))

function throttle(callback, interval) {
    let enableCall = true;
  
    return function(...args) {
      if (!enableCall) return;
  
      enableCall = false;
      callback.apply(this, args);
      setTimeout(() => enableCall = true, interval);
    }
  }

// Lazy load images on the home page
function lazy(){
    // Check if we're on the home page
    if(!document.getElementById('greetingbox')){
        return
    }

    // How far above the image do we want to trigger loading the following image
    let earlyoffset = 1000 

    let homeimgs = document.getElementsByClassName("backgroundimg2")
    // How far have we already scrolled?
    let curroffset = window.pageYOffset + document.body.clientHeight

    // Loop through images and load where necessary
    for(i = 0; i < homeimgs.length; i++){
        let currimg = homeimgs[i]
        
        // Top of the image, plus the offset we set above
        let top = currimg.getBoundingClientRect().top + window.pageYOffset - earlyoffset
        let bottom = currimg.getBoundingClientRect().bottom + window.pageYOffset
        
        // We need to get the following image as that's really what we actually want to load
        let nextimg
        i < homeimgs.length - 1 ? nextimg = homeimgs[i + 1] : nextimg = null

        // If we have scrolled enough that the target region is in sight
        if (curroffset > top && curroffset < bottom){
            // Set src of current image
            currimg.style.backgroundImage = `url(images/home${i}.jpg)`
            
            // Only load the next image if there if is one to load
            // Only load one image when we first load the page
            if(nextimg && window.pageYOffset > 0){
                nextimg.style.backgroundImage = `url(images/home${i + 1}.jpg)`
            }
        }
      }
}

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
                menurow.addEventListener('click', routeSection)
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
    
    let container = document.createElement('div')
    container.className = "arrowcontainer"

    let arrow = document.createElement('svg')
    arrow.className = "dropdownimg"
    
    let img = document.createElement('img')
    img.src = "svg/downarrow.svg"
    img.className = "dropdownarrow"
    img.id = `${section}_arrow`

    container.append(arrow)
    arrow.appendChild(img)
    return container
}

function routeSection(sec){
    // I want it to be possible to call this function just by passing in a string
    // But also with a button press
    let section 
    if(typeof sec == 'string'){
        section = sec
    }
    else{
        section = this.innerText // this = button
    }
    
    switch(section){
        case "Home":
            fetchContent("home")
            break
        case "About":
            fetchContent("about")
            break
        case "Gallery":
            injectGallery()
            document.getElementById("maintitle").className = "maintitle"
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
    // TODO(This looks weird, so I'm commenting it out for now)
    // Close a menu that is already open
    /*if (opencolumn.length > 0){
        closeMenu(opencolumn[0], opencolumn[1])
    }*/

    const req = new Request(`${domain}d?s=${section}`)
    fetch(req)
        .then(response => response.json())
        .then((data) => {
            let currcolumn = document.getElementById(`${section}_column`)
            data.forEach((entry) => {
                let currentry = document.createElement('div')
                currentry.innerText = entry
                currentry.className = "entrybutton"
                currentry.addEventListener('click', fetchContent)
                currentry.id = currentry.innerText
                currcolumn.appendChild(currentry)

                let arrow = document.getElementById(`${section}_arrow`)
                arrow.src = "svg/uparrow.svg"

                opencolumn = [currcolumn, section]
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
        .then(async (data) => {
            let contentbox = document.getElementById("content")
            contentbox.className = "content"

            let thumbs = document.getElementById("thumbs")
            if(thumbs){thumbs.remove()}

            contentbox.innerHTML = data.text

            switch(entry){
                case "home":
                    window.history.pushState("object or string", "Title", "/");
                    contentbox.className = "homecontent"
                    let greetingbox = document.getElementById("greetingbox")
                    if (firstload){
                        greetingbox.addEventListener('transitionend', () =>{
                            document.getElementById("greetingbox").classList.remove("slowtrans")
                        })
                        await new Promise(r => setTimeout(r, 100)) 
                        greetingbox.className = "greetingboxloaded slowtrans"          
                        firstload = false
                    }
                    else{
                        greetingbox.className = "greetingboxloaded notrans"
                    }
                    lazy()
                    break
                case "about":
                    window.history.pushState("object or string", "Title", "/about");
                    break
                default:
                    window.history.pushState("object or string", "Title", `/?e=${entry}`);
                    break
            }
            reversehamburger()
        }).then(fastScroll())
        
        
}

function addDash(title){
    return title.replace(/[ ]/gms, "-")
}

function removeDash(title){
    return title.replace(/[-]/gms, " ")
}

// Get the url params on page load
async function init(){
    // Check if we're in mobile mode, track whether we are or not
    window.onresize = checkMobile;
    checkMobile()
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
    let image = urlParams.get("i")
    // Go to an entry if we have one in the URL
    if (entry){
        fetchContent(entry)
        return
    }
    // Go to an image if we have one in the URL
    else if (image){
        await injectGallery()
        displayImage(image)
        return
    }
    // Go to home if we find nothing
    else{
        fetchContent("home")
    }
}

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function hamburger(){
    // Close menu if it is open
    if(reversehamburger()){
        return
    }

    // Close gallery image if it's open
    let gallerycontainer = document.getElementById("gallerycontainer")
    if (gallerycontainer){
        endGrey()
    }

    // Get sidebar, back it up, and remove it from the maincontainer
    let sidebar = document.getElementById("sidebar")
    let mobilesidebar = sidebar
    sidebar.remove()

    // Change the class name and append to body
    mobilesidebar.className = "mobilesidebar"
    document.body.appendChild(mobilesidebar);  
}

// Closes the menu
// Returns true if there actually was a menu that it closed
function reversehamburger(){
    let sidebar = document.getElementsByClassName("mobilesidebar")[0]
    if (!sidebar){
        return false
    }

    // Create copy of mobile sidebar and restore original class
    sidebar.className = "sidebar"
    
    // Remove mobile sidebar and restore original to maincontainer
    sidebar.remove()
    let container = document.getElementById("maincontainer")
    container.insertBefore(sidebar, container.firstChild);

    return true
}

function fastScroll(){
    window.scrollTo(0, 0);
}

function smoothScroll(){
    let currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
    if (currentScroll > 0) {
         window.requestAnimationFrame(smoothScroll);
         window.scrollTo(0,currentScroll - (currentScroll/5));
    }
}

function checkMobile(){
    if(window.innerWidth < 1200){
        if (!ismobile){
            //console.log("transitioning to mobile")
        }
        ismobile = true
    }
    else{
        if (ismobile){
            //console.log("transitioning away from mobile")
            reversehamburger()
        }
        ismobile = false
    }
}

async function goHome(){
    let content = document.getElementById("content")
    content.className = "homecontent"

    const req = new Request(`${domain}d?e=home`)
    let res = await fetch(req)
    let html = await res.json()

    content.innerHTML = html.text
    return
}

async function toHomeBlock(blockname){
    let element = document.getElementById(`home${blockname.toLowerCase()}`)
    let offset = (document.body.clientHeight - element.scrollHeight) / 2
    const target = element.getBoundingClientRect().top + window.pageYOffset + (offset * -1);
    let delta = target - (document.body.clientHeight + window.pageYOffset)
    
    // Take longer to scroll when we go further
    if (delta < 1500){
        scrollToTimed(target, 1700)
    }
    else{
        scrollToTimed(target, 2700)
    }
}
    
// Route to a random entry in the given section
function randomEntry(section){
    let entries = sectionmap[section]
    let i = Math.floor((Math.random() * entries.length));
    fetchContent(entries[i])
}

// Scroll code courtesy of: https://stackoverflow.com/questions/50589137/scrollto-speed-duration-setting

// Element or Position to move + Time in ms (milliseconds)
function scrollToTimed(element, duration) {
    var e = document.documentElement;
    if(e.scrollTop===0){
        var t = e.scrollTop;
        ++e.scrollTop;
        e = t+1===e.scrollTop--?e:document.body;
    }
    scrollToC(e, e.scrollTop, element, duration);
}

// Element to move, element or px from, element or px to, time in ms to animate
function scrollToC(element, from, to, duration) {
    if (duration <= 0) return;
    if(typeof from === "object")from=from.offsetTop;
    if(typeof to === "object")to=to.offsetTop;
    // Choose one effect like easeInQuart
    scrollToX(element, from, to, 0, 1/duration, 20, easeOutCuaic);
}

function scrollToX(element, xFrom, xTo, t01, speed, step, motion) {
    if (t01 < 0 || t01 > 1 || speed<= 0) {
       element.scrollTop = xTo;
        return;
    }
    element.scrollTop = xFrom - (xFrom - xTo) * motion(t01);
    t01 += speed * step;
    
    setTimeout(function() {
        scrollToX(element, xFrom, xTo, t01, speed, step, motion);
    }, step);
}

/* Effects List */
function linearTween(t){
    return t;
}

function easeInQuad(t){
    return t*t;
}

function easeOutQuad(t){
    return -t*(t-2);
}

function easeInOutQuad(t){
    t/=0.5;
    if(t<1)return t*t/2;
    t--;
    return (t*(t-2)-1)/2;
}

function easeInCuaic(t){
    return t*t*t;
}

function easeOutCuaic(t){
    t--;
    return t*t*t+1;
}

function easeInOutCuaic(t){
    t/=0.5;
    if(t<1)return t*t*t/2;
    t-=2;
    return (t*t*t+2)/2;
}

function easeInQuart(t){
    return t*t*t*t;
}

function easeOutQuart(t){
    t--;
    return -(t*t*t*t-1);
}

function easeInOutQuart(t){
    t/=0.5;
    if(t<1)return 0.5*t*t*t*t;
    t-=2;
    return -(t*t*t*t-2)/2;
}

function easeInQuint(t){
    return t*t*t*t*t;
}

function easeOutQuint(t){
    t--;
    return t*t*t*t*t+1;
}

function easeInOutQuint(t){
    t/=0.5;
    if(t<1)return t*t*t*t*t/2;
    t-=2;
    return (t*t*t*t*t+2)/2;
}

function easeInSine(t){
    return -Math.cos(t/(Math.PI/2))+1;
}

function easeOutSine(t){
    return Math.sin(t/(Math.PI/2));
}

function easeInOutSine(t){
    return -(Math.cos(Math.PI*t)-1)/2;
}

function easeInExpo(t){
    return Math.pow(2,10*(t-1));
}

function easeOutExpo(t){
    return -Math.pow(2,-10*t)+1;
}

function easeInOutExpo(t){
    t/=0.5;
    if(t<1)return Math.pow(2,10*(t-1))/2;
    t--;
    return (-Math.pow(2,-10*t)+2)/2;
}

function easeInCirc(t){
    return -Math.sqrt(1-t*t)-1;
}

function easeOutCirc(t){
    t--;
    return Math.sqrt(1-t*t);
}

function easeInOutCirc(t){
    t/=0.5;
    if(t<1)return -(Math.sqrt(1-t*t)-1)/2;
    t-=2;
    return (Math.sqrt(1-t*t)+1)/2;
}
let imgs

async function injectGallery(){
    reversehamburger()
    window.history.pushState("object or string", "Title", "/gallery");

    let contentbox = document.getElementById("content")
    contentbox.className = "gallerycontent"
    contentbox.innerHTML = ""

    let spinner = makeSpinner()
    spinner.className = "bigspinner"
    contentbox.appendChild(spinner)

    const req = new Request(`${domain}g`)
    let res = await fetch(req)

    imgs = await res.json()

    let thumbs = await loadThumbs(imgs)

    spinner.remove()
    contentbox.appendChild(thumbs)

    // Seems like the browser needs just a little bit of time to load everything
    // If I don't set the time out, my fade in transition doesn't work with the class name change
    await new Promise(r => setTimeout(r, 500)); 
    thumbs.className = "thumbsloaded"
    await new Promise(r => setTimeout(r, 100)); 
    fastScroll()
}

async function loadThumbs(imgs){
    let thumbpaths = imgs.map((img) => img.replace("photos/", "thumbnails/"))
    let imgobjs = await Promise.all(thumbpaths.map(loadImage))
    let imgfrag = document.createDocumentFragment();
    
    imgobjs.forEach((currimg) => {
        currimg.className = "thumbnail"
        currimg.src = currimg.src.replace("photos", "thumbnails")
        currimg.addEventListener('click', function(){
            displayImage(this);
        });
        imgfrag.appendChild(currimg)
    });

    let thumbs = document.createElement('div')
    thumbs.id = 'thumbs'
    thumbs.className = 'thumbs'
    thumbs.appendChild(imgfrag)         

    return thumbs
}

//grey out background when displaying big image
function greyOut(){
    let grey = document.createElement("div");
    grey.id = "grey"
    // It's necessary to add the click event listener with a callback from animationend.
    grey.addEventListener('animationend', function(e){
        e.currentTarget.addEventListener('click', function(){
            endGrey();
         });
    }, {
        capture: false,
        once: true,
        passive: false
    });
    grey.className = "grey_active"
    document.body.appendChild(grey)
}

//kill grey out
function endGrey(){
    let grey = document.getElementById("grey");
    let gallerycontainer = document.getElementById("gallerycontainer")
    gallerycontainer.remove();
    grey.addEventListener('transitionend', function(e){
        e.currentTarget.remove();
    }, {
        capture: false,
        once: true,
        passive: false
    });
    grey.className = "grey_inactive";//should fade out here instead
}

const loadImage = src =>
new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
});

//Display big image
async function displayImage(target){
    //fade out background
    greyOut()

    let targetsrc

    //if we're passing in the path directly from the URL
    if (typeof target == "string"){
        targetsrc = "photos/" + target;
    }
    //If we're passing in the thumbnail img element
    else{     
        targetsrc = target.src.replace(/thumbnails/,"photos");
    }

    //make gallery container object
    let gallerycontainer = document.createElement("gallerycontainer");
    gallerycontainer.className = "gallerycontainer";
    gallerycontainer.id = "gallerycontainer";

    //generate forward button
    let forwardbutton = document.createElement("div")
    forwardbutton.innerHTML = ">";
    forwardbutton.classList.add("gallery_forwardbutton");
    forwardbutton.classList.add("gallery_button");
    forwardbutton.addEventListener('click', function(){
        changeimg(1);
    });

    //generate back button
    let backbutton = document.createElement("div")
    backbutton.innerHTML = "<";
    backbutton.classList.add("gallery_backbutton");
    backbutton.classList.add("gallery_button");
    backbutton.addEventListener('click', function(){
        changeimg(-1);
    });    


    // Get loading spinner
    let spinner = makeSpinner()
    gallerycontainer.appendChild(spinner)
    // insert gallery into body
    document.body.appendChild(gallerycontainer);
    // make image object async
    let bigimg = await loadGalleryImage(targetsrc)
    // Append image to container once we have it
    gallerycontainer.removeChild(gallerycontainer.firstChild)
    gallerycontainer.appendChild(bigimg);
    // append buttons to container
    gallerycontainer.appendChild(forwardbutton);
    gallerycontainer.insertBefore(backbutton,bigimg);
    
    //refresh URL
    newURL(bigimg.src)
}

function makeSpinner(){
    let spinner = document.createElement('div')
    spinner.className = "Spinner"
    spinner.innerHTML = "Loading..."
    return spinner
}

async function loadGalleryImage(src){
    let bigimg = await loadImage(src)
    bigimg.id = "bigimg"
    bigimg.className = "bigimg"
    return bigimg
}

// Push current image filename to the address bar
function newURL(image){
    let img = image.match(/(?<=photos\/).*/, "")[0]
    window.history.pushState("object or string", "Title", `/?i=${img}`);
}

//cycle through images using the buttons
async function changeimg(index){
    var mainimg = document.getElementById("bigimg")
    //var currimg = trimImgPath(mainimg)
    var currindex = imgs.indexOf(mainimg.src.replace(domain,""))
    var newindex = currindex + index
    if(newindex >= imgs.length){
        newindex = 0
    }
    else if(newindex < 0){
        newindex = imgs.length - 1
    }
    mainimg.remove()
    let spinner = makeSpinner()
    gallerycontainer.insertBefore(spinner, gallerycontainer.lastChild);
    gallerycontainer.firstChild.style.display = "none"
    gallerycontainer.lastChild.style.display = "none"

    let newimg = await loadGalleryImage(imgs[newindex])
    gallerycontainer.removeChild(spinner)
    gallerycontainer.insertBefore(newimg, gallerycontainer.lastChild);
    gallerycontainer.firstChild.style.display = "block"
    gallerycontainer.lastChild.style.display = "block"


    //refresh URL
    newURL(bigimg.src)
    
    //var button  = document.getElementById("gallerybutton")
    //newURL(button)//passing in the button so I can reuse logic
}

//reduce img path to just the filename
function trimImgPath(img){
    var currsrc = img.src
    var regex = /((?<=\/)[^\/]*\.jpg)/
    var currimg = currsrc.match(regex)[0]
    return currimg
}
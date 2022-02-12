let imgs

function injectGallery(){
    window.history.pushState("object or string", "Title", "/gallery");

    // Fetch data and push to content div
    const req = new Request(`${domain}g`)
    fetch(req)
        .then(response => response.json())
        .then((data) => {
            let contentbox = document.getElementById("content")
            contentbox.innerHTML = ""
            contentbox.className = "gallerycontent"

            let thumbs = document.createElement('div')
            thumbs.id = 'thumbs'
            thumbs.className = 'thumbs'

            imgs = data
            Array.from(data).forEach((img) => {
                let currimg = document.createElement('img')
                currimg.className = "thumbnail"
                currimg.src = img.replace("photos", "thumbnails")
                currimg.addEventListener('click', function(){
                    displayImage(this);
                 });
                thumbs.appendChild(currimg)         
            })

            contentbox.appendChild(thumbs)
        })
    }

//grey out background when displaying big image
function greyOut(){
    let grey = document.createElement("div");
    grey.id = "grey"
    grey.addEventListener('click', function(){
        endGrey();
     });
    grey.className = "grey_active"
    document.body.appendChild(grey)
}

function addEnd(e){
    e.currentTarget.addEventListener('click', function(){
        endGrey();
     });
}

//kill grey out
function endGrey(){
    let grey = document.getElementById("grey");
    let gallerycontainer = document.getElementById("gallerycontainer")
    gallerycontainer.remove();
    grey.addEventListener('transitionend', kill, {
        capture: false,
        once: true,
        passive: false
    });
    grey.className = "grey_inactive";//should fade out here instead
}

function kill(e) {
    e.currentTarget.remove();
}

//Display big image
function displayImage(target){
    //fade out background
    greyOut()

    //make image object
    let bigimg = document.createElement("img");
    bigimg.id = "bigimg";
    bigimg.className = "bigimg";
    
    //if we're passing in the path directly from the URL
    if (typeof target == "string"){
        bigimg.src = "photos/" + target;
    }
    //If we're passing in the thumbnail img element
    else{     
        bigimg.src = target.src.replace(/thumbnails/,"photos");
    }

    //make gallery container object
    let gallerycontainer = document.createElement("gallerycontainer");
    gallerycontainer.className = "gallerycontainer";
    gallerycontainer.id = "gallerycontainer";
    gallerycontainer.appendChild(bigimg);

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

    //append buttons to container
    gallerycontainer.appendChild(forwardbutton);
    gallerycontainer.insertBefore(backbutton,bigimg);

    //insert gallery into body
    document.body.appendChild(gallerycontainer);

    //refresh URL
    //let button  = document.getElementById("gallerybutton")
    //newURL(button)
}

//cycle through images using the buttons
function changeimg(index){
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
    mainimg.src = imgs[newindex]
    
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

//inject correct image into gallery loading from URL
function injectImage(queryString){
    const urlParams = new URLSearchParams(queryString)
    const category = urlParams.get('c')
    const targetimg = urlParams.get('i')

    var button = document.getElementById("gallerybutton")
    corebutton(button)//reusing logic here, but this is ugly

    //route to specific image if one is specified in the url
    if(category == "Gallery" && targetimg !== null){
        displayImage(targetimg)
    }

    newURL(button);
}
//Create a carousel when it is present in the content we are injecting
function carouselInit(){
    //Get carousel
    let carousel = document.getElementById("carousel");
    //Back out if it ain't there
    if (carousel == null){
        return;
    }
    
    //Kill all but first image, check if there is a portrait among them
    let carousel_imgs = document.getElementsByClassName("carouselfig")
    let containsportait
    for (let i = 0; i < carousel_imgs.length; i++){
        if (i !== 0){
            carousel_imgs[i].style.display = "none";
        }
        let img = carousel_imgs[i].firstChild
        if (img.height > img.width){
            containsportait = true
        } 
    }

    if (containsportait){
        for (let i = 0; i < carousel_imgs.length; i++){
            carousel_imgs[i].className = "carouselwportrait"
        }
    }

    //generate forward button
    let forwardbutton = document.createElement("div")
    forwardbutton.innerHTML = ">";
    forwardbutton.classList.add("carousel_forwardsbutton");
    forwardbutton.classList.add("carousel_button");
    forwardbutton.addEventListener('click', function(){
        changeCarouselImg(1);
    });

    //generate back button
    let backbutton = document.createElement("div")
    backbutton.innerHTML = "<";
    backbutton.classList.add("carousel_backbutton");
    backbutton.classList.add("carousel_button");
    backbutton.addEventListener('click', function(){
        changeCarouselImg(-1);
    });

    //append buttons to carousel
    carousel.appendChild(forwardbutton)
    carousel.insertBefore(backbutton, carousel_imgs[0])
}

/*
Example carousel syntax:
<div class="carousel" id="carousel">
    <figure class="carouselfig"><img class="carouselimg" src="images/headshot.jpg"><figurecaption class="articlecaption">hello</figurecaption></figure>
    <figure class="carouselfig"><img class="carouselimg" src="images/photo1.jpg"><figurecaption class="articlecaption">hi</figurecaption></figure>
    <figure class="carouselfig"><img class="carouselimg" src="images/caffeinequitter.jpg"><figurecaption class="articlecaption">gday</figurecaption></figure>
</div>  
*/

//cycle through images using the buttons
//Make this generic so we can use it for the carousel as well
function changeCarouselImg(index, targetimg){   
    //define mainimg/localimgs based on whether we are in a carousel or not
    let imgobjs = Array.from(document.getElementsByClassName("carouselfig"))

    //Do the cycling
    let currimg = getCarouselImg();
    let currindex = imgobjs.indexOf(currimg)
    let newindex = currindex + index
    if(newindex >= imgobjs.length){
        newindex = 0
    }
    else if(newindex < 0){
        newindex = imgobjs.length - 1
    }
    
    //hide current active image and display new one
    imgobjs[currindex].style.display = "none";
    imgobjs[newindex].style.display = "block";
}


//Returns the active image in the carousel
function getCarouselImg(){
    let carousel_imgs = document.getElementsByClassName("carouselfig")
    for (let i = 0; i < carousel_imgs.length; i++){
        if (carousel_imgs[i].style.display !== "none"){
            return carousel_imgs[i];
        }
    }
}

//return list of img sources
function getCarouselImgs(){
    let carousel_imgs = document.getElementsByClassName("carouselfig")
    //list of just the srcs
    let imglist = []

    //Add each src to the list and return it
    for (let i = 0; i < carousel_imgs.length; i++){
        imglist.push(trimImgPath(carousel_imgs[i]))
    }

    return imglist;
}
//Create a carousel when it is present in the content we are injecting
function carouselInit(){
    //Get carousel
    var carousel = document.getElementById("carousel");
    //Back out if it ain't there
    if (carousel == null){
        return;
    }
    
    //Kill all but first image
    var carousel_imgs = document.getElementsByClassName("carouselimg")
    for (var i = 0; i < carousel_imgs.length; i++){
        if (i !== 0){
            carousel_imgs[i].style.display = "none";
        }
    }

    //generate forward button
    var forwardbutton = document.createElement("div")
    forwardbutton.innerHTML = ">";
    forwardbutton.classList.add("carousel_forwardsbutton");
    forwardbutton.classList.add("carousel_button");
    forwardbutton.addEventListener('click', function(){
        changeCarouselImg(1);
    });

    //generate back button
    var backbutton = document.createElement("div")
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
    <img class="carouselimg" src="photo1.jpg">
    <img class="carouselimg" src="photo2.jpg">
    <img class="carouselimg" src="photo3.jpg">
    <img class="carouselimg" src="photo4.jpg">
</div>  
*/

//cycle through images using the buttons
//Make this generic so we can use it for the carousel as well
function changeCarouselImg(index, targetimg){   
    //define mainimg/localimgs based on whether we are in a carousel or not
    var activeimg = getCarouselImg();
    var imgsrcs = getCarouselImgs();
    var imgobjs = document.getElementsByClassName("carouselimg")

    //Do the cycling
    var currimg = trimImgPath(activeimg)
    var currindex = imgsrcs.indexOf(currimg)
    var newindex = currindex + index
    if(newindex >= imgsrcs.length){
        newindex = 0
    }
    else if(newindex < 0){
        newindex = imgsrcs.length - 1
    }
    
    //hide current active image and display new one
    imgobjs[currindex].style.display = "none";
    imgobjs[newindex].style.display = "block";
}


//Returns the active image in the carousel
function getCarouselImg(){
    var carousel_imgs = document.getElementsByClassName("carouselimg")
    for (var i = 0; i < carousel_imgs.length; i++){
        if (carousel_imgs[i].style.display !== "none"){
            return carousel_imgs[i];
        }
    }
}

//return list of img sources
function getCarouselImgs(){
    var carousel_imgs = document.getElementsByClassName("carouselimg")
    //list of just the srcs
    var imglist = []

    //Add each src to the list and return it
    for (var i = 0; i < carousel_imgs.length; i++){
        imglist.push(trimImgPath(carousel_imgs[i]))
    }

    return imglist;
}
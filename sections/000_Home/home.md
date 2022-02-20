<div class="backgroundimgcontainer" onload="lazy()">
    <!--<div class="backgroundimg" style="background-image:url(photos/1.jpg)"></div>-->
    <div class="backgroundimg" style="background-image:url(images/homemain.jpg)">
        <div class="greetingbox slowtrans" id="greetingbox">
            <div class="greetingtitle">JAKE ROSEMAN</div>
            <div class="hometitleline"></div>
            <div class="greetingsubbox">
                    <span onclick="toHomeBlock('software')" class="greetingsubtitle">SOFTWARE</span>  |  
                    <span onclick="toHomeBlock('writing')" class="greetingsubtitle">WRITING</span>  |  
                    <span onclick="toHomeBlock('photos')" class="greetingsubtitle">PHOTOGRAPHY</span>                
            </div>
            <div class="greetingtext">
            I am a writer, developer, and hobbyist photographer in London. It is my pleasure to use this space to share some of my personal work.  
            </div>
            <div onclick="toHomeBlock('contact')" class="homecontact">CONTACT</div>
        </div>
    <!--</div>-->
</div>

<div class="homeblock" id="homesoftware">
    <div class="homeblockcontainer">
        <div class="homeblocktitle">SOFTWARE</div>
        <div class="homeblockline"></div>
        <div class="homeblocktext">I am a keen software developer. In both a professional and private capacity, I have built web, desktop, and mobile applications. Here you will find some of my favourite personal projects.</div>
        <div class="homeblockbutton" onclick="randomEntry('Software')">CHECK OUT A PROJECT</div>
    </div>
</div>

<div class="backgroundimg2" id="homeimage0"></div>

<div class="homeblock" id="homewriting">
    <div class="homeblockcontainer">
        <div class="homeblocktitle">WRITING</div>
        <div class="homeblockline"></div>
        <div class="homeblocktext">I write short fiction and interactive fiction, and I currently work at Google as a technical writer. My work has appeared in magazines and literary journals. You will find some of my favourite pieces here.</div>
        <div class="homeblockbutton" onclick="randomEntry('Writing')">READ A PIECE</div>
    </div>
</div>

<div class="backgroundimg2" id="homeimage1"></div>

<div class="homeblock" id="homephotos">
    <div class="homeblockcontainer">
        <div class="homeblocktitle">PHOTOGRAPHY</div>
        <div class="homeblockline"></div>
        <div class="homeblocktext">I love mountains, hiking, and trekking. I take photographs of tall mountains and wild spaces. Here you will find a gallery of my favourite images.</div>
        <div class="homeblockbutton" onclick="injectGallery()">VIEW THE GALLERY</div>
    </div>
</div>

<div class="backgroundimg2" id="homeimage2"></div>

<div class="homeblock" style="padding-bottom:75px;" id="homecontact">
    <div class="homeblockcontainer">
        <div class="homeblocktitle">CONTACT</div>
        <div class="homeblockline"></div>
        <div class="homeblocktext" style="text-align:center">If you would like to get in touch, feel free to do so by social media.</div>
        <div class="homesocials">
            <a href="https://www.linkedin.com/in/jake-roseman/" class="homesocial"><img class="socialiconbig" id="linkedinbig" src="svg/linkedinbig.svg" onmouseenter="highlightSVG('linkedinbig')" onmouseleave="removeHighlight('linkedinbig')"/></a>
            <a href="https://www.instagram.com/roseman.jake/" class="homesocial"><img class="socialiconbig" id="instabig" src="svg/instabig.svg" onmouseenter="highlightSVG('instabig')" onmouseleave="removeHighlight('instabig')"/></a>
            <a href="https://github.com/rosemanjake/" class="homesocial"><img class="socialiconbig" id="githubbig" src="svg/githubbig.svg" onmouseenter="highlightSVG('githubbig')" onmouseleave="removeHighlight('githubbig')"/></a>
        </div>
    </div>
</div>
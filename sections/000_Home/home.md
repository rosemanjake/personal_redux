<div class="backgroundimgcontainer" onload="lazy()">
    <!--<div class="backgroundimg" style="background-image:url(photos/1.jpg)"></div>-->
    <div class="backgroundimg" style="background-image:url(images/homemain.jpg)">
    <div class="greetingbox fasttrans" id="greetingbox">
        <div class="greetingtitle" onclick="toHomeBlock('contact')">JAKE ROSEMAN</div>
        <div class="greetingsubbox">
            <div onclick="toHomeBlock('software')" class="greetingsubtitle">SOFTWARE</div> 
            <div>&#x2022;</div>
            <div onclick="toHomeBlock('writing')" class="greetingsubtitle">WRITING</div>
            <div>&#x2022;</div>
            <div onclick="toHomeBlock('photos')" class="greetingsubtitle">PHOTOGRAPHY</div>                
        </div>
    </div>
</div>

<div class="homeblock" id="homesoftware">
    <div class="homeblockcontainer">
        <div class="homeblocktitle">Software</div>      
        <div class="homeblocktext">I am a keen software developer. I have built web, desktop, and mobile applications. Here you will find some of my favourite personal projects.</div>
        <div class="homeblockbutton" onclick="randomEntry('Software')">Check out a project</div>
    </div>
</div>

<div class="backgroundimg2" id="homeimage0"></div>

<div class="homeblock" id="homewriting">
    <div class="homeblockcontainer">
        <div class="homeblocktitle">Writing</div>      
        <div class="homeblocktext">I write short fiction and interactive fiction, and I currently work at Google as a technical writer. My work has appeared in magazines and literary journals. You will find some of my favourite pieces here.</div>
        <div class="homeblockbutton" onclick="randomEntry('Writing')">Read a piece</div>
    </div>
</div>

<div class="backgroundimg2" id="homeimage1"></div>

<div class="homeblock" id="homephotos">
    <div class="homeblockcontainer">
        <div class="homeblocktitle">Photography</div>
        <div class="homeblocktext">I love hiking and trekking and I take photographs of the wild spaces I visit. Here you will find a gallery of my favourite images.</div>
        <div class="homeblockbutton" onclick="injectGallery()">View the gallery</div>
    </div>
</div>

<div class="backgroundimg2" id="homeimage2"></div>

<div class="homeblock" style="padding-bottom:75px;" id="homecontact">
    <div class="homeblockcontainer">
        <div class="homeblocktitle">Contact</div>   
        <div class="homeblocktext" style="text-align:center">If you would like to get in touch, feel free to do so by social media.</div>
        <div class="homesocials">
            <a href="https://www.linkedin.com/in/jake-roseman/" class="homesocial"><img class="socialiconbig" id="linkedinbig" src="svg/linkedinbig.svg" onmouseenter="highlightSVG('linkedinbig')" onmouseleave="removeHighlight('linkedinbig')"/></a>
            <a href="https://www.instagram.com/roseman.jake/" class="homesocial"><img class="socialiconbig" id="instabig" src="svg/instabig.svg" onmouseenter="highlightSVG('instabig')" onmouseleave="removeHighlight('instabig')"/></a>
            <a href="https://github.com/rosemanjake/" class="homesocial"><img class="socialiconbig" id="githubbig" src="svg/githubbig.svg" onmouseenter="highlightSVG('githubbig')" onmouseleave="removeHighlight('githubbig')"/></a>
        </div>
    </div>
</div>
# Personal Website

One of the most fun projects I have worked on is the website you are currently looking at. My goals were several:

<ul>
<li><strong>Improve web development fundamentals</strong>: I wanted to progress my web dev skills by engaging closely with CSS, HTML, and vanilla JavaScript.</li>
<li><strong>Easy deployment</strong>: I wanted to build something that I could deploy and update without friction.</li>
<li><strong>Simple content management</strong>: Similarly, I wanted a content management system that would be fun to work with through time.</li>
</ul>

I also aimed to complete the project quite quickly. I succeeded in writing all the code and initial content over the course of three weekends in early 2022.

## Source

If you would like to view the source, you will find the code [here on my GitHub](https://github.com/rosemanjake/personal_redux).

## Architecture Diagram

You will find an overview of the technologies and workflows involved in the diagram below.

![](arch.png)

## Back End

I run a Node Express server with a series of endpoints for delivering the content of the website to the browser. The content is structured very simply into sections, entries, and photos:

<ul>
    <li><strong>Sections</strong>: A division in the sidebar, such as "Software" and "Writing".</li>
    <li><strong>Entries</strong>: An individual article within one of those section, such as the one you are reading now.</li>
    <li><strong>Photos</strong>: The images to display in the gallery.</li>
</ul>

The object model to represent this content comprises two primary classes, `Library` and `Gallery`.

<ul>
    <li><strong>Library</strong>: A representation of the text content of the website, broken into sections and entries. Its two most important member variables are <span class="inlinecode">sectionmap</span> and <span class="inlinecode">entrymap</span></li>
    <ul>
        <li><strong>Section map</strong>: A JS object literal where the keys are sections names, and the values are lists of the entries within those sections. The site fetches this on page load in order to populate the side bar. A section ultimately corresponds to a folder on the server containing a series of <span class='inlinecode'>.md</span> files.</li>
        <li><strong>Entry map</strong>: A JS object literal where the keys are the entry names and the values are the HTML of those entries. When you click a link to an entry in the side bar, the browser takes the name of the entry and uses it to fetch the corresponding HTML contents from the <span class="inlinecode">entrymap</span> on the server. An entry is ultimately an <span class="inlinecode">.md</span> file in a section folder on the server.</li>
    </ul>
    <li><strong>Gallery</strong>: A representation of the images in the gallery. Its only member variable is <span class="inlinecode">images</span>, a list of the image paths in the gallery.</li>
</ul>

### Text Parsing

A key part of the back end is the text parser. I arrange the content on the server into folders which become the sections. These folders contain Markdown files, which become the entries. I much prefer to draft content in Markdown as the syntax is far simpler and less cumbersome than pure HTML. In fact, I strongly dislike drafting content directly in HTML as I spend too much thinking about tags and too little time thinking about what I'm writing.

I have implemented a RegEx-based Markdown parser to convert the MD into HTML. This is of course necessary as the browser cannot natively read Markdown. The parser currently supports converting the following MD components to HTML:

<ul>
    <li><strong>Headers</strong></li>
    <li><strong>Links</strong></li>
    <li><strong>Images</strong></li>
    <li><strong>In-line code</strong></li>
    <li><strong>Code blocks</strong></li>
</ul>

As the ultimate output is HTML, I can insert any arbitrary HTML into these files. The home page passes through this parser and is served much as if it were any entry.

The parser is therefore quite simple. I could use a Node package to do the conversion, but that would defeat the purpose of this exercise, which is to improve my skills. I will likely return to implement a more fully featured parser. If I were to do so, I would likely write a parser that forgoes regular expressions and instead crawls over each character in the text in a single pass. I would likely also implement a syntax highlighter for the code blocks.

## Front End

The front end of the website is very straightforward. I rely on vanilla JavaScript, HTML, and CSS. I don't use any large JavaScript frameworks such as React or JQuery. I don't use any CSS frameworks either such as Sass. This forced me to work directly with the DOM and ensure that I understand exactly what the browser is doing.

A great benefit of this approach is performance. On initial page load, the browser loads less than 1.3MB of data, most of which is large images. 

### Single Page App

The website is a single page app. When navigating through the entries and images in the gallery, the browser fetches data from the back end and injects it directly into the DOM. I took this approach deliberately as I wished to improve my understanding of client-server interactions. 

Every time the browser fetches content, it the injects the name of the entry or gallery image into the URL with `window.history.pushState()`. When opening the page with such a URL, the browser parses the URL and routes the user to the given content. This is largely implemented in `init()` with the following code:

```
// Look for routing to a particular entry
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
}
// Go to home if we find nothing
else{
    fetchContent("home")
}
```

For example, this page has the URL `jakeroseman.com/?e=Personal-Website`. The `/` endpoint fetches the main `HTML` content from the browser. On load, the browser then calls `init()` which parses the variable from the URL. In this case the variable is `e` with the value `"Personal-Website"`. The browser passes that value to `fetchContent()`, which sends a `GET` request to the `/d` endpoint. The server returns the value found in the entry map corresponding to the key `"Personal Website"`. The browser parses the resulting HTML from the JSON in the body of response and injects it into the DOM.

The process is much the same for images, only with the `/g` endpoint and the variable `i` that contains the image name. In that case, `init()` awaits `injectGallery()` to ensuring the browser does not call `displayImage()` until the gallery page has loaded. 

### Home page

The home page was an interesting challenge. I wanted to display some large images, though loading them all at once and at full resolution meant the browser would fetch several megabytes on page load. To solve this I downsized the images in PhotoShop, and implemented lazy loading.

To handle lazy loading, I added an `EventListener` on `window` to call the function `lazy()` whenever the user scrolls. This `EventListener` is throttled to one call every 100ms. `lazy()` measures how far the user has scrolled using this formula:

```
let curroffset = window.pageYOffset + document.body.clientHeight
```

The function then loops through the divs which display the large images as background images. For each it measures the top and bottom of the div using:

```
let top = currimg.getBoundingClientRect().top + window.pageYOffset - earlyoffset
let bottom = currimg.getBoundingClientRect().bottom + window.pageYOffset
```

This allows the browser to track whether or not the user has scrolled the given div into view. You may notice that I also subtract an `earlyoffset` from the `top` value. This artificially raises the top of the target region for the `div` and allows the browser to trigger a function call before the div is actually in view.

When the user scrolls into a target region, the browser loads the given image if it has not already loaded, as well as the next image. This ensures that the when scrolling down, each image has already loaded before its given div is reached. It also minimises the amount downloaded on initial load.

## Design

I wanted to build a website that was simple, modern, and relatively understated. I reviewed examples of other personal websites, took some key elements from several that I liked, and combined them together in a (somewhat) unique design. You know what they say about great artists.

There were several basic design precepts that I took care to follow:

<ul>
<li><strong>Alignment of elements</strong>: I aimed to align certain elements, such as the top of the title of an entry, and the name title in the sidebar.</li>
<li><strong>Consistent font sizes</strong>: I used CSS variables to set a range of reusable <span class="inlinecode">font-size</span> values.</li>
<li><strong>Subdued palette</strong>: I did not want a garish website that would look unprofessional, so I chose a subdued white-blue palette.</li>
</ul>

## Gallery

The gallery was perhaps the most fun part of the website to work on. I have long wanted to build something of my own to display my photographs. I am quite pleased with the result, though I will likely return to sharpen up the networking performance. 

### Thumbnails

A gallery needs to have a set of thumbnails from which the user can pick images to view in full resolution. To generate the thumbnails I use a Python script that wraps around [ImageMagick](https://www.imagemagick.org/). It resizes all images to the gallery to 300x300 and saves them in a `thumbnails` folder. 

To load the thumbnails, the browser fetches the paths of all the gallery images from the `/g` endpoint:

```
const req = new Request(`${domain}g`)
let res = await fetch(req)

imgs = await res.json()

let thumbs = await loadThumbs(imgs)
contentbox.appendChild(thumbs)
```

It passes a list of these paths to `loadThumbs()`. As the filenames of the photos and their thumbnails are the same aside from the parent folder, the function swaps out `photos/` for `thumbnails/` in the path. It then uses `await Promise.all()` and the `loadImage` function to asychronously load each of the thumbnails. When the promise resolves, the browser adds each resulting `img` to a `DocumentFragment` which it then returns to the `injectGallery()` function. There the browser appends the fragment to the main thumbnail container. Using the fragment ensures that each thumbnail is appended to the main parent element all at once. The browser then changes the class name of the thumbnail container to invoke the fade-in transition.

This approach ensures that the thumbnails only display after they have all loaded in. However, I am not perfectly happy with the current behaviour as there are ~40 thumbnails to download and the result is a short wait while the browser fetches upwards of 10MB. I will likely return to implement lazy loading for only thumbnails in view.

### Main Images

Each thumbnail has an `onclick` EventListener which calls the `displayImage()` function. The first thing the browser does is call the `greyOut()` function which creates a opaque black div over the entire window. When clicked, this div closes the large image. 

I encountered a problem where the user could click the div before it had finished fading in. To prevent this I used an `animationend` `EventListener` that adds another `EventListener` that calls `endGrey()` on a click event.

```
grey.addEventListener('animationend', function(e){
        e.currentTarget.addEventListener('click', function(){
            endGrey();
         });
    }
```

To fetch the image itself, The browser again mutates the image path. This time it produces the path of the full resolution image. While the browser awaits `loadImage` to return the full image, it displays a `Loading...` message in its place.

When cycling through the images using the arrow buttons, the browser iterates through a list of image paths and fetches the corresponding image at intervals of 1 and -1. 

The larger images are all scaled to 2000 pixels on their largest edge using the same Python script that scales the thumbnails.

## Deployment

I wanted to be able to deploy the website easily. For that reason, I chose to use serverless hosting. I settled on Google Cloud App Engine as it proved to be the simplest and easiest to use. I include an `app.yaml` configuration file in the root of the repository, and then use the command `gcloud app deploy` to deploy the latest code. Much better than manually deploying on a remote box.

The Python script I mention above not only generates any needed thumbnails and images for the gallery but also runs the deploy command.

## Result

I succeeded in each of the goals I set myself. I learnt a great deal more about backend JavaScript through Node, as well as asychronous patterns for client-server interactions. The website is extremely easy to deploy, and the MD parser enables me to draft content with little fuss. As noted above, I also succeeded in my goal of completing the website quickly, in only 3 weeks.

Again, if you would like to view the code, please see the GitHub repo [here](https://github.com/rosemanjake/personal_redux).
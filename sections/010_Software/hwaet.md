# Hwæt

I have always enjoyed reading different translations of a foreign language text in parallel. Switching between the original text and the translations allows you to more clearly understand the original language without resorting to dictionaries and reference grammars. 

I have built a website that allows you to switch between translations of Beowulf, as well as the original text. It is called <a href='https://www.hwaet.io'>Hwæt</a>. The name of the website is the first word of Beowulf in Old English. It can variously be understood as "lo!", "hark!", or "listen!".

![](bw.png)

## Beowulf

Beowulf is a poem from the earliest period of English history, with estimates placing its composition at some time between 700 and 1000 AD. It tells the story of a Swedish prince named Beowulf who travels to Denmark and fights with both a monster, and that monster's mother. It is written in a distinctly Germanic style with <a href="https://en.wikipedia.org/wiki/Alliterative_verse#Old_English_poetic_forms">alliterative verse</a> and countless excellent <a href="https://en.wikipedia.org/wiki/Kenning">kennings</a>. 

The language of the poem is Anglo-Saxon, the earliest form of the English language. Despite the poem's beauty and historical importance, it is therefore incomprehensible to speakers of Modern English. Many writers have produced translations, some of which are prose translations, and some of which attempt to match the unique style of the original. 

The best way to understand and appreciate the original is to read multiple translations and compare them both with one another and with the original text.

![There exists only one original copy of the text](beowulfold.jpg)

## Goals

While this is an idea I have had for some time, I implemented it primarily to teach myself React. I had a few simple technical goals:

<ul>
<li>Learn how to manage state and interactivity in React.</li> 
<li>Learn how to pass data from a simple backend to a React front end.</li>
<li>Build and deploy the website quickly.</li>
</ul>

I am satisfied that I have fulfilled each of these goals. The final website is relatively simple, but it includes the core functionality of a full-stack React app. I built the front end in roughly two weeks, while the back end took one week.

## Back end

The back end is a Node/Express service running on App Engine. It contains a series of parsers for extracting content from a several public domain texts. Each text is from <a href="https://www.gutenberg.org/">Project Gutenberg</a>.

The back end is more involved than one might expect for a project as simple as this. The reason is that the sources of the translations are all quite different in form, and I needed to squeeze each text into a common data structure.

### Chapter titles

The first task of the parser is to get metadata such as the number of chapters and the title of those chapters. To do so, I used Leslie Hall's translation from 1897. I used the <span class='inlinecode'>HTML</span> from the <a href="https://www.gutenberg.org/files/16328/16328-h/16328-h.htm">Project Gutenberg edition</a>.

Some of the chapter titles were too long, and some of the content was superfluous, so I trimmed and changed the file manually before writing a parser to extract its contents. Ultimately the parser uses regular expression to extract the inner text of elements that correspond to chapter headings. 

### Side notes

The parser also uses regular expressions to extract the "side notes" that provide small additional details alongside the right side of the text. It tracks how far through the the chapter these side notes appear. For example, if a side note appears on the tenth line in a one hundred line chapter, the parser marks it with a position of <span class='inlinecode'>0.10</span>. The front end later uses these measures to accurately place the side notes alongside any translation.

### Line ranges

Most translations have the same number of lines as the original. This makes it much easier to fetch the set of lines corresponding to each chapter. To get the chapter line ranges, I used the Gummere translation. I trimmed down the HTML until there was just a single <span class='inlinecode'>&ltp&gt</span> dividing each chapter. It is then easy enough to simply split the file on <span class='inlinecode'>&ltp&gt</span> to get an array of each chapter as a string. 

Ultimately, the parser counts the number of lines in each chapter and stores this as an object that records the first and last line number for each chapter. 

### Simple content

Once the parser has produced the chapter line ranges, it is easy to split any text into an array of strings where each string is a full chapter. As such, it is equally as easy to add additional translations where they are single strings with the same number of lines as the Anglo-Saxon original. 

## Front end

The front end was a challenge as it was my first time writing React code. I have worked with Jetpack Compose in the past, so I was not completely unfamilar with declarative user interfaces. However, as I was already very familiar with vanilla JavaScript and the standard browser APIs, React was in a sense much more difficult. I continually had to fight the instinctive urge to do things in the imperative manner to which I am accustomed. 

### Components

The primary components for the website are as follows:

<ul>
<li><b>TopBar</b>:The top bar that contains the title and drop down menus for selecting the chapter and translation.
<li><b>MainText</b>:The main division in which the actual text and side notes appear.
<li><b>BottomBar</b>:The set of buttons at the bottom of the page that let you easily page through chapters.
</ul>

These components are all very simple. I did not want to over-engineer and over-complicate my first React project.

### State

The primary state variables track the current chapter and translation. React then fetches the corresponding text from the server and displays it in the <span class="inlinecode">MainText</span> component.

### Communicating with the back end

I generally used Axios to send <span class="inlinecode">GET</span> requests to the back end. There is a single end point that returns an object with the requested chapter content. The reason I used Axios was simply that I understood it to be an important part of current best practices and I therefore wished to learn it.

## Result

I am quite pleased with the final website. It succeeds in making it easy to switch between different versions of the text, including the original. It also taught me what I wanted to learn. I intend to continue developing my React skills with further projects that involve more complex network activity.

But perhaps the thing I am most pleased with is the URL - <a href="https://www.hwaet.io">hwaet.io</a>

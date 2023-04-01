# Markdown parsing techniques

I developed many tools for technical writers. They lint, format, parse, and convert Markdown files. While designing these tools, certain common problems have repeatedly arisen. In response, I have developed a general approach that has proven to be effective and extensible in production. This article lays out that approach and the key lessons I have learnt.

![tfw writing a text parser](tfwtext.png)

## Optimal time complexity

Performance is important in text processing. For example, a linter that produces results in an IDE in real time needs to do so very quickly, as the user is typing. Similarly, a converter that parses and converts very large files could take many minutes if not well optimised.

For optimal time complexity, your algorithm should visit each character in a file only once. An algorithm that repeatedly scans back and forth will certainly be slower than one that does its work in a single pass. Your algorithm should therefore run in `O(n)` time, where n is the number of characters in the file. 

That is, the optimal processing time scales linearly with the size of the file. If you increase the file size five times over, your algorithm should run <i>at most</i> five times slower.

For a simple example, consider a character frequency algorithm. An `O(n)` implementation would loop over the characters in the document a single time, perhaps using a hashmap to count occurrences of each character. An `O(n^2)` implementation might use nested loops to check every character against every other character. The latter is by far the slower solution.

<b>Lesson:</b> When developing a text processing algorithm, you should centre it on a single loop over every character in a file.

## Track state

At any given index, your program should understand the current context of the document, such as whether the current character is in a heading, code snippet, and HTML element. Tracking state in this manner is the key to parsing out components from a document.

### Define a tracking class

The simplest way to track state is with a single object whose members are of the following types:

<ul>
<li><b>Booleans:</b> Variables that capture whether the current character is in a certain state. For example, where inCodeSnippet is true, the current character is in a code snippet.
<li><b>Buffers:</b> Lists of characters that have so far been encountered. For example, paragraphBuffer contains all the characters that the loop has iterated over up to the current index.
<li><b>Stacks:</b> Lists of strings that the program pushes and pops on a first-in-first-out basis. For example, the parser pushes `div` to a stack of HTML elements when encountered, and pops that element from the stack when encountering the corresponding `/div`. 
</ul>

The definition of such a class might appear as the following TypeScript implementation:

```
class TextFileState {
  originalText: string;
  currentCharacter: string | null;
  inCodeSnippet: boolean;
  paragraphBuffer: string[]; // All characters in the current paragraph.
  componentBuffer: string[]; // All characters in the current component, i.e. code snippet, heading, image.
  htmlTags: string[];
  ...


  constructor(filePath: string) {
    this.originalText = TextUtils.getText(filePath);
    this.currentCharacter = null;
    this.inCodeSnippet = false;
    this.componentBuffer = string[];
    this.paragraphBuffer = [];
    this.htmlTags = [];
    ...
  }
}
```

Before you begin looping through your document, instantiate your tracking class. Keep this object as the only instantiation of the class. 

<b>Lesson:</b> When tracking state, do so in a single object. 

### State tracking functions

As you loop over each character in a file, you should call various state tracking functions depending on the current character. These functions should evaluate the current state of the document and change the given state booleans, buffers, and stacks. For example, when encountering a backtick character in a Markdown document, call `isInCode()`, and change `state.isInCodeSnippet` as appropriate.

There are several ways you could structure this. Most simply, you could use a switch statement where the expression is the current character. See the snippet below for an example:

```
const state = TextFileState(filePath)

for (let i = 0; i < state.originalText.length; i++){

  state.currentCharacter = TextUtils.getCharacter(i) 
  if (state.shouldSkip()) continue
  state.pushToBuffers(currentCharacter)

  switch(currentCharacter) {
    case '`':
      isInCodeSnippet(i, state)
      break;
    case '-':
    case '*':
    case '+':
      isInList(state)
      break;
    default:
      break;
  }
}

function isInCodeSnippet(state){
	if (state.paragraphBuffer.length === 3 && 
    state.paragraphBuffer[i - 1] === ‘`’ && 
    state.paragraphBuffer [i - 2] === ‘`’){
    state.inCodeSnippet = true      
  }
}
```

Passing just the state object allows you to simplify function parameters. This produces a more easily extensible structure in which debugging is also much easier. Through the state object you can see the complete current state of the document at the current character.

<b>Lesson:</b> Pass your state object to state tracking functions and modify it in place.

### Applications of state tracking

Tracking state is the basis for most actions you would want to take. Consider how your program might track entering and exiting a code snippet:

<ul>
<li><b>Enter component:</b> Loop encounters backtick, calls `isInCodeSnippet` and sees three backticks in `state.paragraphBuffer`. `isInCodeSnippet` switches `state.inCodeSinppet` from false to true.
<li><b>Push to `componentBuffer`:</b> While `state.inCodeSnippet` is true, the program pushes each character to `state.componentBuffer`.
<li><b>Leave component:</b> The loop again encounters backtick, calls `isInCodeSnippet` and sees three backticks in `componentBuffer`. `isInCodeSnippet` switches `state.inCodeSnippet` to false.
<li><b>Flush `componentBuffer`:</b>`isInCodeSnippet` also joins the characters in `componentBuffer` to a single string that captures the content of the snippet.
</ul>

Consider the examples below on how you could use this workflow in a linter, formatter, and general parser.

<ul>
<li><b>Linter:</b> Run that string against a regular expression that matches if there is a particular error present.
<li><b>Formatter:</b> Pass the string to a code formatting API like `Format.JS` before pushing it to a final list of formatted lines.
<li><b>Parser:</b> Pass the string to the constructor of a Node class and integrate the resulting object into a syntax tree.
</ul>

<b>Lesson:</b> Use changes in state to parse components.

## Build a common framework

As you may have noticed from the previous examples, it is possible to build a single text processor that performs multiple functions. If your implementation is flexible enough, you can build a single general purpose library for linting, formatting, parsing, and converting.

<b>Lesson:</b> Build a general purpose program that you can use in various contexts.

## Tokenisation

Tokenisation can either be very simple, or very difficult. As such, only tokenise to the extent that you need to. For example, if you are primarily building a formatter, you might be able to rely on a simple buffer of each character in the current line, rather than discrete tokens. Similarly, while a linter will usually need to isolate individual terms, it likely won’t need to parse out whether each token is in bold, or italics.

<b>Lesson:</b> You don’t always need a tokeniser. If you do need a tokeniser, K.I.S.S.

## Optimizations

There are several optimisations you can use to speed up your program’s processing time. Because most processing time goes into state checks, it is important that you skip them where it is possible to do so.

<ul>
<li><b>Don’t call unnecessary functions:</b> You can avoid function calls by using a hashmap or switch as in the above example to only call the functions relevant to the current character.
<li><b>Skip `n` characters:</b> Sometimes you can be certain that the program doesn’t need to do anything with the next few characters. Perhaps you needed to lookahead five characters and have already pushed those characters to your buffers. Set an integer like `state.skips` to 5 that causes the loop to skip over the given number of characters.
<li><b>Skip to character:</b> Similarly, you can make your main loop skip over any character that isn’t a match for a variable like `state.skipCharacter`. For example, when in a code snippet you might want to skip state checks on everything up to the next backtick. 
</ul>

You could implement these checks in a single `shouldSkip()` function as in the above code snippet.

<b>Lesson:</b> Avoid calling state tracking functions where possible.

## Conclusion

The above sections outline the general approach I have taken when building tools to lint, format, and parse Markdown. The primary lessons are the following:

<ul>
<li><b>Time complexity:</b> Loop over every character in the file just once.
<li><b>State:</b> Track the state of the document at every index.
<li><b>Parse components:</b> Use buffers and changes in state to parse out the components in the document.
<li><b>Common framework:</b> Build a general purpose program you can use in various contexts.
<li><b>Tokenisation:</b> Don’t tokenise if not necessary.
<li><b>Optimisations:</b> Skip state checks on characters where possible.
</ul>
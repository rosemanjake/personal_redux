async function buttonpress(docsurl = '', data = {}){
    const req = new Request('https://jakeroseman.com/docs')
    fetch(req)
        .then(response => response.json())
        .then(data => console.log(data))
    //    return response.json(); // parses JSON response into native JavaScript objects
}
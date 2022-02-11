function injectGallery(){
    window.history.pushState("object or string", "Title", "/gallery");

    // Fetch data and push to content div
    const req = new Request(`${domain}g`)
    fetch(req)
        .then(response => response.json())
        .then((data) => {
            let contentbox = document.getElementById("content")
            contentbox.innerHTML = ""

            Array.from(data).forEach((img) => {
                let currimg = document.createElement('img')
                currimg.className = "galleryimg"
                currimg.src = img
                contentbox.appendChild(currimg)         
            })
        })
    }
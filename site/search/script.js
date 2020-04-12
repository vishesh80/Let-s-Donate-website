const div = document.getElementById("results");

init()
.then(json => console.log(json))
.catch(err => {
    alert("Internal Server Error");
    console.log(err.message);
});


async function init()
{
    if(!localStorage.getItem("Q")) return;

    let data = {
        query: localStorage.getItem("Q"),
        token: localStorage.getItem("token")
    }

    let res = await fetch("/api/search",{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    if(res.status >= 400) throw new Error(await res.text());
    
    let json = await res.json();
    
    for(let j of json)
    {
        let card = document.createElement("div");
        card.classList.add("resultCards");
       
        if(j.address)
        {
            card.innerHTML = '<div class="image" id="img">image</div>' +
                '<div class="info">' +
                '<p id="name">'+j.ngoName+'</p>' +
                '<p id="address">'+j.address+'</p>' +
                '<p id="loc">'+j.city+', '+j.state+'</p>'+
                '</div>';
        }
        else
        {
            card.innerHTML = '<div class="image" id="img">image</div>' +
                '<div class="info">' +
                '<p id="name">' + j.username + '</p>' +
                '<p id="address">'+j.age+' years old</p>' +
                '<p id="loc">' + j.city + ', ' + j.state + '</p>'+
                '</div>';
        }

        if(j.url) card.firstChild.style.backgroundImage = "url('" + j.url + "')";
        div.append(card);
    }

    localStorage.removeItem("Q");

    return json;
}
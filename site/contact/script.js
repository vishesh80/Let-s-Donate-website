const name = document.getElementById("username");
const email = document.getElementById("email");
const desc = document.getElementById("desc");
const sendbtn = document.getElementById("btn");

const burger = document.getElementById("burger");
const menudiv = document.getElementById("rnav");


sendbtn.addEventListener("click",send);

function send(event)
{
    event.preventDefault();
    if(!inputCheck()) return;

    let data = {
        name: name.value.trim()
        ,email: email.value.trim()
        ,desc: desc.value.trim()
    };



    fetch("/pApi/contact",{method:"POST",headers:{"Content-Type":"application/json"},body : JSON.stringify(data)})
    .then(async res => {

        if(res >= 400) throw new Error(await res.text());

        let text = await res.text();
        alert(text);
        clearInput();
    })
    .catch(err => {

        alert("Failed to send the message.\nINTERNAL SERVER ERROR.");
        clearInput();
        console.log(err.message);
    });

}

function inputCheck() {
    //Validity check

    // Length check and Composition check
    if (name.value.trim().length > 40 ||
        name.value.trim().length < 3 ||
        desc.value.trim().length > 1000 ||
        desc.value.trim().length < 5 ||
        !(/^[A-Za-z\s\.]+$/.test(name.value.trim())) ||
        !(/^[A-Za-z\d\._\-]+@[A-Za-z\-]+\.[A-Za-z]+$/.test(email.value.trim()))) {
        alert("Invalid Info.");
        return false;
    }
    return true;
}

function clearInput()
{
    name.value = "";
    desc.value = "";
    email.value = "";
}


burger.addEventListener("click", event => {

    console.log("clicked");
    menudiv.classList.toggle("toggle");
    event.stopPropagation();
});

window.addEventListener("click", event => {

    menudiv.classList.remove("toggle");
});
window.addEventListener("resize", event => {

    menudiv.classList.remove("toggle");
});
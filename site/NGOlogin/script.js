const loginBtn = document.getElementById("loginbtn");
const loginEmail = document.getElementById("Lemail");
const loginPassword = document.getElementById("Lpassword");

const signupBtn = document.getElementById("signupbtn");
const ngoName = document.getElementById("ngoName");
const email = document.getElementById("email");
const state = document.getElementById("state");
const city = document.getElementById("city");
const address = document.getElementById("address");
const password = document.getElementById("password");
const cpassword = document.getElementById("reenter");







/*--------------------Button listeners-------------------------------------------*/


loginBtn.addEventListener("click", (event) => {
  
    //Heaavy string check
    if(loginPassword.value.length > 50 || loginEmail.value.trim().length > 50) return;
    let data = {
        email: loginEmail.value.trim(),
        password: loginPassword.value
    };

    fetch("/login/ngo", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(res => {

            if (res.status >= 400) {
                alert("Invalid Email or passwrod");
                throw new Error(res.status);
            }

            return res.text();
        })
        .then(data => {
            
            localStorage.setItem("token",data);
            window.location.replace("../ngoAccount/ngoAccount.html");
        });

    event.preventDefault();
});





signupBtn.addEventListener("click", (event) => {

    if (inputCheck())
    {
        let data = {
            ngoName: ngoName.value.trim(),
            email: email.value.trim(),
            password: password.value.trim(),
            address: address.value.trim(),
            state: state.value.trim(),
            city: city.value.trim(),
            isV : false
        };

        fetch("/signUp/ngo", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
            })
            .then(async res => {
                if (res.status >= 400)
                {
                    throw new Error(await res.text());
                } 
                return res.text();
            })
            .then(data => alert(data))
            .catch(err => {
                alert(err.message);
            });

    }
    else console.log("went wrong");

    event.preventDefault();
});




/*----------------------------------------input checker----------------------------------------------*/
function inputCheck()
{
    //Validity check

    // Length check and Composition check
    if (ngoName.value.trim().length > 40 ||
        ngoName.value.trim().length < 3 ||
        state.value.trim().length > 20 ||
        city.value.trim().length > 20 ||
        state.value.trim().length < 3 ||
        city.value.trim().length < 3 ||
        address.value.trim().length > 55 ||
        address.value.trim().length < 10 ||
        !(/^[A-Za-z\s\.]+$/.test(ngoName.value.trim())) ||
        !(/^[A-Za-z\s]+$/.test(state.value.trim())) ||
        !(/^[A-Za-z\s]+$/.test(city.value.trim())) ||
        !(/^[A-Za-z\d\._\-]+@[A-Za-z\-]+\.[A-Za-z]+$/.test(email.value.trim()))) {
        alert("Invalid Info.");
        return false;
    }

    // Password length check
    if (password.value.length > 25 || password.value.length < 6) {
        alert("password length should be between 6-25.");
        return false;
    }

    // Confirm password match
    if (password.value !== cpassword.value) {
        alert("Confirm password doesnt match. \nPlease type carefully.");
        return false;
    }

    return true;
}


const loginBtn = document.getElementById("loginbtn");
const loginEmail = document.getElementById("Lemail");
const loginPassword = document.getElementById("Lpassword");

const signupBtn = document.getElementById("signupbtn");
const username = document.getElementById("username");
const email = document.getElementById("email");
const age = document.getElementById("age");
const state = document.getElementById("state");
const city = document.getElementById("city");
const password = document.getElementById("password");
const cpassword = document.getElementById("reenter");

localStorage.setItem("flag","flag");

/*----------------------------------Button Listener------------------------------------------------------- */



loginBtn.addEventListener("click",(event) =>{
 
    //Heaavy string check
    if (loginPassword.value.length > 50 || loginEmail.value.trim().length > 50) return;

    let data = {
        email: loginEmail.value.trim(),
        password: loginPassword.value
    };

    fetch("/login/user", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(res => {

            if(res.status >= 400)
            {
                alert("Invalid Email or passwrod");
                throw new Error(res.status);
            } 

            return res.text();
        })
        .then(data => {
            console.log(data);
            localStorage.setItem("token", data);
            window.location.replace("../userAccount/userAccount.html");
        })
        .catch(err => console.log(err.message));

    event.preventDefault();

});



signupBtn.addEventListener("click", (event) => {

    if (inputCheck())
    {
        let data = {    
                        username : username.value.trim(),
                        email: email.value.trim(),
                        password: password.value.trim(),
                        age: age.value.trim(),
                        state: state.value.trim(),
                        city: city.value.trim(),
                        isV : false
                    };

        fetch("/signUp/user",{
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
            })
            .then(async res => {
                if (res.status >= 400) {
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




/*------------------------------Input checker---------------------------------*/

function inputCheck()
{
    //Validity check

    // Length check and Composition check
    if (username.value.trim().length > 30 ||
        username.value.trim().length < 3 ||
        Object.is(Number(age.value.trim()), NaN) ||
        state.value.trim().length > 20 ||
        city.value.trim().length > 20 ||
        state.value.trim().length < 3 ||
        city.value.trim().length < 3 ||
        !(/^[A-Za-z\s]+$/.test(username.value.trim())) ||
        !(/^[A-Za-z\s]+$/.test(state.value.trim())) ||
        !(/^[A-Za-z\s]+$/.test(city.value.trim())) ||
        !(/^[A-Za-z\d\._\-]+@[A-Za-z\-]+\.[A-Za-z]+$/.test(email.value.trim()))) {
        alert("Invalid Info.");
        return false;
    }

    if (Number(age.value.trim()) < 13 || Number(age.value.trim()) > 120) {
        alert("Invalid Age.");
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


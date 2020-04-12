
var mymap;
const dp = document.getElementById("profileImg");
const name = document.getElementById("name");
const age = document.getElementById("age");
const loc = document.getElementById("loc");

const created = document.getElementById("created");
const logoutBtn = document.getElementById("logout");
const burger = document.getElementById("burger");
const menudiv = document.getElementById("menu");
const upload = document.getElementById("upload");
const fileInput = document.getElementById("file");

const searchbar = document.getElementById("searchbar");
const query = document.getElementById("text");
const toserch = document.getElementById("tosearch");



checkToken();
startmap();
 




function startmap()
{
    mymap = L.map("mapid").setView([28.614111, 77.208158], 10);
    L.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken:
          "pk.eyJ1IjoiYXJuYXZhcm5hdiIsImEiOiJjazhsaWZmeWIwMjZuM2xyeDhxbTNwZnFrIn0.erkK7N4SpQGDNvZlPYhbeQ",
      }
    ).addTo(mymap);

  let data = {token : localStorage.getItem("token")}



  fetch("/api/getlocations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(async result => {
      if (result.status >= 400) {
        let text = await result.text();
        throw new Error(text);
      } else {
        return result.json();
      }
    })
    .then(json => {

        for(let j of json)
        {
            L.marker([j.lat,j.long]).addTo(mymap)
            .bindPopup('<strong>'+j.ngoName+'</strong><br>Address:-<br>'+
                        ''+j.address+',<br>'+''+j.city+', '+j.state)
            .openPopup();
        }

    })
    .catch(err => console.log(err.message)); // fetch ends here


    let greenIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    navigator.geolocation.getCurrentPosition(p => {
      L.marker([p.coords.latitude, p.coords.longitude], { icon: greenIcon }).addTo(mymap)
        .bindPopup('Your<br>Location')
        .openPopup();
      
      if(localStorage.getItem("flag")) setTimeout(() => {
        console.log("here");
        alert("Your Location can be inaccurate.\nIf system doesn't have GPS.");
        localStorage.removeItem("flag");
      },500);
    
    
    },err => console.log(err),{
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });

}





function checkToken() {
  fetch("/account/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: localStorage.getItem("token") }),
  })
    .then(res => {

      if (res.status >= 400) {
        console.log("400 enterd");
        localStorage.removeItem("token");
        window.location.replace("../userlogin/userlogin.html");
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then(async data => {
      if(!data.isV) await varify();
      name.textContent = data.username;
      age.textContent = data.age+" years old";
      loc.textContent = data.state+", "+data.city;
      if(data.url)dp.style.backgroundImage = "url('" + data.url + "')";
      getevents();
      console.log(data);
    })
    .catch(err => console.log(err.message));
}


function getevents() {
  let data = { token: localStorage.getItem("token"), user : true };

  fetch("/api/getEvents",
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data), })
    .then(async result => {

      if (result.status >= 400) {
        let text = await result.text();
        alert(text);
        throw new Error(text);
      }
      else {
        return result.json();
      }
    })
    .then(json => {

      for (let j of json) {
        let div = document.createElement("div");
        div.classList.add("eventCard");

        let ih = '<aside>green</aside>' +
          '<div>' +
          '<h1>' + j.Name + '</h1>' +
          '<p>On : ' + j.Date + '</p>' +
          '<p>Time : ' + j.Time + '</p>' +
          '<p>Address:-</p>' +
          '<p>' + j.Address + '</p>' +
          '</div>';
        div.innerHTML = ih;
        created.append(div);
      }

    })
    .catch(err => alert(err.message));// fetch ends here

}



async function varify() {
  let number = Math.floor(Math.random() * 11345);
  let vdata = {
    token: localStorage.getItem("token"),
    number: number,
  };

  let res = await fetch("/api/sendEmail", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vdata),
  });

  if (res.status === 200) {
    let otp = prompt(
      "Please Varify your Email.\nEnter the OTP sent to your Email address"
    );

    if (Number(otp) === number) {
      varified();
      return;
    } else {
      localStorage.removeItem("token");
      window.location.replace("../NGOlogin/NGOlogin.html");
      throw new Error("Varification Failed");
    }
  } else {
    let text = await res.text();
    alert(text);
    localStorage.removeItem("token");
    window.location.replace("../NGOlogin/NGOlogin.html");
    throw new Error(text);
  }
}

function varified() {
  let data = { token: localStorage.getItem("token") };

  fetch("/api/varified", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(async (result) => {
      if (result.status >= 400) {
        let text = await result.text();
        throw new Error(text);
      } else {
        return result.text();
      }
    })
    .then((text) => {
      console.log(text);
    })
    .catch((err) => console.log(err.message)); // fetch ends here
}




/*---------------------------------Listeners ------------------------------------------------- */


searchbar.addEventListener("click", event => {

  if (event.target.id === "user")
  {
    localStorage.setItem("Q", "Uquery");
    toserch.click();
  } 
  else if(event.target.id === "ngo")
  {
    localStorage.setItem("Q", "Nquery");
    toserch.click();
  } 
  else if(event.target.id === "search")
  {
    if (/^[A-Za-z\s\.]+$/.test(query.value.trim()) && query.value.trim().length < 100)
    {
      localStorage.setItem("Q", query.value.trim());
      toserch.click();
    }
  }  
});


logoutBtn.addEventListener("click", event => {
  localStorage.removeItem("token");
  window.location.replace("../userlogin/userlogin.html");
});


burger.addEventListener("click", event => {

  menudiv.classList.toggle("toggle");
  event.stopPropagation();
});

window.addEventListener("click", event => {

  menudiv.classList.remove("toggle");
});
window.addEventListener("resize", event => {

  menudiv.classList.remove("toggle");
});



fileInput.addEventListener("change",e => {

  let file = fileInput.files[0];
  
  if(!(/^image\//.test(file.type)) || (file.size / 1020)/1020 > 2 )
  {
    alert("Please select the valid image file.\nThe image size should be less the 2 MB.");
    return;
  }

  let reader = new FileReader;

  reader.addEventListener("load",e => {

    saveImage(reader.result)
    .then(json => {
        dp.style.backgroundImage = "url('"+json.url+"')";
    })
    .catch(err => {
      console.log(err);
      alert("Image Upload Failed.\nInternal Server Error.")
    });
  });

  reader.readAsDataURL(file);

});

upload.addEventListener("click", event => {

  fileInput.click();

});

async function saveImage(dataURL)
{
    let data = {

      url: dataURL,
      token: localStorage.getItem("token"),
      user : true 
    };

    let res = await fetch("/api/saveImg",{

        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(data)
    });

    if(res.status >= 400) throw new Error(await res.text());


    let json = await res.json();
    console.log(json);
    return json;
}





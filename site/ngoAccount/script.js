
const dp = document.getElementById("profileImg");
const name = document.getElementById("name");
const address= document.getElementById("address");
const loc = document.getElementById("loc");

const searchbar = document.getElementById("searchbar");
const query = document.getElementById("text");
const toserch = document.getElementById("tosearch");

const eventname = document.getElementById("eventName");
const eventtime = document.getElementById("eventTime");
const eventaddress = document.getElementById("eventAddress");
const eventdate = document.getElementById("eventDate");

const burger = document.getElementById("burger");
const menudiv = document.getElementById("menu");
const upload = document.getElementById("upload");
const maploc = document.getElementById("maploc");
const fileInput = document.getElementById("file");
const logoutBtn = document.getElementById("logout");

const modal = document.getElementById('modal');
const modalBtn = document.getElementById('modalBtn');
const modalInput = document.getElementById("modalInput");

const created = document.getElementById("created");

const canvas_1 = document.getElementById("canvas_1");
let chart_1;

const canvas_2 = document.getElementById("canvas_2");
let chart_2;

const canvas_3 = document.getElementById("canvas_3");
let chart_3;

const canvas_4 = document.getElementById("canvas_4");
let chart_4;

const canvas_5 = document.getElementById("canvas_5");
let chart_5;


checkToken();
document.getElementById("create").addEventListener("click",createbtnMethod);
created.addEventListener("click",removebtnMethod);
maploc.addEventListener("click",addlocation);





function checkToken()
{
  fetch("/account/ngo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: localStorage.getItem("token") }),
  })
    .then((res) => {
      if (res.status >= 400) {
        localStorage.removeItem("token");
        window.location.replace("../NGOlogin/NGOlogin.html");
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then(async data => {

      if(!data.isV) await varify();
      name.textContent = data.ngoName;
      address.textContent = data.address;
      loc.textContent = data.city+", "+data.state;
      if (data.url) dp.style.backgroundImage = "url('" + data.url + "')";
      getevents();
      displayCharts();
      console.log(data);
    })
    .catch((err) => console.log(err.message));

}




async function createbtnMethod()
{
    // Input check
    if(!validform()) return;

    let data = {
      eventName : eventname.value.trim(),
      eventTime : eventtime.value.trim().toUpperCase(),
      eventDate : eventdate.value.trim(),
      eventAddress : eventAddress.value.trim(),
      token: localStorage.getItem("token")
    };

   
  fetch("/api/createEvent",
  {method: "POST",headers: { "Content-Type": "application/json" },body: JSON.stringify(data),})
  .then(async result => {

    if(result.status >= 400)
    {
          let text = await result.text();
          alert(text);
          throw new Error(text);
    }
    else
    {
       return result.json();
    }
  })
  .then(json => {

    console.log(json);

    let div = document.createElement("div");
    div.classList.add("eventCard");

    let ih =  '<aside><button>Remove</button></aside>'+
              '<div>'+
              '<h1>'+json.Name+'</h1>'+
              '<p>On : '+json.Date+'</p>'+
              '<p>Time : '+json.Time+'</p>'+
              '<p>Address:-</p>'+
              '<p>'+json.Address+'</p>'+
              '</div>';

    div.innerHTML = ih;
    created.append(div);
  })
  .catch(err => console.log(err.message));
}


function addlocation()
{
  if(prompt("The location can be inaccurate if the system doesn't have a GPS.\nTo procced type anything and press OK\nOtherwise press cancel."))
  {
    navigator.geolocation.getCurrentPosition(p => {

      let data = {
        lat: p.coords.latitude,
        long: p.coords.longitude,
        token: localStorage.getItem("token")
      }

      fetch("/api/addlocation",
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data), })
        .then(async result => {

          if (result.status >= 400) {
            let text = await result.text();
            throw new Error(text);
          }
          else {
            return result.json();
          }
        })
        .then(json => {

            console.log(json);
            alert("Location successfully Added to the map.");
        })
        .catch(err => {

          console.log(err.message);
          alert("Failed to add the location.\nTry later.");
        });
      
    });
  } 
  else console.log("Location terminated");
  
}




function removebtnMethod(event)
{
    if(event.target.nodeName === "BUTTON")
    {

        let targetdiv = event.target.parentNode.parentNode;
        let targetName = event.target.parentNode.parentNode.children[1].children[0].textContent;
        let data = {
          eventName : targetName,
          token: localStorage.getItem("token")
        };
        
      fetch("/api/deleteEvent",
        { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data), })
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

          console.log(json);
          created.removeChild(targetdiv);
        })  
        .catch(err => alert(err.message));// fetch ends here
       
    }//if ends here
    else return;
}




function getevents()
{
  let data = {token : localStorage.getItem("token")};

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

      for(let j of json)
      {
        let div = document.createElement("div");
        div.classList.add("eventCard");

        let ih = '<aside><button>Remove</button></aside>' +
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


async function varify()
{
    let number = Math.floor(Math.random() * 11345);
    let vdata = {
      token: localStorage.getItem("token"),
      number: number
    };

    let res = await fetch("/api/sendEmail",
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(vdata), });


    if(res.status === 200)
    {
      modal.classList.toggle("on");

      let otp = await new Promise((res, rej) => modalBtn.addEventListener('click', e => res(modalInput.value)));

        if (Number(otp) === number)
        {
          modal.classList.toggle("on");
          varified();
          return;
        } 
        else {

            localStorage.removeItem("token");
            window.location.replace("../NGOlogin/NGOlogin.html");
            throw new Error("Varification Failed");
        }

    }else
    {
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
  .then(async result => {

      if (result.status >= 400) {
        let text = await result.text();
        throw new Error(text);
      } else {
        return result.text();
      }
    })
    .then(text => {
      console.log(text);
    })
    .catch((err) => console.log(err.message)); // fetch ends here
}



/*-----------------Utility methods----------------------------------------------- */

function validform()
{
  // Input check
  if (eventname.value.trim().length < 3 || eventtime.value.trim().length < 5 ||
      eventdate.value.length === 0 || eventaddress.value.trim().length < 5 ||
      !(/^[A-Za-z\s\.]+$/.test(eventname.value.trim())))
  {
    alert("invalid form !");
    return false;
  }  

  if (!validTime())
  {
    alert("invalid Time.\nValid form : (e.g) 03:15 pm.");
    return false;
  } 

  if (!validDate())
  {
    alert("Select a valid future date");
    return false;
  }

  return true;
}




function validTime()
{
  if (!(/^\d\d:\d\d\s*[PpAa][Mm]$/.test(eventtime.value.trim()))) return false;
  let hm = /^(\d\d):(\d\d)\s*[PpAa][Mm]$/.exec(eventtime.value.trim());

  let h = Number(hm[1]);
  let m = Number(hm[2]);

  if(h > 12 || m > 59) return false;
  else return true;
}

function validDate()
{
  let date = new Date();

  let currentyear = date.getFullYear();
  let currentmonth = date.getMonth()+1;
  let currentday = date.getDate();
  
  let [year , month , day] = eventdate.value.split("-").map(i => Number(i));

  //Date validation
  if (currentyear > year) {
    return false;
  }
  else if (currentyear === year) {
    if (currentmonth > month) {
      return false;
    }
    else if (currentmonth === month) {
      if (currentday >= day) {
        
        return false;
      }
    }
  }
  return true;
}
/*---------------------------------Listeners ------------------------------------------------- */



searchbar.addEventListener("click", event => {

  if (event.target.id === "user") {
    localStorage.setItem("Q", "Uquery");
    toserch.click();
  }
  else if (event.target.id === "ngo") {
    localStorage.setItem("Q", "Nquery");
    toserch.click();
  }
  else if (event.target.id === "search") {
    if (/^[A-Za-z\s\.]+$/.test(query.value.trim()) && query.value.trim().length < 100) {
      localStorage.setItem("Q", query.value.trim());
      toserch.click();
    }
  }
});


logoutBtn.addEventListener("click", event => {
  localStorage.removeItem("token");
  window.location.replace("../NGOlogin/NGOlogin.html");
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


fileInput.addEventListener("change", e => {

  let file = fileInput.files[0];

  if (!(/^image\//.test(file.type)) || (file.size / 1020) / 1020 > 2) {
    alert("Please select the valid image file.\nThe image size should be less the 2 MB.");
    return;
  }

  let reader = new FileReader;

  reader.addEventListener("load", e => {

    saveImage(reader.result)
      .then(json => {

        dp.style.backgroundImage = "url('" + json.url + "')";
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

async function saveImage(dataURL) {
  let data = {

    url: dataURL,
    token: localStorage.getItem("token"),
    user: false
  };

  let res = await fetch("/api/saveImg", {

    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (res.status >= 400) throw new Error(await res.text());


  let json = await res.json();

  return json;
}








function displayCharts()
{

/*-----------------------------------------chart 1 --------------------------------------- */
  chart_1 = new Chart(canvas_1, {
    type: 'bar',
    data: {
      labels: ['Books', 'Clothes', 'Food', 'Stationery', 'Monetory', 'Utensil'],
      datasets: [{
        label: 'Donsation Ratio',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });

  /*-----------------------------------------chart 2 --------------------------------------- */
  chart_2 = new Chart(canvas_2, {
    type: 'bar',
    data: {
      labels: ['13-17', '18-22', '23-40', '41-60'],
      datasets: [{
        label: 'Percentage',
        data: [5, 75,10,10],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });


  /*-----------------------------------------chart 3 --------------------------------------- */
  chart_3 = new Chart(canvas_3, {
    type: 'bar',
    data: {
      labels: ['Pick Up Service', 'Donation Camp/Center', 'Online'],
      datasets: [{
        label: 'Preference Ratio',
        data: [ 3, 12, 5],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });



  /*-----------------------------------------chart 4 --------------------------------------- */
  chart_4 = new Chart(canvas_4, {
    type: 'bar',
    data: {
      labels: ['0rs - 500rs', '500rs - 10,000rs', 'Greater than 10,000rs', "Don't prefer to Donate money"],
      datasets: [{
        label: 'Preference Ratio',
        data: [10, 5, 2, 7],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)'
     
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });



  /*-----------------------------------------chart 5 --------------------------------------- */
  chart_5 = new Chart(canvas_5, {
    type: 'bar',
    data: {
      labels: ['Cash', 'E-Wallet', 'Net Banking', 'Credit/Debit Card', 'UPI', 'Banks'],
      datasets: [{
        label: 'Preference Ratio',
        data: [12, 3, 3, 6, 2, 6],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });


}
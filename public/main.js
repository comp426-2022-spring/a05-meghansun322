// Focus div based on nav button click
const homeNav = document.getElementById("home");
const singleNav = document.getElementById("singlenav");
const multipleNav = document.getElementById("multiplenav");
const guessNav = document.getElementById("guessnav");

function show(id) {
  // Resets
  document.getElementById("home").style = "none";
  document.getElementById("singleFlip").style = "none";
  document.getElementById("multiFlip").style = "none";
  document.getElementById("guessAndFlip").style = "none";
  // Displays
  var x = document.getElementById(id);
  x.style.display = "block";
}
// Flip one coin and show coin image to match result when button clicked

// Button coin flip element
const coin = document.getElementById("singleFlipButton");
// Add event listener for coin button
coin.addEventListener("click", flipCoin);
function flipCoin() {
  fetch("http://localhost:5000/app/flip/", { mode: "cors" })
    .then(function (response) {
      return response.json();
    })
    .then(function (result) {
      console.log(result);
      document.getElementById("singleCoinResult").innerHTML = result.flip;
      document.getElementById("singleCoinResult").style.display = "block";
      document.getElementById("singleCoin").style.display = "block";
      document
        .getElementById("singleCoin")
        .setAttribute(
          "src",
          "/a05-meghansun322/public/assets/img/" + result.flip + ".png"
        );
      console.log("");
      // coin.disabled = true;
    });
}

// Flip multiple coins and show coin images in table as well as summary results
// Enter number and press button to activate coin flip series
const multiple = document.getElementById("coins");
// Add event listener for coin button
multiple.addEventListener("submit", flipCoins);

async function flipCoins(event) {
  event.preventDefault();
  // Resets display
  let i = 0;
  while (i < 10) {
    document.getElementById("coinImage" + i).style.display = "none";
    i = i + 1;
  }

  const formEvent = event.currentTarget;
  const formData = new FormData(formEvent);
  const plainFormData = Object.fromEntries(formData.entries());
  console.log(plainFormData.number);
  var requestURL = "http://localhost:5000/app/flips/" + plainFormData.number;
  fetch(requestURL, {
    mode: "cors",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (result) {
      console.log(result);
      // document.getElementById("multiResult").innerHTML = result.raw;
      const results = result.raw;
      const summary = result.summary;
      console.log(results);
      console.log(JSON.stringify(summary));
      let i = 0;
      while (i < results.length) {
        document
          .getElementById("coinImage" + i)
          .setAttribute(
            "src",
            "/a05-meghansun322/public/assets/img/" + results[i] + ".png"
          );
        document.getElementById("coinImage" + i).style.display = "block";
        i = i + 1;
      }
      document.getElementById("multiFlipResult").innerHTML =
        "Heads: " + summary.heads + "  | Tails: " + summary.tails;
    });
}
// Guess a flip by clicking either heads or tails button
// const guess = document.getElementById("guessForm");

// guess.addEventListener("submit", callAndFlip);

// function callAndFlip(event) {
//   event.preventDefault();

//   const formEvent = event.currentTarget;
//   const formData = new FormData(formEvent);
//   const plainFormData = Object.fromEntries(formData.entries());
//   const call = plainFormData.call;
//   var requestURL = "http://localhost:5000/app/flip/call/";
//   fetch(requestURL, {
//     method: "POST",
//     mode: "cors",
//     body: call,
//   })
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (result) {
//       console.log(result);
//     });
// }

// Our flip many coins form
const coins = document.getElementById("guessForm");
// Add event listener for coins form
coins.addEventListener("submit", callAndFlip);
// Create the submit handler
async function callAndFlip(event) {
  event.preventDefault();

  const url = "http://localhost:5000/app/flip/call/";

  const formEvent = event.currentTarget;

  try {
    const formData = new FormData(formEvent);
    const flips = await sendFlips({ url, formData });

    console.log(flips);
    document.getElementById("heads").innerHTML =
      "Heads: " + flips.summary.heads;
    document.getElementById("tails").innerHTML =
      "Tails: " + flips.summary.tails;
  } catch (error) {
    console.log(error);
  }
}
// Create a data sender
async function sendFlips({ url, formData }) {
  const plainFormData = Object.fromEntries(formData.entries());
  const formDataJson = JSON.stringify(plainFormData);
  console.log(formDataJson);

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: formDataJson,
  };

  const response = await fetch(url, options);
  return response.json();
}

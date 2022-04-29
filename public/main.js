// Focus div based on nav button click
const homeNav = document.getElementById("home");
const singleNav = document.getElementById("singlenav");
const multipleNav = document.getElementById("multiplenav");
const guessNav = document.getElementById("guessnav");

// displays text for each function
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
  const endpoint = "app/flip/";
  const url = document.baseURI + endpoint;
  fetch(url, { mode: "cors" })
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
        .setAttribute("src", "/assets/img/" + result.flip + ".png");
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
  const endpoint = "app/flips/";
  const url = document.baseURI + endpoint;
  var requestURL = url + plainFormData.number;
  fetch(requestURL, {
    mode: "cors",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (result) {
      console.log(result);
      const results = result.raw;
      const summary = result.summary;
      console.log(results);
      console.log(JSON.stringify(summary));
      let i = 0;
      while (i < results.length) {
        document
          .getElementById("coinImage" + i)
          .setAttribute("src", "/assets/img/" + results[i] + ".png");
        document.getElementById("coinImage" + i).style.display = "block";
        i = i + 1;
      }
      document.getElementById("multiFlipResult").innerHTML =
        "Heads: " + summary.heads + "  | Tails: " + summary.tails;
    });
}

// Our flip many coins form
const guessHeads = document.getElementById("guessHeads");
const guessTails = document.getElementById("guessTails");
// Add event listener for coins form
guessHeads.addEventListener("submit", callAndFlip);
guessTails.addEventListener("submit", callAndFlip);
// Create the submit handler
async function callAndFlip(event) {
  event.preventDefault();
  const call = event.currentTarget.innerHTML;
  const endpoint = "app/flip/call/";
  const url = document.baseURI + endpoint;
  console.log("url", url);

  try {
    const flips = await sendFlips({ url, call });
    console.log("flips", flips);
    document.getElementById("call").innerHTML = "Call: " + flips.call;
    document.getElementById("theFlip").innerHTML = "Flip: " + flips.flip;
    document.getElementById("theResult").innerHTML = "Result: " + flips.result;
  } catch (error) {
    console.log(error);
  }
}
// Create a data sender
async function sendFlips({ url, call }) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      guess: call,
    }),
  };

  const response = await fetch(url, options);
  return await response.json();
}

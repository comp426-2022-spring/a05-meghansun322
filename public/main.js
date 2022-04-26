// Focus div based on nav button click

// Flip one coin and show coin image to match result when button clicked

// Button coin flip element
const coin = document.getElementById("coin");
// Add event listener for coin button
coin.addEventListener("click", flipCoin);
function flipCoin() {
  fetch("http://localhost:5000/app/flip/", { mode: "cors" })
    .then(function (response) {
      return response.json();
    })
    .then(function (result) {
      console.log(result);
      document.getElementById("coinResult").innerHTML = result.flip;
      document.getElementById("coinResult").style.display = "block";
      document
        .getElementById("coinImage00")
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

  const endpoint = "app/flip/coins/";
  const url = document.baseURI + endpoint;

  const formEvent = event.currentTarget;
  const formData = new FormData(formEvent);
  const plainFormData = Object.fromEntries(formData.entries());
  const formDataJson = JSON.stringify(plainFormData);
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
    });
  // try {
  //   const formData = new FormData(formEvent);
  //   const flips = await sendFlips({ url, formData });

  //   console.log(flips);
  //   document.getElementById("heads").innerHTML =
  //     "Heads: " + flips.summary.heads;
  //   document.getElementById("tails").innerHTML =
  //     "Tails: " + flips.summary.tails;
  // } catch (error) {
  //   console.log(error);
  // }
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
// Guess a flip by clicking either heads or tails button

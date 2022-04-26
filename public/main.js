// Focus div based on nav button click

// Flip one coin and show coin image to match result when button clicked

document.addEventListener("click", activeNow);

function activeNow() {
  const active_now = document.activeElement.tagName;
  document.getElementById("active").innerHTML = active_now;
}

const coin = document.getElementById("coin");

coin.addEventListener("click", flipCoin);

// Fetches flip endpoint
function flipCoin() {
  fetch("http://localhost:5000/app/flip")
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((json) => {
      console.log(json);
      document.getElementById("result").innerHTML = json.flip;
    });
}

// Flip multiple coins and show coin images in table as well as summary results
// Enter number and press button to activate coin flip series

// Guess a flip by clicking either heads or tails button

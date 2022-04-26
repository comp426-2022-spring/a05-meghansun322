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
        .getElementById("coinImage")
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

// Guess a flip by clicking either heads or tails button

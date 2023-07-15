// This function adds fadeOutLeft and fadeOutRight (keyframes) to .right-container and .left-container
function fadeOutLeftRight(url) {

    var rightContainer = document.getElementById("right-container");
    var leftContainer = document.getElementById("left-container");

    // Add css animation
    rightContainer.style.animation = "fadeOutRight 1s ease-in-out forwards";
    leftContainer.style.animation = "fadeOutLeft 1s ease-in-out forwards";

    setTimeout(function () {
        // Redirect to url
        window.location.href = url;
    }, 1000);
}
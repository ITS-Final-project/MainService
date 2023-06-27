function getAnimationState() {
    const animationState = getComputedStyle(document.body).getPropertyValue('background-position');

    localStorage.setItem('animationState', animationState);
}

function loadAnimationState() {
    var animationState = localStorage.getItem('animationState');

    document.body.style.animation = `none`;

    var animation = `@keyframes fastFinish {
        from {
            background-position: ${animationState};
        }

        to {
            background-position: 0% 50%;
        }
    }`

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = animation;
    document.getElementsByTagName('head')[0].appendChild(style);

    document.body.style.animation = `fastFinish 5s linear 1 forwards`;
    document.body.style.backgroundPosition = animationState;

    setTimeout(function() {
        document.body.style.animation = `gradient 20s linear infinite`;
        document.body.style.backgroundPosition = `0% 50%`;
    }, 5000)
}

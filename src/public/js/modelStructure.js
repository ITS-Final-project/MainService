const lowUrl = "http://localhost:3000/static/images/classificator/low.svg"
const mediumUrl = "http://localhost:3000/static/images/classificator/mid.svg"
const highUrl = "http://localhost:3000/static/images/classificator/high.svg"

const lowHihgUrl = "http://localhost:3000/static/images/classificator/low_high.svg"
const lowMediumUrl = "http://localhost:3000/static/images/classificator/low_mid.svg"
const mediumHighUrl = "http://localhost:3000/static/images/classificator/mid_high.svg"


function getStructure(){
    var url = "http://localhost:3000/admin/classificator/structure";
    var container = document.getElementById("modelStructure");
    container.innerHTML = "";
    $.ajax({
        url: url,
        type: 'GET',
        success: function(data){
            showStructure(data.result);
        },
        error: function(data){
            console.log(data);
        }
    });
}

function showStructure(data){
    var container = document.getElementById("modelStructure");

    var layers = data.layers;
    var activations = data.activations;
    showTextData(data);
    showLayers(container, layers, activations);
}

function showTextData(data){
    var inLayer = document.getElementById("inLayer");
    var outLayer = document.getElementById("outLayer");
    var countLayer = document.getElementById("countLayer");
    var accuracy = document.getElementById("accuracy");
    var lr = document.getElementById("lr");

    console.log(data);
    inLayer.innerHTML = data.layers[0];
    outLayer.innerHTML = data.layers[data.layers.length - 1];
    countLayer.innerHTML = data.layers.length;
    accuracy.innerHTML = data.accuracy;
    lr.innerHTML = data.learning_rate;

}

function showLayers(container, layers, activations){
    var smallestLayer = Math.min(...layers);
    var biggestLayer = Math.max(...layers);
    var midLayers = layers.filter(x => x != smallestLayer && x != biggestLayer);

    for (var i = 0; i < layers.length; i++){
        // Create new image tag
        var img = document.createElement("img");
        var url = getImageUrl(layers[i], smallestLayer, biggestLayer);

        var statContainer = document.createElement("div");
        statContainer.classList.add(
            "d-flex",
            "flex-column",
            "align-items-center", 
            "card",
            "m-2");

        var layerStat = document.createElement("p");
        layerStat.classList.add("layerStat");
        layerStat.innerHTML = layers[i];
            
        var activationStat = document.createElement("p");
        activationStat.classList.add("activationStat");
        activationStat.innerHTML = activations[i - 1] ? activations[i - 1] : "------";

        statContainer.classList.add("stat-container");
        statContainer.appendChild(layerStat);
        statContainer.appendChild(activationStat);

        // Add layer image
        img.setAttribute("src", url);
        img.setAttribute("alt", "Responsive image");
        img.classList.add("figure");
        
        statContainer.appendChild(img);

        container.appendChild(statContainer);

        if (i < layers.length - 1){
            var arrow = document.createElement("i");
            arrow.classList.add("bi", "bi-arrow-right", "arrow");
            arrow.classList.add("arrow");

            var verticalAlignDiv = document.createElement("div");
            verticalAlignDiv.classList.add("d-flex", "flex-column", "align-items-center", "justify-content-center", "h-100");
            verticalAlignDiv.appendChild(arrow);

            container.appendChild(verticalAlignDiv);
            
        }
    }
}


function getImageUrl(layer, smallestLayer, biggestLayer){
    if (layer == smallestLayer) {
        return lowUrl;
    }

    if (layer == biggestLayer) {
        return highUrl;
    }

    return mediumUrl;
}


$(document).ready(function(){
    getStructure();
});
// Function for displaying topic buttons
function renderButtons() {
    $("#buttons-view").empty();
    var buttonDisplay = '';
    for (i = 0; i < topics.length; i++) {
        buttonDisplay += '<button type="button" class="btn btn-secondary btn-sm topic-button" data-topic="' + topics[i] + '">' + camelize(topics[i]) + '</button>';
    }
    $("#buttons-view").append(buttonDisplay);
}

function camelize(str) {
    return str.split(/\s+|-|_/).map(function (word, index) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
}

function fetchGiphys(button) {
    buttonTopic = $(button).attr("data-topic");
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + buttonTopic +
        "&api_key=KNIJIp9YyOrkUXM2mOjvZRtpKVDflwVM&limit=10";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var results = response.data;
        cardGroupHTML = '<h3>' + camelize(buttonTopic) + '</h3><div class="card-deck">';
        var topicImage = "";
        for (var i = 0; i < results.length; i++) {
            topicImage += "<div class='card mb-4'><img src='" + results[i].images.fixed_height_still.url + "' data-still='" + results[i].images.fixed_height_still.url + "' data-animate='" + results[i].images.fixed_height.url + "' data-state='still' class='card-img-top img-fluid gif' alt='" + results[i].title + "'>";
            topicImage += "<div class='card-body'><h4 class='card-title'>" + results[i].title + "</h4></div>";
            topicImage += "<div class='card-footer'><small class='text-muted'>Rating: " + results[i].rating.toUpperCase() + "</small>";
            topicImage += '<a href="' + results[i].images.original.url + '" download="' + results[i].title + '"><button class="btn btn-outline-secondary btn-sm download-button">Download</button></a></div></div>';
            if ((i + 1) % 2 === 0) {
                topicImage += "<div class='w-100 d-none d-sm-block d-md-block d-lg-block d-xl-block'><!-- wrap every 2 on sm--></div>";
            }
        }
        cardGroupHTML += topicImage + "</div>";
        $("#dynamic-gif").prepend(cardGroupHTML);
    });
}

function fetchFavorites() {
    favoriteGroup = '<h3>Favorites</h3>';
    $("#dynamic-favorite").html(favoriteGroup);
}

function toggleAnimation(gif) {
    var state = $(gif).attr("data-state");
    if (state === "still") {
        $(gif).attr("src", $(gif).attr("data-animate"));
        $(gif).attr("data-state", "animate");
    } else {
        $(gif).attr("src", $(gif).attr("data-still"));
        $(gif).attr("data-state", "still");
    }
}

function addTopic() {
    event.preventDefault();
    if ($("#topic-input").val() != '') {
        // This line grabs the input from the textbox
        var topic = $("#topic-input").val().trim();
        if (!topics.includes(topic)) {
            // Adding topic from the textbox to our array
            topics.push(topic);
            // Calling renderButtons which handles the processing of our topic array
            renderButtons();
        }
    }
}

var topics = ['shrimp-kabobs', 'shrimp creole', 'shrimp gumbo', 'pan fried shrimp', 'deep fried shrimp', 'stir-fried shrimp', 'pineapple shrimp', 'lemon shrimp', 'coconut shrimp', 'pepper shrimp', 'shrimp soup', 'shrimp stew', 'shrimp salad', 'shrimp and potatoes', 'shrimp burger', 'shrimp sandwich'];

$(document).ready(function () {
    renderButtons();
    fetchFavorites();
    $(document).on('click', '#add-topic', function () {
        addTopic();
    });
    $(document).on('click', '.topic-button', function () {
        fetchGiphys(this);
    });
    $(document).on('click', '.gif', function () {
        toggleAnimation(this);
    });
});
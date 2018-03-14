// display buttons for shrimp styles
function renderButtons() {
    // empty the button view
    $("#buttons-view").empty();
    var buttonDisplay = '';
    // loop through button array
    for (i = 0; i < topics.length; i++) {
        // create the botton html
        buttonDisplay += '<button type="button" class="btn btn-secondary btn-sm topic-button" data-topic="' + topics[i] + '">' + camelize(topics[i]) + '</button>';
    }
    // pop into button view
    $("#buttons-view").append(buttonDisplay);
}

// camel case
function camelize(str) {
    // split on spaces, hyphens, and underscores
    return str.split(/\s+|-|_/).map(function (word, index) {
        //upper case the first character
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
}

// generate a bootstrap 4 card
function createCard(favorite, stillURL, animateURL, title, rating, originalURL, id) {
    var cardHTML = "";
    // create card html
    cardHTML += "<div class='card mb-4'><img src='" + stillURL + "' data-still='" + stillURL + "' data-animate='" + animateURL + "' data-state='still' class='card-img-top img-fluid gif' alt='" + title + "'>";
    cardHTML += "<div class='card-body'><h4 class='card-title'>" + title + "</h4></div>";
    cardHTML += "<div class='card-footer'><small class='text-muted'><p>Rating: " + rating.toUpperCase() + "</small></p>";
    // make a different favorite button if already favorited
    if (favorite === "favorite") {
        cardHTML += '<a href="' + originalURL + '" download="' + id + '.gif"><button class="btn btn-outline-secondary btn-sm download-button" data="' + originalURL + '">Download</button></a><button class="btn btn-outline-secondary btn-sm favorite-button" id="' + id + '" stillURL="' + stillURL + '" animateURL="' + animateURL + '"  gif-title="' + title + '"  rating="' + rating + '"  originalURL="' + originalURL + '" >Favorite</button></div></div>';
    } else {
        cardHTML += '<a href="' + originalURL + '" download="' + id + '.gif"><button class="btn btn-outline-secondary btn-sm download-button" data="' + originalURL + '">Download</button></a><button class="btn btn-outline-secondary btn-sm unfavorite-button" id="' + id + '">Unfavorite</button></div></div>';
    }
    return cardHTML;
}

// pull the gifs from giphy api
function fetchGiphys(button) {
    // get the user entered shrimp style
    buttonTopic = $(button).attr("data-topic");
    // build the giphy querystring
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + buttonTopic +
        "&api_key=KNIJIp9YyOrkUXM2mOjvZRtpKVDflwVM&limit=10";
    // submit ajax request
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var results = response.data;
        cardGroupHTML = '<h3>' + camelize(buttonTopic) + '</h3><div class="card-deck card-deck-right-border">';
        var cardHTML = "";
        for (var i = 0; i < results.length; i++) {
            // call the html card builder function
            cardHTML += createCard("favorite", results[i].images.fixed_height_still.url, results[i].images.fixed_height.url, results[i].title, results[i].rating, results[i].images.original.url, results[i].id);
            if ((i + 1) % 2 === 0) {
                cardHTML += "<div class='w-100 d-none d-sm-block d-md-block d-lg-block d-xl-block'><!-- wrap every 2 on sm--></div>";
            }
        }
        cardGroupHTML += cardHTML + "</div>";
        // add the cards to the card div
        $("#dynamic-gif").prepend(cardGroupHTML);
    });
}

// add favorites to local storage
function addFavorite(button) {
    var favorites = [];
    // parse the serialized data back into an aray of objects
    favorites = JSON.parse(localStorage.getItem('favorites'));
    // set values
    var newFavorite = {
        id: $(button).attr("id"),
        stillURL: $(button).attr("stillURL"),
        animateURL: $(button).attr("animateURL"),
        title: $(button).attr("gif-title"),
        rating: $(button).attr("rating"),
        originalURL: $(button).attr("originalURL"),
    }
    // push the new object onto the array
    favorites.push(newFavorite);
    // re-serialize the array back into a string and store it in localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));
    // display the favorites
    renderFavorites();
}

function removeFavorite(button) {
    // parse the serialized data back into an aray of objects
    var favorites = JSON.parse(localStorage.getItem('favorites'));
    // if local storage favorites is an array
    if (Array.isArray(favorites)) {
        // loop through the array
        for (var i = 0; i < favorites.length; i++) {
            // if the favorite has the same id as the unfavorited button
            if (favorites[i].id == $(button).attr("id")) {
                //remove the element from the array
                favorites.splice(i, 1);
                // re-serialize the array back into a string and store it in localStorage
                localStorage.setItem('favorites', JSON.stringify(favorites));
            }
        }
    }
    renderFavorites();
}

function renderFavorites() {
    // get the current favorites from local storage
    var favorites = JSON.parse(localStorage.getItem("favorites"));
    // see if there is an anything there
    if (!Array.isArray(favorites)) {
        //if not, put a holder in place
        favorites = [];
        // put the array into local storage
        localStorage.setItem('favorites', JSON.stringify(favorites));
    } else {
        // if there is something there, pull it out and display it
        var cardHTML = '<h3>Favorites</h3><div class="card-deck">';
        // loop through array
        for (var i = 0; i < favorites.length; i++) {
            // call the html card builder function
            cardHTML += createCard("unfavorite", favorites[i].stillURL, favorites[i].animateURL, favorites[i].title, favorites[i].rating, favorites[i].originalURL, favorites[i].id);
            cardHTML += "<div class='w-100 d-none d-sm-block d-md-block d-lg-block d-xl-block'><!-- wrap every 1 on sm--></div>";
        }
        // add the cards to the favorite div
        $("#dynamic-favorite").html(cardHTML);
    }
}

// change the gif from still to animated
function toggleAnimation(gif) {
    // get the current state, and swap it
    var state = $(gif).attr("data-state");
    if (state === "still") {
        $(gif).attr("src", $(gif).attr("data-animate"));
        $(gif).attr("data-state", "animate");
    } else {
        $(gif).attr("src", $(gif).attr("data-still"));
        $(gif).attr("data-state", "still");
    }
}

// add a new shrimp style
function addTopic() {
    event.preventDefault();
    if ($("#topic-input").val() != '') {
        // grab the input from the textbox
        var topic = $("#topic-input").val().trim();
        if (!topics.includes(topic)) {
            // add topic from the textbox to array
            topics.push(topic);
            // renderButtons - process and display as buttons
            renderButtons();
        }
    }
}

// initial shrimp styles
var topics = ['shrimp-kabobs', 'shrimp creole', 'shrimp gumbo', 'pan fried shrimp', 'deep fried shrimp', 'stir-fried shrimp', 'pineapple shrimp', 'lemon shrimp', 'coconut shrimp', 'pepper shrimp', 'shrimp soup', 'shrimp stew', 'shrimp salad', 'shrimp and potatoes', 'shrimp burger', 'shrimp sandwich'];

// on ready
$(document).ready(function () {
    // display current shrimp style buttons
    renderButtons();
    // display current favorites
    renderFavorites();
    // look for add topic button clicks - add the shrimp style button
    $(document).on('click', '#add-topic', function () {
        addTopic();
    });
    // look for shrimp style button clicks - get the giphys
    $(document).on('click', '.topic-button', function () {
        fetchGiphys(this);
    });
    // 
    $(document).on('click', '.gif', function () {
        toggleAnimation(this);
    });

    $(document).on('click', '.favorite-button', function () {
        addFavorite(this);
    });

    // $(document).on('click', '.download-button', function () {
    //     download($(this).attr("data"));
    // });
    $(document).on('click', '.unfavorite-button', function () {
        removeFavorite(this);
    });
});
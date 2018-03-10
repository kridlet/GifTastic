// Function for displaying topic buttons
function renderButtons() {
    $("#buttons-view").empty();
    for (i = 0; i < topics.length; i++) {
        $("#buttons-view").append("<button class='topic-button' data-topic='" + topics[i] + "'>" + topics[i] + "</button>");
    }
}

function fetchGiphys(button) {
    console.log(button);
    buttonTopic = $(button).attr("data-topic");
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + buttonTopic +
        "&api_key=KNIJIp9YyOrkUXM2mOjvZRtpKVDflwVM&limit=10";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var results = response.data;
        console.log(results);
        for (var i = 0; i < results.length; i++) {
            topicDiv = $("<div>");
            topicImage = $("<img>");
            $(topicImage).attr('src', results[i].images.fixed_height_still.url);
            $(topicImage).attr('data-still', results[i].images.fixed_height_still.url);
            $(topicImage).attr('data-animate', results[i].images.fixed_height.url);
            $(topicImage).attr('data-state', 'still');
            $(topicImage).attr('class', 'gif');

            $(topicDiv).append(topicImage);
            $(topicDiv).append('<p>' + results[i].rating + '</p>');
            $("#gifs-appear-here").prepend(topicDiv);
        }
    });
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
    // This line grabs the input from the textbox
    var topic = $("#topic-input").val().trim();
    if (!topics.includes(topic)) {
        // Adding topic from the textbox to our array
        topics.push(topic);
        // Calling renderButtons which handles the processing of our topic array
        renderButtons();
    }
}

var topics = ['cats', 'dogs', 'birds'];

$(document).ready(function () {
    renderButtons();
    $(document).on('click','#add-topic', function () {
        console.log('add topic click - add topic');
        addTopic();
    });
    $(document).on('click','.topic-button', function () {
        console.log('topic click - fetch giphy');
        fetchGiphys(this);
    });
    $(document).on('click','.gif', function () {
        console.log('gif click - toggle animation');
        toggleAnimation(this);
    });
});
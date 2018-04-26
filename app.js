
'use strict';

$(document).ready(function(){

  // Initialize global variables
  var totalListings;
  var ajaxpagenumber;
  var title;
  var year;
  var url;
  var data;


  // Once user submits search, clear any previous search results
  // Then make AJAX call using current search terms
  $("#submit").on("click", function(event){
    event.preventDefault();

    // Clear poster images and titles from previous searches
    $("#movies").empty();
    // And clear any existing pagination
    $("#pagination").remove();

    // Get current search terms
    title = $("#search").val();
    year = $("#year").val();
    ajaxpagenumber = 1;
    url = "http://www.omdbapi.com/?i=tt3896198&apikey=61bacb12";
    data = {
       s: title,
       y: year,
       type: "movie",
       r: "json",
       page: ajaxpagenumber,
       callback: ""
    };

    // Make ajax call
    $.getJSON(url, data, displayResults).fail(ajaxFail);

  }); // ends on click



  // This function will insert search results into the html
  function displayResults(response){
    var html = "";
    // If there is no search data found, show error screen
    if (response.Response == "False") {
       html += "<li class='no-movies'>";
       html += "<i class='material-icons icon-help'>help_outline</i>No movies found that match: " + $("#search").val() + "</li>";
    // Else, cycle through response data
    } else {
       $.each(response.Search, function(index, movie){
         var poster;
         // If there's no poster available, use placeholder
         if (movie.Poster == "N/A"){
           poster = "<i class='material-icons poster-placeholder'>crop_original</i>";
         } else {
           poster = "<img class='movie-poster' src=" + movie.Poster + ">";
         }

         // Build html to be appended
         html += "<li>";
         html += "<div class='poster-wrap'><a href='http://www.imdb.com/title/" + movie.imdbID + "' target='_blank'>";
         html += poster;
         html += "</a></div>";
         html += "<span class='movie-title'>" + movie.Title + "</span>";
         html += "<span class='movie-year'>" + movie.Year + "</span>";
         html += "</li>";
       }); // ends each
    }
    // Then append search results to ul
    $("#movies").append(html);


    // Get totalResults value from API, then call pagination function
    totalListings = response.totalResults;
    paginate(totalListings);
  } // ends displayResults



  /* The API has already paginated the results into groups of 10.
     So, I fixed the CSS to display two rows of five across, because that's tidier
     Next, I will create function paginate(), which will calculate number of page links needed, and create them
  */

  function paginate(){
      // (Must round up or would get too few pages)
      var pagesNeeded = Math.ceil(totalListings/10);

      // Append a pagination div
      $("body").append("<footer id='pagination'><ul id='paginationlist'></ul></footer>");

      // Add the correct number of buttons to bottom of page, and set their contents and links.
      for (var i=0; i< pagesNeeded; i++){
        var newPageNumber = $("<li></li>");
        newPageNumber.text(i+1);
        $("#paginationlist").append(newPageNumber);

      }

   updateAjaxCall();
   } // ends paginate



/* This function will load a new page of search results when a page number is clicked on.
   To do that, it makes a new AJAX call, in which the API's "page" property is set to the
   number of the page that was clicked on.*/
  function updateAjaxCall(){

      $("#paginationlist li").click(function(){

        // Clear poster images and titles from previous searches
        $("#movies").empty();
        // And clear any existing pagination
        $("#pagination").remove();

        // Update query string data
        ajaxpagenumber = parseInt($(this).text());
        title = $("#search").val();
        year = $("#year").val();
        url = "http://www.omdbapi.com/?";
        data = {
           s: title,
           y: year,
           type: "movie",
           r: "json",
           page: ajaxpagenumber
        };
        // Make new AJAX call
        $.getJSON(url, data, displayResults).fail(ajaxFail);

      }); // ends anchor on click
  } // ends updateAjaxCall



  //Handle AJAX errors
  function ajaxFail(jqXHR) {

    var errorhtml = "";
    errorhtml += "<p>Sorry, there was a " + jqXHR.statusText + " error.</p>";

    $("#movies").append(errorhtml);
  }


}); // ends document ready

// Add DOM selectors to target input and UL movie list
const inp = document.querySelector("input");
const myMovieList = document.querySelector("ul");

// Create local storage if not created yet
if (!localStorage.myMovieDatabase) {
    localStorage.setItem("myMovieDatabase", JSON.stringify({}));
}
if (!localStorage.movieList) {
    localStorage.setItem("movieList", JSON.stringify([]));
}

// store local storage into variables
let movieList = JSON.parse(localStorage.getItem("movieList"));
console.log(movieList)
let myMovieDatabase = JSON.parse(localStorage.getItem("myMovieDatabase"));
const movieHistoryBox = document.getElementById("movieHistoryCard");

// Add table and header row to movie history
const movieHistoryTable = document.createElement("table");
movieHistoryBox.appendChild(movieHistoryTable);
const headerRow = document.createElement("tr");
const titleTh = document.createElement("th");
const watchedTh = document.createElement("th");
headerRow.appendChild(titleTh);
headerRow.appendChild(watchedTh);
movieHistoryTable.appendChild(headerRow);
titleTh.innerHTML = "Title";
watchedTh.innerHTML = "Watched";

// Add movies from local storage whenever the page is refreshed
for (movie of movieList) {
    addMovieLi(movie);
}

for (movie in myMovieDatabase) {
    addMovieHistory(movie);
}

// Clear the input after a user adds a movie
function clearInput() {
    inp.value = "";
}

// Delete all the <li>'s in the movie list
function clearMovies() {
    myMovieList.innerHTML = '';
    movieList = [];
    localStorage.setItem("movieList", JSON.stringify(movieList))
}

// Function for when the user clicks the [ADD MOVIE] button
function addMovie() {
    
    // Get value of input
    let userTypedText = inp.value;

    if (userTypedText === "") {
        alert("You must enter a movie name!");
        return;
    }

    // check if movie in movie history database
    let movieInDatabase = false
    Object.keys(myMovieDatabase).forEach((movie) => { 
        if (userTypedText.toLowerCase() == movie.toLowerCase()) {
            movieInDatabase = true;
            userTypedText = movie;
        } 
    })

    // check if movie in current movie list
    let movieInList = false;
    movieList.forEach((movie) => {
        if (userTypedText.toLowerCase() == movie.toLowerCase()) {
            movieInList = true;
        }
    });

    // add movie to list or add a watch count if movie already in movie database
    if (movieInDatabase === true) {
        myMovieDatabase[userTypedText] += 1;
        const watchedNum = document.getElementById(userTypedText.toLowerCase());
        watchedNum.textContent = String(parseInt(watchedNum.textContent) + 1);
        clearInput();
    }
    else {
        myMovieDatabase[userTypedText] = 1;
        movieList.push(userTypedText);

        addMovieLi(userTypedText);

        // Call the clearInput function to clear the input field
        clearInput();

        // Add movie to movie history
        addMovieHistory(userTypedText);
    }

    // add the updated list and database to the local storage
    localStorage.setItem("movieList", JSON.stringify(movieList))
    localStorage.setItem("myMovieDatabase", JSON.stringify(myMovieDatabase));

}


// Filters the movies based on the search
const filterTextBox = document.getElementById("filter");

filterTextBox.addEventListener("input", () => {
    length = filterTextBox.value.length;
    const moviesToFilter = [];

    // get movies that should be displayed based on the user's filter keyword
    for (movie of movieList) {
        if (length > 0) {
            if (movie.toLowerCase().includes(filterTextBox.value.toLowerCase())) {
                moviesToFilter.push(movie);
            }
        }
    }

    // Remove movies not in the filter list and get names to filter
    const moviesInList = myMovieList.querySelectorAll("li");
    const movieNamesInList = [];

    for (movie of moviesInList) {
        if (!moviesToFilter.includes(movie.innerHTML)) {
            movie.remove();
        }
        else {
            movieNamesInList.push(movie.innerHTML);
        }
    }

    // Add missing movies that are in filter list
    for (movie of moviesToFilter) {
        if (!movieNamesInList.includes(movie)) {
            addMovieLi(movie);
        }
    }

    // Add back all movies if input box is blank
    if (filterTextBox.value === "") {
        for (movie of movieList) {
            addMovieLi(movie);
        }
    }

})


// Creates a new list object of a text node and adds it to the movie list
function addMovieLi (movieName) {
    const li = document.createElement("li");
    const textToInsert = document.createTextNode(movieName);
    li.appendChild(textToInsert);
    myMovieList.appendChild(li);
    
}

// Creates table rows and adds them to the movie history card
function addMovieHistory(movieName) {
    const row = document.createElement("tr"); // <tr></tr>
    const titleCell = document.createElement("td"); // <td></td>
    const watchedCell = document.createElement("td");
    const rowText = document.createTextNode(movieName);
    const rowNum = document.createTextNode(myMovieDatabase[movieName]);
    titleCell.appendChild(rowText);
    watchedCell.appendChild(rowNum);
    watchedCell.id = movieName.toLowerCase();
    row.appendChild(titleCell);
    row.appendChild(watchedCell);
    movieHistoryTable.appendChild(row);
}
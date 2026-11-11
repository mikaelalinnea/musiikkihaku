//HTML-elementit haetaan
const artistSelect = document.getElementById("artistSelect");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const albums = document.getElementById("albums");

//Artisti valitaan dropdown-listasta
artistSelect.addEventListener("change", function () {
    searchInput.value = "";
    if (this.value !== "") {
        loadAlbums(this.value);
    }
});

//Artisti haetaan hakukentällä
searchBtn.addEventListener("click", function () {

    const artistName = 
    searchInput.value.trim();

    if (artistName !== "") {
        artistSelect.value = "";
        loadAlbums(artistName);
    }
});

//Artistin albumit haetaan Last.fm API:n kautta
function loadAlbums(artistName) {

    loadTopTracks(artistName);

    albums.innerHTML =
    "<p>Ladataan albumeita..</p>";

    fetch(
        "/.netlify/functions/topalbums?artist=" +
        encodeURIComponent(artistName)
    )

    .then(response => response.json())

    .then(data => {
        if (!data.topalbums) {
            document.getElementById("tracks").innerHTML = "";
            albums.innerHTML =
            "<p class='error-message'>Artistia ei löytynyt.</p>";
            return;
        }
        let output = "";
        const albumList =
        data.topalbums.album;

        for (let i = 0; i < albumList.length; i++) {
            let image =
            albumList[i].image[3]["#text"];
            if (image === "") {
                image = 
                "https://via.placeholder.com/300x300?text=No+Image";
            }
            output +=
            "<div class='album-card'>" + 
            "<img src='" + image + "'>" +
            "<h3>" +
            albumList[i].name +
            "</h3>" +
            "<a href='" +
            albumList[i].url +
            "' target='_blank'>Lisätietoja</a>" +

            "</div>";
        }
        albums.innerHTML = output;
    })
    .catch(error => {
        albums.innerHTML =
        "<p>Tietojen lataaminen epäonnistui.</p>";
        console.error(error);
    });
}

//Artistin kolme suosituinta kappaletta haetaanLast.fm API:n kautta
function loadTopTracks(artistName) {

    fetch(
        "/.netlify/functions/toptracks?artist=" +
        encodeURIComponent(artistName)
    )

    .then(response => response.json())

    .then(data => {
        let trackOutput =
        "<h2>" + artistName + " - suosituimmat kappaleet</h2>";

        for (let i = 0; i < 3; i++) {
            trackOutput +=
            "<p>" + 
            (i + 1) + 
            ". " +
            data.toptracks.track[i].name +
            "</p>";
        }

        document.getElementById("tracks").innerHTML = 
        trackOutput;
    })

    .catch(error => {
        console.error(error);
    });
}
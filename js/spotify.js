var spotifyApp = angular.module('spotifyApp', []);

var spotifyCtrl = spotifyApp.controller('spotifyCtrl', function($scope, $http) {
    var baseUrl = 'https://api.spotify.com/v1/search?type=';
    $scope.audioObject = {};
    $scope.getArtists = function() {
        clearSearches();
        $scope.albumSearch = null;
        $scope.trackSearch = null;
        $http.get(baseUrl + 'artist&query=' + $scope.artistSearch).success(function(response){
            $scope.artists = response.artists.items;
        });
    };

    $scope.getAlbums = function() {
        clearSearches();
        $scope.artistSearch = null;
        $scope.trackSearch = null;
        $http.get(baseUrl + 'album&query=' + $scope.albumSearch).success(function(response){
            $scope.albums = response.albums.items;
        });
    };

    $scope.getSongs = function() {
        clearSearches();
        $scope.artistSearch = null;
        $scope.albumSearch = null;
        $http.get(baseUrl + 'track&query=' + $scope.trackSearch).success(function(response){
            $scope.tracks = response.tracks.items;
        });
    };

    $scope.loadArtist = function(artist) {
        $scope.albums = [];
        $scope.tracks = [];
        $http.get('https://api.spotify.com/v1/artists/' + artist.id + '/albums').success(function(response){
            $scope.albums = response.items;
        });

        $http.get('https://api.spotify.com/v1/artists/' + artist.id + '/top-tracks').success(function(response){
            $scope.tracks = response.tracks;
        });
    };

    $scope.loadAlbum = function(album) {
        $scope.artists = [];
        $scope.tracks = [];
        $http.get('https://api.spotify.com/v1/albums/' + album.id).success(function(response){
            loadArtists(response.artists);

            response.tracks.items.forEach(function(track) {
                $http.get('https://api.spotify.com/v1/tracks/' + track.id).success(function(response){
                    $scope.tracks.push(response);
                });
            });
        });
    };

    $scope.loadTrack = function(track) {
        $scope.artists = [];
        $scope.albums = [];
        $http.get('https://api.spotify.com/v1/tracks/' + track.id).success(function(response){
            loadArtists(response.artists);
            $scope.albums = [response.album];
        });
        $scope.tracks.forEach(function(t) { t.selected = false });
        track.selected = true;
        console.log($scope.tracks);
        console.log(track);
    };

    $scope.play = function(song) {
        if ($scope.currentSong == song) {
            $scope.audioObject.pause();
            $scope.currentSong = false;
        } else {
            if($scope.audioObject.pause != undefined) $scope.audioObject.pause();
            $scope.audioObject = new Audio(song);
            $scope.audioObject.play();
            $scope.currentSong = song;
        }
    };

    function loadArtists(artists) {
        artists.forEach(function(artist) {
            $http.get('https://api.spotify.com/v1/artists/' + artist.id).success(function(response){
                $scope.artists.push(response);
            });
        });
    }

    function clearSearches() {
        $scope.artists = [];
        $scope.albums = [];
        $scope.tracks = [];
    }
});

// Add tool tips to anything with a title property
$('body').tooltip({
    selector: '[title]'
});
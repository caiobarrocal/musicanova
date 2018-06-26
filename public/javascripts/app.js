angular.module('nodeMusic', [])
.controller('mainController', ($scope, $http) => {
  $scope.formData = {};
  $scope.musicData = {};
  $scope.friendsData = {};
  $scope.genderData = {};
  $scope.artistData = {};

  // Get all todos
  $http.get('/api/v1/gender')
  .success((data) => {
    $scope.genderData = data;
    console.log(data);
  })
  .error((error) => {
    console.log('Error: ' + error);
  });

  // Get all todos
  $http.get('/api/v1/sugartists')
  .success((data) => {
    $scope.artistData = data;
    console.log(data);
  })
  .error((error) => {
    console.log('Error: ' + error);
  });

  // Get all music
  /*
  $scope.getMusic = () => {
    $http.get('/api/v1/searchmusic')
    .success((data) => {
      $scope.buscaData = data;
      console.log(data);
    })
    .error((error) => {
      console.log('Error: ' + error);
    });
  };
*/
  // CREATION METHODS

  // Create a new album
  $scope.createAlbum = () => {
    $http.post('/api/v1/album', $scope.formAlbum)
    .success((data) => {
      $scope.formAlbum = {};
      $scope.todoAlbum = data;
      console.log(data);
    })
    .error((error) => {
      console.log('Error: ' + error);
    });
  };

  // Create a new artist
  // $scope.createArtist = () => {
  //   $http.post('/api/v1/artista', $scope.formArtista)
  //   .success((data) => {
  //     $scope.formArtista = {};
  //     $scope.todoArtista = data;
  //     console.log(data);
  //   })
  //   .error((error) => {
  //     console.log('Error: ' + error);
  //   });
  // };

  // Create a new music
  $scope.createMusic = () => {
    $http.post('/api/v1/music', $scope.formMusic)
    .success((data) => {
      $scope.formMusic = {};
      $scope.todoMusic = data;
      console.log(data);
    })
    .error((error) => {
      console.log('Error: ' + error);
    });
  };

  //Create a new user
  $scope.createUser = () => {
    $http.post('/api/v1/user', $scope.formUser)
    .success((data) => {
      $scope.formUser = {};
      $scope.todoUser = data;
      console.log(data);
    })
    .error((error) => {
      console.log('Error: ' + error);
    });
  };

  //Create a new playlist
  $scope.createPlaylist = () => {
    $http.post('/api/v1/playlist', $scope.formPlay)
    .success((data) => {
      $scope.formPlay = {};
      $scope.todoPlay = data;
      console.log(data);
    })
    .error((error) => {
      console.log('Error: ' + error);
    });
  };

  // Delete a todo
  $scope.deleteAlbum = (albumID) => {

    $http.delete('/api/v1/album/' + albumID)
    .success((data) => {
      $scope.todoAlbum = data;
      console.log(data);
    })
    .error((data) => {
      console.log('Error: ' + data);
    });
  };
});

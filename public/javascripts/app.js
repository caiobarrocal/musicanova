angular.module('nodeMusic', [])
.controller('mainController', ($scope, $http) => {
  $scope.formData = {};
  $scope.musicData = {};
  $scope.friendsData = {};
  $scope.genderData = {};
  $scope.artistData = {};

  // Recomendações pelo gênero
  $http.get('/api/v1/gender')
  .success((data) => {
    $scope.genderData = data;
    console.log(data);
  })
  .error((error) => {
    console.log('Error: ' + error);
  });

  // Recomendações de artistas baseados em um outro artista
  $http.get('/api/v1/sugartists')
  .success((data) => {
    $scope.artistData = data;
    console.log(data);
  })
  .error((error) => {
    console.log('Error: ' + error);
  });

  // Lista de amigos
  $http.get('/api/v1/sugfriends')
  .success((data) => {
    $scope.friendsData = data;
    console.log(data);
  })
  .error((error) => {
    console.log('Error: ' + error);
  });
});

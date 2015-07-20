'use strict'

angular.module('bgm-app')
.controller('TopController', function($scope, $timeout, $state){
  $scope.goHome = function(){
    $state.go('home');
  };
  
  $scope.shareModel = {
    url: "https://bgm-com.herokuapp.com/#/BGM.com/",
    name: "I'm listening to music at"
  }

  $scope.searchImage = "images/head.png";
  $scope.rankingImage = "images/ranking.png";
  $scope.storeImage = "images/database.png";

  var showJumbo = function(){
    $scope.showJumbo = true;
  };

  var showImage = function(){
    $scope.showImage = true;
  };

  var showText = function(){
    $scope.showText = true;
  };

  $timeout(showJumbo, 300);
  $timeout(showImage, 400);
  $timeout(showText, 500);

  
});


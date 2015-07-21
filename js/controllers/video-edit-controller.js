'use strict'

angular.module('bgm-app')
.controller('VideoEditController', function($scope, VideoIndexService){
  var params = {
    order: "like"
  }

  $scope.showContent = true;

  var pages = [];
  var firstPage = {number:"Prev"}
  pages.push(firstPage);
  for(var i=1; i<10; i++){
    var page = {number:i};
    pages.push(page);
  }
  var lastPage = {number:"Next"}
  pages.push(lastPage);
  $scope.pages = pages;

  VideoIndexService.receive(params)
    .then(function(data){
      $scope.videos = data;
    });
});



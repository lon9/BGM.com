'use strict'

angular.module('bgm-app')
.controller('VideoEditController', function($scope, $resource, $window){
  var Video = $resource('http://localhost:9000/video/:id', {id: '@id'});
  var nowPage = 1;

  var params = {
    order: "like"
  }

  $scope.showContent = true;


  $scope.playerVars = {
    autoplay: 1
  }

  //set pager
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

  //get videos
  $scope.videos = Video.query(params);

  $scope.play = function(video){
    //play music;
    $scope.showVideoDiv = true;
    $scope.playingTitle = video.title;
    $scope.videoId = video.videoId;
    if(video.artist!=null){
      $scope.showArtist = true;
      $scope.artistName = video.artist;
    }else
      $scope.showArtist = false;
  };

  $scope.videoToggle = function(isShow){
    if(isShow==false||isShow==null)
      $scope.showVideo = true;
    else
      $scope.showVideo = false;
  }

  $scope.update = function(video){
    //Update video
    video.$save({id: video.id}, function(data){
      $window.alert(data.title + " was updated.");
    });
  };

  $scope.delete = function(video){
    //delete music
    var conf = $window.confirm("Are you sure to delete " + video.title + "?");
    if(conf==true){
      Video.delete({id: video.id}, function(){
        $scope.videos = Video.query(params);
      });
    }
  };

  $scope.nextPage = function(page){
    switch(page){
      case "Prev":
          if(nowPage!=0){
            var params = {
              page: nowPage-1,
              order: "like"
            }
            Video.query(params, function(data){
              if(data!=null){
                $scope.videos = data;
                nowPage = nowPage -1;
              }
            });
          }
        break;
      case "Next":
        var params = {
          page: nowPage+1,
          order: "like"
        }
        Video.query(params, function(data){
          if(data!=null){
            $scope.videos = data;
            nowPage = nowPage + 1;
          }
        });
        break;
      default:
        var params = {
          page: page,
          order: "like"
        }
        Video.query(params, function(data){
          if(data!=null){
            $scope.videos = data;
            nowPage = page;
          }
        });
    }
  }

  $scope.$on('youtube.player.playing', function($event, player){
    $scope.playDisabled = true;
    $scope.pauseDisabled = false;
  });

  $scope.$on('youtube.player.paused', function($event, player){
    $scope.pauseDisabled = true;
    $scope.playDisabled = false;
  });

});



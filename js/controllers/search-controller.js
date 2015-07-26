'use strict'

angular.module('bgm-app')
.controller('SearchController', function($scope, $analytics, YouTubeSearchService, localStorageService, SendLikeService){
  var playingVideoNum = -1;
  var items = null;
  var favorites = JSON.parse(localStorageService.get("favorite"));
  $scope.$watch('searchWord', function(){
    var params = {
      q: $scope.searchWord,
      key: API_KEY,
      maxResults: 20,
      type: 'video',
      part: 'id,snippet',
      videoEmbeddable: true
    }
    YouTubeSearchService.search(params).then(function(data){
      $scope.items=data.items;
      items = data.items;
      playingVideoNum = -1;
    });
  });

  $scope.playVideo = function(videoId, title, index){
    playingVideoNum = index;
    $scope.videoId = videoId;
    $scope.playingTitle = title;
    $scope.playerVars = {
      autoplay: 1
    }
    $scope.showVideoDiv=true;
    changeDisabled();
  };

  $scope.addStar = function(item){
    if(favorites!=null){
      for(var i=0; i<favorites.length; i++){
        if(favorites[i].id.videoId==item.id.videoId){
          alert("すでに登録されています。");
          break;
        }
      }
      if(i>favorites.length-1){
        favorites.unshift(item);
        localStorageService.set("favorite", JSON.stringify(favorites));
        alert("追加しました。");
      }
    }else{
      favorites = new Array();
      favorites.unshift(item);
      localStorageService.set("favorite", JSON.stringify(favorites));
      alert("追加しました。");
    }

    SendLikeService.send(item, null);
  };

  $scope.videoToggle = function(){
    if($scope.showVideo)
      $scope.showVideo=false;
    else
      $scope.showVideo=true;
  };

  $scope.nextVideo = function(){
    loadNextVideo();
  };

  $scope.prevVideo = function(){
    loadPrevVideo();
  };

  $scope.isActive = function(index){
    if(index==playingVideoNum)
      return true;
    else
      return false;
  };

  $scope.$on('youtube.player.ready', function($event, player){
    $analytics.eventTrack('Play');
  });


  $scope.$on('youtube.player.playing', function($event, player){
    $scope.playDisabled=true;
    $scope.pauseDisabled=false;
  });

  $scope.$on('youtube.player.paused', function($event, player){
    $scope.playDisabled=false;
    $scope.pauseDisabled=true;
  });

  $scope.$on('youtube.player.ended', function($event, player){
    loadNextVideo();    
  });

  function loadNextVideo(){
    playingVideoNum++;
    $scope.videoId = items[playingVideoNum].id.videoId;
    $scope.playingTitle = items[playingVideoNum].snippet.title;
    changeDisabled();
  }

  function loadPrevVideo(){
    playingVideoNum--;
    $scope.videoId = items[playingVideoNum].id.videoId;
    $scope.playingTitle = items[playingVideoNum].snippet.title;
    changeDisabled();
  }

  function changeDisabled(){
    if(playingVideoNum==0){
      $scope.nextDisabled = false;
      $scope.prevDisabled = true;
    }else if(playingVideoNum==19){
      $scope.nextDisabled = true;
      $scope.prevDisabled = false;
    }else{
      $scope.nextDisabled = false;
      $scope.prevDisabled = false;
    }
  }
});


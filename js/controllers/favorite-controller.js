'use strict'

angular.module('bgm-app')
.controller('FavoriteController', function($scope, $analytics, SendLikeService, localStorageService){
  var playingVideoNum = -1;
  var favorites = JSON.parse(localStorageService.get("favorite"));
  if(favorites!=null)
    var favoriteSize = favorites.length;

  var updated = localStorageService.get("updated");
  if(updated==null&&favorites!=null&&favorites.length>0){
    for(var i=0; i<favorites.length; i++){
      SendLikeService.send(favorites[i], function(result){
        if(result==true)
          localStorageService.set("updated", 1);
      });
    }
  }
  

  if(favorites!=null&&favorites.length>0){
    $scope.items = favorites;
    $scope.empty=true;
  }else{
    $scope.empty=false;
  }

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

  $scope.delStar = function(item){
    for(var i=0; i<favorites.length; i++){
      if(favorites[i].id.videoId==item.id.videoId){
        favorites.splice(i,1);
        localStorageService.set("favorite", JSON.stringify(favorites));
        alert("削除しました。");
        if(favorites.length<1){
          $scope.empty=false;
          $scope.showVideoDiv=false;
          $scope.embedPlayer.stopVideo();
        }
        $scope.items = favorites;
        favoriteSize = favorites.length;
      }
    }
  };
  
  $scope.videoToggle = function(){
    if($scope.showVideo)
      $scope.showVideo=false;
    else
      $scope.showVideo=true;
  };

  $scope.shuffle = function(){
    favorites = shuffle(favorites);
    $scope.items = favorites;
    playingVideoNum = -1;
  };

  $scope.checkUpDisabled = function(index){
    if(index==0){
      return true;
    }else{
      return false;
    }
  };

  $scope.checkDownDisabled = function(index){
    if(index==favoriteSize-1){
      return true;
    }else{
      return false;
    }
  };

  $scope.upItem = function(index){
    changeElement(favorites, index-1, index);
    $scope.items = favorites;
    localStorageService.set("favorite", JSON.stringify(favorites));
  };

  $scope.downItem = function(index){
    changeElement(favorites, index, index+1);
    $scope.items = favorites;
    localStorageService.set("favorite", JSON.stringify(favorites));
  };

  $scope.prevVideo = function(){
    console.log(playingVideoNum);
    playingVideoNum--;
    console.log(playingVideoNum);
    playVideo();
  };

  $scope.nextVideo = function(){
    playingVideoNum++;
    playVideo();
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
    playingVideoNum++;
    if (playingVideoNum == favorites.length)
      playingVideoNum = 0;
    playVideo();
  });
  
  function playVideo(){
    $scope.videoId = favorites[playingVideoNum].id.videoId;
    $scope.playingTitle = favorites[playingVideoNum].snippet.title;
    changeDisabled();
  };

  function changeDisabled(){
    if(playingVideoNum==0){
      $scope.nextDisabled = false;
      $scope.prevDisabled = true;
    }else if(playingVideoNum==favoriteSize-1){
      $scope.nextDisabled = true;
      $scope.prevDisabled = false;
    }else{
      $scope.nextDisabled = false;
      $scope.prevDisabled = false;
    }
  };

  function shuffle(musicData){
    var n = musicData.length, t, i;

    while(n){
      i = Math.floor(Math.random() * n--);
      t = musicData[n];
      musicData[n] = musicData[i];
      musicData[i] = t;
    }
    return musicData;
  };

  function changeElement(array, index1, index2){
    var value2 = array[index2];
    array[index2] = array[index1];
    array[index1] = value2;
  };

});


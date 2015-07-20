'use strict'



angular.module('bgm-app')
.controller('LikedController', function($scope, localStorageService, VideoIndexService, YouTubeVideoService, SendLikeService){
  var playingVideoNum = -1;
  var videos = [];
  var favorites = JSON.parse(localStorageService.get("favorite"));

  var params = {
    order: "like"
  }

  VideoIndexService.receive(params)
    .then(function(data){
      $scope.videos = data;
      videos = data;
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

  $scope.addStar = function(videoId){
    var item = null;
    var params = {
      part: "id,snippet",
      id: videoId,
      key: API_KEY
    }
    YouTubeVideoService.video(params).then(function(data){
      item = data.items[0];
      if(item==null){
        alert("保存できません。データを取得できませんでした。");
        return;
      }
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

      //Send like.
      SendLikeService.send(item, null);
    });
  };

   
  $scope.videoToggle = function(){
    if($scope.showVideo)
      $scope.showVideo=false;
    else
      $scope.showVideo=true;
  };

  $scope.shuffle = function(){
    videos = shuffle(videos);
    $scope.items = videos;
    playingVideoNum = -1;
  };


  $scope.prevVideo = function(){
    playingVideoNum--;
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
    if (playingVideoNum == videos.length)
      playingVideoNum = 0;
    playVideo();
  });
  
  function playVideo(){
    $scope.videoId = videos[playingVideoNum].videoId;
    $scope.playingTitle = videos[playingVideoNum].title;
    changeDisabled();
  };

  function changeDisabled(){
    if(playingVideoNum==0){
      $scope.nextDisabled = false;
      $scope.prevDisabled = true;
    }else if(playingVideoNum==videos.length-1){
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
});


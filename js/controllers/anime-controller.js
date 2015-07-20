'use strict'

angular.module('bgm-app')
.controller('AnimeController', function($scope, $resource, $window, localStorageService, AnimeService, AnimeSearchService, YouTubeSearchService){
  var TWITTER_PROFILE_URL = "https://twitter.com/";
  var TWEET_URL = "https://twitter.com/intent/tweet?hashtags=";
  var HASH_TAG = "BGM.com";
  var playingVideoNum = 0;
  var animeData = null;
  var animeTitle = null;
  var opOrEd = null;
  var favorites = JSON.parse(localStorageService.get("favorite"));
  $scope.coursName = "クール";
  $scope.showVideoDiv = false;
  $scope.showVideo = false;
  $scope.loadError = false;

  var coursParams = {url: "http://api.moemoe.tokyo/anime/v1/master/cours"}
  AnimeService.list(coursParams).then(function(data){
    $scope.cools = data;  
  });
  
  $scope.selectCours = function(year, cours){
    $scope.coursName = year + "年" + cours + "クール";
    AnimeSearchService.search(year, cours).then(function(data){
      $scope.backColor = colors[Math.floor(Math.random() * colors.length)];
      $scope.animes = data;
      animeData = data;
    }); 
  };

  $scope.playOP = function(title, index){
    opOrEd = "OP";
    playingVideoNum = index;
    $scope.loadError=false;
    loadVideo(title, "OP");
    $scope.showVideoDiv = true;
  };

  $scope.playED = function(title, index){
    opOrEd = "ED";
    playingVideoNum = index;
    $scope.loadError=false;
    loadVideo(title, "ED");
    $scope.showVideoDiv = true;
  };

  $scope.open = function(url){
    $window.open(url);
  };


  $scope.profile = function(account){
    $window.open(TWITTER_PROFILE_URL + account, account);
  };

  $scope.tweet = function(hashTag){
    $window.open(TWEET_URL + hashTag + ", " + HASH_TAG, 'ツイートする', 'width=465, height=465');
  };

  $scope.addStar = function(){
    var item = null;
    var params = {
      q: animeTitle + " " + opOrEd,
      maxResults: 1,
      key: API_KEY,
      part: 'id,snippet',
      type: 'video',
      videoEmbeddable: true
    }
    YouTubeSearchService.search(params).then(function(data){
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
    });
  };


  $scope.videoToggle = function(){
    if($scope.showVideo)
      $scope.showVideo=false;
    else
      $scope.showVideo=true;
  };
 
  $scope.$on('youtube.player.playing', function($event, player){
    $scope.playDisabled = true;
    $scope.pauseDisabled = false;
  });

  $scope.$on('youtube.player.paused', function($event, player){
    $scope.playDisabled = false;
    $scope.pauseDisabled = true;
  });

  $scope.$on('youtube.player.ended', function($event, player){
    playingVideoNum++;
    if(playingVideoNum==animeData.length)
      playingVideoNum = 0;
    loadVideo(animeData[playingVideoNum].title);
  });

  function loadVideo(title, opFlag){
    animeTitle = title;
    var params = {
      q: title + ' ' + opFlag,
      maxResults: 1,
      key: API_KEY,
      part: 'id,snippet',
      type: 'video',
      videoEmbeddable: true
    }
    YouTubeSearchService.search(params).then(function(data){
      if(data.items[0]!=null){
        $scope.videoId = data.items[0].id.videoId
        $scope.playingTitle = title + " " + opFlag;
        $scope.playerVars = {
          autoplay: 1
        }
      }else{
        $scope.errorTitle=title + " " + opFlag;
        $scope.loadError = true;
        playingVideoNum++;
        loadVideo(animeData[playingVideoNum].title, opOrEd);
      }
    });
  };

});


'use strict'

angular.module('bgm-app')
.controller('RankingController', function($scope, $resource, iTunesRankingService, YouTubeSearchService, localStorageService){
  //初期化処理
  var playingVideoNum = -1;
  var genre = null;
  var musicData = null;
  var favorites = JSON.parse(localStorageService.get("favorite"));
  $scope.genres = $resource("./genres.json").query();
  $scope.genreName = "Genre";
  $scope.showVideoDiv = false;
  $scope.showVideo = false;
  $scope.loadError = false;
  $scope.showShuffle = false;

  $scope.selectGenre = function(genreId, genreName, country){
    $scope.genreName = genreName;
    genre = genreId;
    iTunesRankingService.search(genreId, country).then(function(data){
      $scope.musics = data;
      musicData = data;
      $scope.showShuffle=true;
      playingVideoNum = -1;
    }); 
  };

  $scope.selectCountry = function(country){
    if(genre!=null){
      iTunesRankingService.search(genre, country).then(function(data){
        $scope.musics = data;
        musicData = data;
        playingVideoNum = -1
      });
    };
  };

  $scope.shuffle = function(){
    shuffle(musicData);
    $scope.musics = musicData;
    playingVideoNum = -1;
  }

  $scope.playVideo = function(title, artist ,index){
    playingVideoNum = index;
    $scope.loadError=false;
    loadVideo(title, artist);
    $scope.showVideoDiv = true;
    changeDisabled();
  };

  $scope.addStar = function(title, artist){
    var item = null;
    var params = {
      q: title + ' ' + artist,
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
    if(playingVideoNum==musicData.length)
      playingVideoNum = 0;
    loadVideo(musicData[playingVideoNum].title, musicData[playingVideoNum].artist);
  });

  function loadVideo(title, artist){
    var params = {
      q: title + ' ' + artist,
      maxResults: 1,
      key: API_KEY,
      part: 'id,snippet',
      type: 'video',
      videoEmbeddable: 'true'
    }
    YouTubeSearchService.search(params).then(function(data){
      if(data.items[0]!=null){
        $scope.videoId = data.items[0].id.videoId
        $scope.playingTitle = title;
        $scope.artistName = artist;
        $scope.playerVars = {
          autoplay: 1
        }
      }else{
        $scope.errorTitle=title;
        $scope.loadError = true;
        playingVideoNum++;
        loadVideo(musicData[playingVideoNum].title, musicData[playingVideoNum].artist);
      }
    });
  };

  function loadNextVideo(){
    playingVideoNum++;
    loadVideo(musicData[playingVideoNum].title, musicData[playingVideoNum].artist);
    changeDisabled();
  };

  function loadPrevVideo(){
    playingVideoNum--;
    loadVideo(musicData[playingVideoNum].title, musicData[playingVideoNum].artist);
    changeDisabled();
  };

  function changeDisabled(){
    if(playingVideoNum==0){
      $scope.nextDisabled = false;
      $scope.prevDisabled = true;
    }else if(playingVideoNum==99){
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


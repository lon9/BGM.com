'use strict'

var API_KEY = "AIzaSyAv9QHftFDcf10H7Ye2lxJKH1fiXFDuEUw"

angular.module('bgm-app')
.factory('YouTubeSearchService', function($http){
  var search = function(params){
    return $http.get('https://www.googleapis.com/youtube/v3/search', {params: params})
      .then(function(response){
        return response.data;
      });
  };
  return {
    search: search
  };
})

.factory('YouTubeVideoService', function($http){
  var video = function(params){
    return $http.get('https://www.googleapis.com/youtube/v3/videos', {params: params})
      .then(function(response){
        return response.data;
      });
  };
  return {
    video: video
  };
})

.factory('iTunesRankingService', function($http){
  var search = function(genreId, country){
    var url = 'https://itunes.apple.com/' + country + '/rss/topsongs/limit=100/genre=' + genreId + '/json';
    return $http.get(url).then(function(response){
      var data = response.data;
      var entries = new Array();
      for(var i=0; i<data.feed.entry.length; i++){
        var pushedData = {
          title: data.feed.entry[i]['im:name'].label,
          artist: data.feed.entry[i]['im:artist'].label,
          thumbnail: data.feed.entry[i]['im:image'][2].label,
          publishedAt: data.feed.entry[i]['im:releaseDate'].attributes.label
        };
        entries.push(pushedData);
      }

      return entries
    });
  };
  return {
    search : search
  };
})

.factory('AnimeService', function($http){
  var list = function(params){
    return $http.get('https://bgm-server.herokuapp.com/proxy', {params: params})
      .then(function(response){
        var jsonData = response.data;
        var result = new Array();
        for(var i=1; i<Object.keys(jsonData).length+1; i++){
          result.push(jsonData[i]);
        }
        return result;
      });
  };
  return {
    list: list
  };
})

.factory('AnimeSearchService', function($http){
  var search = function(year, cours){
    var url = 'http://api.moemoe.tokyo/anime/v1/master/' + year + '/' + cours;
    var params = {
      url: url
    }
    return $http.get('https://bgm-server.herokuapp.com/proxy', {params: params})
      .then(function(response){
        return response.data;  
      });
  };
  return {
    search: search
  };
})

//Send video to server and increment like count.
.factory('SendLikeService', function($http, localStorageService){
  var send = function(video, listener){
    var data = {
      videoId: video.id.videoId,
      title: video.snippet.title,
      highThumbnail: {
        url: video.snippet.thumbnails['high'].url,
        width: video.snippet.thumbnails['high'].width,
        height: video.snippet.thumbnails['high'].height
      },
      mediumThumbnail: {
        url: video.snippet.thumbnails['medium'].url,
        width: video.snippet.thumbnails['medium'].width,
        height: video.snippet.thumbnails['medium'].height
      } 
    }
    var liked = JSON.parse(localStorageService.get("liked"));
    if(liked!=null){
      for(var i=0; i<liked.length; i++){
        if(liked[i].videoId==data.videoId){
          sendResult(false);
          return false;
        }
      }
      if(i>liked.length-1){
        request(data).then(function(status){
          if(status==200){
            liked.push(data);
            localStorageService.set("liked", JSON.stringify(liked));
            sendResult(true);
            return true;
          }else{
            sendResult(false);
            return false;
          }
        });
      }
    }else{
      request(data).then(function(status){
        if(status==200){
          liked = new Array();
          liked.push(data);
          localStorageService.set("liked", JSON.stringify(liked));
          sendResult(true);
          return true;
        }else{
          sendResult(false);
          return false;
        }
      });
    };

    function request(data){
      return $http.post('http://localhost:9000/like', data)
        .then(function(response){
          return response.status;
        });
    }

    function sendResult(result){
      if(listener!=null)
        listener(result);
    }
  };  
  return {
    send: send
  }
})


// Get videos.
.factory('VideoIndexService', function($http){
  var receive = function(params){
    return $http.get('http://localhost:9000/video', {params: params})
      .then(function(response){
        return response.data;
      });
  };
  return{
    receive: receive
  }
})

.factory('InqueryService', function($http){
  var send = function(data){
    return $http.post('https://bgm-server.herokuapp.com/inquery', data)
      .then(function(response){
        return response.status;
      });
  };
  return {
    send: send
  };
});

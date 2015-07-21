'use strict';

angular.module('bgm-app')
.filter('escape', function(){
  return window.encodeURIComponent;
})

.filter('unescape', function(){
  return window.decodeURIComponent;
})

.filter('lank', function(){
  return function(lankNum){
    if(lankNum==1)
      return lankNum + "st";
    else if (lankNum==2)
      return lankNum + "nd";
    else if (lankNum==3)
      return lankNum + "rd";
    else
      return lankNum;
  };
})

.filter('escapeDate', function(){
  return function(time){
    if(time == "0001-01-01T00:00:00Z")
      return "";
    else
      return time;
    };
});

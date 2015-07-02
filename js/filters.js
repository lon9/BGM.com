'use strict';

angular.module('bgm-app')
.filter('escape', function(){
  return window.encodeURIComponent;
})

.filter('unescape', function(){
  return window.decodeURIComponent;
});

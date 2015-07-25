'use strict'

angular.module('bgm-app')
.factory('BasicAuthService', function(){
  var authCode;
  return {
    setCode: function(code){
      authCode=code;
    },
    isCode: function(){
      return (authCode) ? authCode : false;
    }
  }
})

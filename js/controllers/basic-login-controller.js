'use strict'

angular.module('bgm-app')
.controller("BasicLoginController", function($scope, $state, $base64,  BasicAuthService){
  $scope.login = function(){
    var username = $scope.authUser.username;
    var password = $scope.authUser.password;
    var code = $base64.encode(username+ ":" + password);
    BasicAuthService.setCode(code);
    $state.go('video');
  };
});

'use strict'

angular.module('bgm-app')
.controller('InqueryController', function($scope, InqueryService){
  $scope.send = function(){
    InqueryService.send($scope.inquery)
      .then(function(status){
        if(status==201)
          alert("sent it.");
          $scope.inquery = null;
      });
  };
});

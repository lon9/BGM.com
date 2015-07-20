angular
  .module('bgm-app', [
    'ngResource',
    'ngCookies',
    'ngAnimate',
    'ui.router',
    'youtube-embed',
    'LocalStorageModule',
    'ngAnimate-animate.css',
    'angulike'
  ])
  .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider,
      $urlRouterProvider, $httpProvider) {
    $stateProvider
      .state('top', {
        url:'/BGM.com/',
        templateUrl: 'views/top.html',
        controller: 'TopController'
      })
      .state('home', {
        url: '/BGM.com/home',
        templateUrl: 'views/home.html'
      })
      .state('search', {
        url: '/BGM.com/search',
        templateUrl: 'views/search.html',
        controller: 'SearchController'
      })
      .state('search.play', {
        url: '/play/:videoId',
      })
      .state('ranking', {
        url: '/BGM.com/ranking',
        templateUrl: 'views/ranking.html',
        controller: 'RankingController'
      })
      .state('ranking.detail', {
        url: '/:genreName'
      })
      .state('ranking.play', {
        url: '/play'
      })
      .state('anime', {
        url: '/anime',
        templateUrl: 'views/anime.html',
        controller: 'AnimeController'
      })
      .state('anime.detail', {
        url: '/:year/:cours' 
      })
      .state('anime.move',{
        
      })
      .state('liked', {
        url: '/BGM.com/liked',
        templateUrl: 'views/liked.html',
        controller: 'LikedController'
      })
      .state('liked.play', {
        url: '/:videoId'
      })
      .state('favorite', {
        url: '/BGM.com/favorite',
        templateUrl: 'views/favorite.html',
        controller: 'FavoriteController'
      })
      .state('favorite.play', {
        url: '/play',
      })
      .state('inquery', {
        url: '/inquery',
        templateUrl: 'views/inquery.html',
        controller: 'InqueryController'
      });
      
    $urlRouterProvider.otherwise('home');

    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;application/json;charset=utf-8';
  }]);

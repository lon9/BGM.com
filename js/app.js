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
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider,
      $urlRouterProvider) {
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
      .state('favorite', {
        url: '/BGM.com/favorite',
        templateUrl: 'views/favorite.html',
        controller: 'FavoriteController'
      })
      .state('favorite.play', {
        url: '/play',
      });
      
    $urlRouterProvider.otherwise('home');
  }]);

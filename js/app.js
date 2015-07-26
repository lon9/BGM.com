angular
  .module('bgm-app', [
    'ngResource',
    'ngCookies',
    'ngAnimate',
    'ui.router',
    'youtube-embed',
    'LocalStorageModule',
    'ngAnimate-animate.css',
    'angulike',
    'base64',
    'angulartics',
    'angulartics.google.analytics'
  ])
  .constant('requireAuth', [
    '/video'
  ])
  .run(['$rootScope', '$location', 'BasicAuthService', 'requireAuth', function($rootScope, $location, BasicAuthService, requireAuth){
    $rootScope.$on('$stateChangeStart', function(event){
      if(requireAuth.indexOf($location.path())> -1 && !BasicAuthService.isCode()){
        event.preventDefault();
        $location.path('basicLogin');
      }
    });

    $rootScope.$on('$stateChangeSuccess', function(event){
      $rootScope.$emit('$routeChangeSuccess');
    });
  }])
  .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider,
      $urlRouterProvider, $httpProvider) {
    $stateProvider
      .state('top', {
        url:'/',
        templateUrl: 'views/top.html',
        controller: 'TopController'
      })
      .state('home', {
        url: '/home',
        templateUrl: 'views/home.html'
      })
      .state('search', {
        url: '/search',
        templateUrl: 'views/search.html',
        controller: 'SearchController'
      })
      .state('search.play', {
        url: '/play/:videoId',
      })
      .state('ranking', {
        url: '/ranking',
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
        url: '/liked',
        templateUrl: 'views/liked.html',
        controller: 'LikedController'
      })
      .state('liked.play', {
        url: '/:videoId'
      })
      .state('favorite', {
        url: '/favorite',
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
      })
      .state('basicLogin', {
        url: '/basiclogin',
        templateUrl: 'views/basic-login.html',
        controller: 'BasicLoginController'
      })
      .state('video', {
        url: '/video',
        templateUrl: 'views/video-edit.html',
        controller: 'VideoEditController'
      });
      
    $urlRouterProvider.otherwise('home');

    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;application/json;charset=utf-8';
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }]);

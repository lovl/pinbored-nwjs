
/**
 * @ngdoc function
 * @name pinboredWebkitApp.controllers.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pinboredWebkitApp.controllers
 */
angular.module('pinboredWebkitApp.controllers')
  .controller('MainNavCtrl', 
    ['$scope', '$location', 'ngDialog', 'Usersessionservice', 'Appstatusservice', 'Events',  
    function ($scope, $location, ngDialog, Usersessionservice, Appstatusservice, Events) {

    // page model
    $scope.model = {
      showNav : false,
      activeSection : '',
      username : 'user',
      navItems : [
        { name: 'overview' },
        { name: 'tags' },
        // { name: 'tools' },
        // { name: 'statistics' },
        { name: 'settings' }
        // { name: 'about' }
      ],
      userMenuItems : [
        { name : 'about', action : 'about' },
        { name : 'log out', action : 'logout' }
      ],
      selectedUserMenuItem : null
    };

    // Load native UI library
    var gui = require('nw.gui');

    // root scope listeners
    $scope.$on(Events.user.authenticated, function() { // args: event, model
      if(Usersessionservice.authenticated === true) {
        $scope.showNav = true;
        $scope.model.username = Usersessionservice.user;
      } else if(Usersessionservice.authenticated === false) {
        $scope.showNav = false;
        return;
      }
    });

    $scope.$on(Events.user.pagechanged, function() { // args: event, currentPage
      $scope.model.activeSection = Usersessionservice.currentSection;
    });

    $scope.doAction = function(action) {
      switch (action) {
        case 'about':   $scope.about();   break;
        case 'logout':  $scope.logout();  break;
      }
    };

    $scope.about = function() {
      console.log('about clicked...');
      // ngDialog.open({ template: 'templates/modal-about-template.html' });
      $location.path('/about');
    };

    $scope.logout = function() {
      // TODO logout
      console.log('logging out...');
      Usersessionservice.destroy();
      console.info('logged out.');
    };

    $scope.quit = function() {
      // TODO quit
      console.log('quitting...');
      if(Appstatusservice.hasPendingOperations() === false) {
        $scope.logout();
        console.info('bye! see you next time.');
        // Quit current app
        gui.App.quit();
      }
    };

  }]);
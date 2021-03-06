
/**
 * @ngdoc function
 * @name pinboredWebkitApp.controllers.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the pinboredWebkitApp.controllers
 */
angular.module('pinboredWebkitApp.controllers')
  .controller('SettingsCtrl', 
    ['$scope', '$controller', '$location', 'Pinboardservice', 
    'Usersessionservice', 'Utilservice', 'Appconfigservice', 'Events', 
    function ($scope, $controller, $location, Pinboardservice, 
      Usersessionservice, Utilservice, Appconfigservice, Events) {

    // Initialize the super (controller) class and extend it.
    angular.extend(this, $controller('BaseViewCtrl', {$scope: $scope}));
    
    // page model
    $scope.model = {
      changes : false,
      appConfigWatcher : null
    };

    $scope.appconfig = {} // gets populated by Appconfigservice !
    $scope.newappconfig = {} // copy of above

    $scope.onAppconfigChanged = function() {
      console.log('onAppconfigChanged');
      $scope.appconfig = Appconfigservice.getConfig();
      // copy appconfig
      console.log('received new appconfig: ', Appconfigservice.getConfig());
      angular.copy($scope.appconfig, $scope.newappconfig);
      // remove watcher if there is any
      if($scope.model.appConfigWatcher !== null) {
        $scope.model.appConfigWatcher();
      }
      // watch appconfig
      $scope.model.appConfigWatcher = $scope.$watchCollection('newappconfig', function(newVal, oldVal) {
        // console.log('old, new: ', newVal, $scope.appconfig);
        if(angular.equals(newVal, $scope.appconfig)) {
          $scope.model.changes = false;
        } else {
          $scope.model.changes = true;
        }
      }, true);
    };

    $scope.saveChanges = function() {
      Appconfigservice.setConfigObject($scope.newappconfig);  // triggers onAppconfigChanged through broadcast
      $scope.model.changes = false; // reset changes
    };

    $scope.setRecentAmount = function(amount) {
      $scope.newappconfig.maxRecentItems = amount;
    };

    $scope.setStaleCheckTimeout = function(amount) {
      $scope.newappconfig.staleCheckTimeout = amount * 1000;
    };

    $scope.$on('$viewContentLoaded', function() {
      console.info('settings $viewContentLoaded called');
      // force local $scope copy of app config obj.
      $scope.onAppconfigChanged();
    });

    $scope.$on('$destroy', function() {
      console.info('settings $destroy called');
    });

    // update current page
    Usersessionservice.setCurrentSection('settings');

    // set event hooks / listeners
    $scope.$on(Events.app.configchanged, $scope.onAppconfigChanged);

  }]);

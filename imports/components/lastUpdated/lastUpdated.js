import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './lastUpdated.html';

class LastUpdated {
    constructor($scope, $interval, $filter) {
        //'ngInject';
        
        //$reactive(this).attach($scope);
        $scope.viewModel(this);
        var vm = this;
        var sec = ( (new Date() - this.updated) / 1000 );
        this.suffix = getSuffix(); 
        this.lastUpdated = getDate(); 
        
        $scope.$on('$destroy', function() {//I'd like to eventually change the $scope to this
            if (angular.isDefined(stop)) {
                $interval.cancel(stop);
                stop = undefined;
            }
        });
                
        var stop = $interval(function() {
            sec = ( (new Date() - vm.updated) / 1000 );
            vm.suffix = getSuffix();
            vm.lastUpdated = getDate();   
        }, 60000);//Run every minute
        
        function getSuffix() {
            if (sec < 60) {
                return "Less than a minute ago";
            } else if (sec >= 60 && sec < 300) {
                return "A few minutes ago";
            } else if (sec >= 300 && sec < 3600) {
                return " minutes ago";//STILL HAS PROBLEMS WITH 1 (i.e. 1 hours ago)
            } else if (sec >= 3600 && (sec/3600) < 24) {
                return " hours ago";
            } else if ((sec/3600) >= 24 && (sec/3600/24) < 7) {
                return " days ago";
            } else if ((sec/3600/24) >= 7 && //If it's more than a week & if the current year is the same as the year of lastUpdated
                ( $filter('date')(vm.updated, 'yyyy') === 
                    $filter('date')(new Date(), 'yyyy') ) )  {
                return $filter('date')(vm.updated, 'MMM d'); //This will just display the date w/o the year
            } else {
                return $filter('date')(vm.updated, 'MMM d yyyy'); //This will return the date w/ the year
            }
        }
        
        function getDate() {
            if (sec < 60) {
                return "";//Suffix handles all info
            } else if (sec >= 60 && sec < 300) {
                return "";//Suffix handles all info
            } else if (sec >= 300 && sec < 3600) {
                return (sec/60);//Return # of minutes
            } else if (sec >= 3600 && (sec/3600) < 24) {
                return (sec/3600);//Return # of hours
            } else if ((sec/3600) >= 24 && (sec/3600/24) < 7) {
                return ((sec/3600/24));//Return # of days
            } else {//If it's more than a week ago...
                return ""; //then just let the suffix handle it
            }
        }
        
        
    }//End of constructor
}//End of LastUpdated class

export default angular.module('lastUpdated', [
    angularMeteor
]).component('lastUpdated', {
    templateUrl: 'imports/components/lastUpdated/lastUpdated.html',
    controller: ['$scope', '$interval', '$filter', LastUpdated],
    bindings: {
        updated: '='
    }    
});
(function () {

    'use strict';

    angular
        .module('NrStructureList', ['NrAngularPagination'])
        .component('nrStructureList', {
            bindings: {
                documents: '='
            },
            templateUrl: 'tpl/nr-structure-list.html',
            controller: StructureListController,
            controllerAs: 'vm'
        });

    function StructureListController($scope, $http, $httpParamSerializer, $q) {
        var vm = this;

        this.$onInit = function () {

        }
    }

})();
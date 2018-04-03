(function () {

    'use strict';

    angular
        .module('NrStructureList', ['NrAngularPagination'])
        .component('nrStructureList', {
            bindings: {
                documents: '<',
                columns: '<',
                onColumnClick: '&'
            },
            templateUrl: 'tpl/nr-structure-list.html',
            controller: StructureListController,
            controllerAs: 'vm'
        });

    function StructureListController() {
        var vm = this;

        this.$onInit = function () {
            
        }
    }

})();
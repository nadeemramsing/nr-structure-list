(function () {

    'use strict';

    angular
        .module('NrStructureList', [
            'NrAngularPagination',
            'dndLists'
        ])
        .component('nrStructureList', {
            bindings: {
                documents: '<',
                columns: '<',
                onColumnClick: '&',
                onDocumentSelect: '&'
            },
            templateUrl: 'tpl/nr-structure-list.html',
            controller: StructureListController,
            controllerAs: 'vm'
        });

    function StructureListController($scope, $timeout) {
        var vm = this;

        $scope.selectedColumns = [];

        $scope.onColumnClick = onColumnClick;

        /* LOCAL VAR */

        /* INIT */
        this.$onInit = function () {

        }

        /* WATCHERS */
        var stopColumns = $scope.$watch(
            function () {
                return vm.columns;
            },
            function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    selectColumns();
                    stopColumns();
                }
            }
        );

        /* FUNCTION DECLARATIONS */
        function onColumnClick(column) {
            if (column.isSelected)
                $scope.selectedColumns.push(column);
            else
                _.remove($scope.selectedColumns, { field: column.field });

            vm.onColumnClick({
                column: column
            });
        }

        /* HELPER FUNCTIONS */
        function selectColumns() {
            $scope.selectedColumns = vm.columns.filter(function (column) {
                return column.isSelected
            });
        }
    }

})();
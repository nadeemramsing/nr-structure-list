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
        $scope.onDrop = onDrop;


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
        function onDrop(index, item, external, type) {
            var currentIndex = _.findIndex(vm.columns, {
                field: item.field
            });

            item.order = index;

            vm.columns
                .move(currentIndex, index)
                .map(function (column, index) {
                    return Object.assign(column, {
                        order: index
                    });
                });

            return item;
        }

        function onColumnClick(column) {
            addOrRemoveColumn(column);
            vm.onColumnClick({
                column: column
            });
        }

        /* HELPER FUNCTIONS */
        function selectColumns() {
            $scope.selectedColumns = _.chain(vm.columns)
                .filter({ isSelected: true })
                .value();
        }

        function addOrRemoveColumn(column) {
            if (column.isSelected)
                $scope.selectedColumns.push(column);
            else
                _.remove($scope.selectedColumns, { field: column.field });

            $scope.selectedColumns = _.orderBy($scope.selectedColumns, 'order', 'asc');
        }
    }

})();
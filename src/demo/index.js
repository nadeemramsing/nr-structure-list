(function () {

    'use strict';

    angular
        .module('Demo', [
            'ngMaterial',
            'NrStructureList'
        ])
        .controller('DemoController', DemoController);

    /* @ngInject */
    function DemoController($scope, $http, $httpParamSerializer, $q) {

        /* BINDED VAR */
        $scope.paginationOptions = {
            'query': { skip: 0, limit: 5 },
            'searchText': ''
        };
        $scope.comments = [];

        $scope.getCount = getCommentsCount;
        $scope.onColumnClick = onColumnClick;
        $scope.onDocumentSelect = onDocumentSelect;
        $scope.onLimitChange = onLimitChange;
        $scope.onPageChange = onPageChange;

        $scope.searchComments = searchComments;

        /* LOCAL VAR */
        var BASEURL = 'http://localhost:4000/api/comments',
            defaultColumns = [
                'id',
                'name',
                'email',
                'body'
            ];

        /* INIT */
        init();

        /* FUNCTION DECLARATIONS */
        function init() {
            var promises = {};

            promises.comments = getComments({ limit: $scope.paginationOptions.query.limit });
            promises.fields = getCommentsFields();

            $q.all(promises).then(function (responses) {
                _.each(responses, function (response, key) {
                    $scope[key] = response.data;
                });

                $scope.fields = initColumns($scope.fields);
            });
        }

        function initColumns(columns) {
            columns = _.cloneDeep(columns);

            return _.chain(columns)
                .map(function (column, index) {
                    return Object.assign(column, {
                        isSelected: defaultColumns.includes(column.field),
                        
                        //setting index as order
                        order: index
                    });
                })
                .value();
        }

        function onColumnClick(column) {
            console.log("onColumnClick, column: ", column);
        }

        function onDocumentSelect(document) {
            console.log("onDocumentSelect, document: ", document);
            console.log("$scope.comments:", $scope.comments);
        }

        function onLimitChange(limit) {
            console.log("onLimitChange, limit: ", limit);
        }

        function onPageChange(options) {
            var promises = {};

            promises.getComments = getComments(options.query);

            if (options.reload)
                promises.getCommentsCount = getCommentsCount(options.query);

            $q.all(promises).then(function (responses) {
                $scope.comments = responses.getComments.data;

                if (responses.getCommentsCount)
                    $scope.$broadcast('paginationListener', {
                        count: responses.getCommentsCount
                    });
            });
        }

        function searchComments(event) {
            var args = {};

            if ($scope.paginationOptions.searchText === '')
                args = {
                    operation: 'reset-search',
                    reload: true
                };
            else
                args = {
                    additionalQuery: { searchText: $scope.paginationOptions.searchText },
                    operation: 'normal-search',
                    reload: true
                };

            $scope.$broadcast('paginationListener', args);
        }

        /* SERVICE */
        function getComments(query) {
            var qs = qs = $httpParamSerializer(query),
                url = BASEURL + '?' + qs;

            return $http.get(url);
        }

        function getCommentsFields(query) {
            var qs = qs = $httpParamSerializer(query),
                url = BASEURL + '/fields' + '?' + qs;

            return $http.get(url);
        }

        function getCommentsCount(query) {
            var qs = qs = $httpParamSerializer(query),
                url = BASEURL + '/count' + '?' + qs;

            return $http.get(url).then(function (response) {
                return response.data.count;
            });
        }
    }

})();
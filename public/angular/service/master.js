app.config(['$routeProvider',function($routeProvider) {        
    $routeProvider
    .when('/customers', {
        controller: 'CustCtr',
        templateUrl: '/app/customers.html',
        title: 'Customers'
    })
    .when('/items', {
        controller: 'itemCtr',
        templateUrl: '/app/items.html',
        title: 'Items'
    })
    .when('/hsn', {
        controller: 'hsnCtr',
        templateUrl: '/app/hsn.html',
        title: 'HSN'
    })
    .when('/settings', {
        templateUrl: '/app/settings.html',
        title: 'settings',
        controller: 'SettingsCtr',
    });
}])
.controller('SettingsCtr', function($http,$scope,$cacheFactory,$mdToast,$mdDialog){

$http({url: 'users', method: 'GET'}).success(function(data){
    $scope.form=data;
    $scope.form.InvType=JSON.parse(data.InvType);
    $scope.form.InvTy=JSON.parse(data.InvTy);
    $scope.form.InvThr=JSON.parse(data.InvThr);
    $scope.form.InvFrom=JSON.parse(data.InvFrom);
});

$scope.update = function()
{    
    var form=angular.copy($scope.form);
    $http({ url: 'users', method: 'POST',data:form}).success(function(data){
        al('Settings Updated Successfully');
        window.location.reload();
    }).error(function(data,status){
        $scope.formError=data;
    });
}

function al(text)
{
    $mdToast.show($mdToast.simple().textContent(text).position('bottom right').hideDelay(3000));
}

})
.controller('hsnCtr', function($filter,$window,$http,$scope,$cacheFactory,ngTableParams,$mdToast,$mdDialog,$rootScope,$route){
var httpCache = $cacheFactory.get('$http');
var path;
var dialog = {scope:$scope, preserveScope: true, controller: function($scope, $mdDialog){$scope.hide=function(){$mdDialog.hide(); if($scope.Type=='Edit'){$scope.form="";}$scope.formError='';};}, clickOutsideToHide:true};

$http({ url: 'hsn', method: 'GET', cache:true}).success(function(data){
    $scope.data = data;
    $scope.tableSorting = new ngTableParams({page: 1,
    count: 10,
    sorting: {
        ITID: 'desc'
    }
    }, {
        total: $scope.data.length,
        getData: function($defer, params) {
            var filteredData = params.filter() ?
                        $filter('filter')($scope.data, params.filter()) :
                        $scope.data;
                var orderedData = params.sorting() ?
                        $filter('orderBy')(filteredData, params.orderBy()) :
                        $scope.data;
            params.total(orderedData.length);            
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });

});

$scope.searchform =  function(){
 angular.extend($scope.tableSorting.filter(), $scope.search);   
}

$scope.campcreate =  function(ev){
    $scope.Type='New';
    $scope.formError='';
    dialog.targetEvent= ev;
    dialog.templateUrl= '/app/new-hsn.html';
    $mdDialog.show(dialog);
}

$scope.campedit =  function(cid,index,ev){
    $scope.form="";    
    $scope.Type='Edit';
    $scope.formError='';
    angular.forEach($scope.data, function(val){
        if(val.HID==cid)
        { $scope.form=angular.copy(val); }
    });
    dialog.targetEvent= ev;
    dialog.templateUrl= '/app/new-hsn.html';
    $mdDialog.show(dialog);
}

$scope.delete =  function(cid,index,ev){
    var confirm = $mdDialog.confirm({targetEvent:ev})
          .title('Are You sure to delete this HSN?')
          .ok('Yes')
          .cancel('No');

    $mdDialog.show(confirm).then(function() {
            $http({ url: 'hsn/'+cid, method: 'DELETE'}).success(function(data){
                al('Deleted Successfully');
                    angular.forEach($scope.data, function(val,key){
                        if(val.HID==cid)
                        { $scope.data.splice(key,1); }
                    });

                    var cachedResponse = httpCache.get('hsn');
                    cachedResponse[1]=$scope.data;
                    httpCache.put('hsn',cachedResponse);
                    $scope.tableSorting.reload();                

                }).error(function(data,status){
                    al('This HSN in use. Cant Delate');
                });
    }, function() {
        al('Delete Cancelled');
    });
}

$scope.createItem =  function(){
    if($scope.Type=='New')
    {
        add();
    }
    else
    {
        update();
    }
}
function add()
{    
    if($scope.submitbutton==false)    
        {
            return;
        }
      $scope.submitbutton=false;

    var form=angular.copy($scope.form);
    $http({ url: 'hsn', method: 'POST',data:form}).success(function(data){
        al('HSN created Successfully');
    $mdDialog.hide();
    $scope.form='';
    $scope.data.push(data);
    $scope.submitbutton=true;
    var cachedResponse = httpCache.get('hsn');
    cachedResponse[1]=$scope.data;
    httpCache.put('hsn',cachedResponse);
    $scope.tableSorting.reload();
    }).error(function(data,status){
        $scope.formError=data;
        $scope.submitbutton=true;
    });
}

function update()
{    
    var form=angular.copy($scope.form);
    $http({ url: 'hsn/'+$scope.form.HID, method: 'PUT',data:form}).success(function(data){
        al('HSN Details Updated Successfully');
    $mdDialog.hide();
    $scope.form='';

    angular.forEach($scope.data, function(val,key){
        if(val.HID==data.HID)
        { 
            $scope.data[key]=data;
            var cachedResponse = httpCache.get('hsn');
            cachedResponse[1]=$scope.data;
            httpCache.put('hsn',cachedResponse);
            $scope.tableSorting.reload();
     }
    });

    

    }).error(function(data,status){
        $scope.formError=data;
    });
}

function al(text)
{
    $mdToast.show($mdToast.simple().textContent(text).position('bottom right').hideDelay(3000));
}

})
.controller('itemCtr', function($filter,$window,$http,$scope,$cacheFactory,ngTableParams,$mdToast,$mdDialog,$rootScope,$route){
var httpCache = $cacheFactory.get('$http');
var path;
var dialog = {scope:$scope, preserveScope: true, controller: function($scope, $mdDialog){$scope.hide=function(){$mdDialog.hide(); if($scope.Type=='Edit'){$scope.form="";}$scope.formError='';};}, clickOutsideToHide:true};

$http({ url: 'hsn', method: 'GET', cache:true}).success(function(hsn){
    $scope.Hsn=hsn;
});
var hsndata = httpCache.get('hsn');
if(hsndata)
{
    $http({ url: 'hsn', method: 'GET'}).success(function(hsn){
        $scope.Hsn=hsn;
        hsndata[1]=hsn;
        httpCache.put('hsn',hsndata);
    });
}


$http({ url: 'items', method: 'GET', cache:true}).success(function(data){
    $scope.data = data;
    $scope.tableSorting = new ngTableParams({page: 1,
    count: 10,
    sorting: {
        ITID: 'desc'
    }
    }, {
        total: $scope.data.length,
        getData: function($defer, params) {
            var filteredData = params.filter() ?
                        $filter('filter')($scope.data, params.filter()) :
                        $scope.data;
                var orderedData = params.sorting() ?
                        $filter('orderBy')(filteredData, params.orderBy()) :
                        $scope.data;
            params.total(orderedData.length);            
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });

});

$scope.searchform =  function(){
 angular.extend($scope.tableSorting.filter(), $scope.search);   
}


$scope.campcreate =  function(ev){
    $scope.Type='New';
    $scope.formError='';
    dialog.targetEvent= ev;
    dialog.templateUrl= '/app/new-item.html';
    $mdDialog.show(dialog);
}

$scope.campedit =  function(cid,index,ev){
    $scope.form="";    
    $scope.Type='Edit';
    $scope.formError='';
    angular.forEach($scope.data, function(val){
        if(val.ITID==cid)
        { $scope.form=angular.copy(val); }
    });
    dialog.targetEvent= ev;
    dialog.templateUrl= '/app/new-item.html';
    $mdDialog.show(dialog);
}

$scope.delete =  function(cid,index,ev){
    var confirm = $mdDialog.confirm({targetEvent:ev})
          .title('Are You sure to delete this Item?')
          .ok('Yes')
          .cancel('No');

    $mdDialog.show(confirm).then(function() {
            $http({ url: 'items/'+cid, method: 'DELETE'}).success(function(data){
                al('Deleted Successfully');
                    angular.forEach($scope.data, function(val,key){
                        if(val.ITID==cid)
                        { $scope.data.splice(key,1); }
                    });

                    var cachedResponse = httpCache.get('items');
                    cachedResponse[1]=$scope.data;
                    httpCache.put('items',cachedResponse);
                    $scope.tableSorting.reload();                

                }).error(function(data,status){
                    al('This Item in use. Cant Delate');
                });
    }, function() {
        al('Delete Cancelled');
    });
}

$scope.createItem =  function(){
    if($scope.Type=='New')
    {
        add();
    }
    else
    {
        update();
    }
}
function add()
{    
    var form=angular.copy($scope.form);
    if($scope.submitbutton==false)    
    {
        return;
    }
    $scope.submitbutton=false;
    $http({ url: 'items', method: 'POST',data:form}).success(function(data){
        al('Item created Successfully');
    $mdDialog.hide();
    $scope.form='';
    $scope.data.push(data);

    var cachedResponse = httpCache.get('items');
    cachedResponse[1]=$scope.data;
    httpCache.put('items',cachedResponse);
    $scope.tableSorting.reload();
    $scope.submitbutton=true;
    }).error(function(data,status){
        $scope.submitbutton=true;
        $scope.formError=data;
    });
}

function update()
{    
    var form=angular.copy($scope.form);
    $http({ url: 'items/'+$scope.form.ITID, method: 'PUT',data:form}).success(function(data){
        al('Item Details Updated Successfully');
    $mdDialog.hide();
    $scope.form='';

    angular.forEach($scope.data, function(val,key){
        if(val.ITID==data.ITID)
        { 
            $scope.data[key]=data;
            var cachedResponse = httpCache.get('items');
            cachedResponse[1]=$scope.data;
            httpCache.put('items',cachedResponse);
            $scope.tableSorting.reload();
     }
    });

    

    }).error(function(data,status){
        $scope.formError=data;
    });
}

function al(text)
{
    $mdToast.show($mdToast.simple().textContent(text).position('bottom right').hideDelay(3000));
}

})
.controller('CustCtr', function($window,$http,$scope,$cacheFactory,ngTableParams,$mdToast,$mdDialog,$rootScope,$route){
var httpCache = $cacheFactory.get('$http');
var path;
var dialog = {scope:$scope, preserveScope: true, controller: function($scope, $mdDialog){$scope.hide=function(){$mdDialog.hide(); if($scope.Type=='Edit'){$scope.custform="";}$scope.formError='';};}, clickOutsideToHide:true};
$scope.data=[];
$scope.tableSorting = new ngTableParams({
    page: 1,
    count: 10,
    sorting: {
        CID: 'desc'
    }
    }, {
    total: $scope.data.length, 
    getData: function($defer, params) {
        $rootScope.isLoading=true;
        path = 'customers?'+jQuery.param({
        "skip": (params.page() - 1) * params.count(),
        "take": params.count(),
        "filter":params.filter(),
        "orderBy": params.sorting()});

        $http({ cache: true, url: path, method: 'GET'})
        .success(function (result) {
            $scope.data = result.data;
            params.total(result.total);
            $defer.resolve(result.data);
            $rootScope.isLoading=false;
        }); 

        var cachedResponse = httpCache.get(path);
        if(cachedResponse)
        {
          $http({url: path, method: 'GET', ignoreLoadingBar:true}).success(function(sync){
                cachedResponse[1]=sync;
                httpCache.put(path,cachedResponse);
                $scope.data = sync.data;
                params.total(sync.total);
                $defer.resolve(sync.data); 
                $rootScope.isLoading=false;                  
          });  
        } 
    }
})

$scope.searchform =  function(){
 angular.extend($scope.tableSorting.filter(), $scope.search);   
}

$scope.campcreate =  function(ev){
    $scope.Type='New';
    $scope.formError='';
    dialog.targetEvent= ev;
    dialog.templateUrl= '/app/new-customer.html';
    $mdDialog.show(dialog);
}

$scope.campedit =  function(cid,index,ev){
    $scope.custform="";    
    $scope.Type='Edit';
    $scope.formError='';
    $scope.curid=index;
    angular.forEach($scope.data, function(val){
        if(val.CID==cid)
        { $scope.custform=angular.copy(val); }
    });
    dialog.targetEvent= ev;
    dialog.templateUrl= '/app/new-customer.html';
    $mdDialog.show(dialog);
}

$scope.delete =  function(cid,index,ev){
    var confirm = $mdDialog.confirm({targetEvent:ev})
          .title('Are You sure to delete this Customer?')
          .ok('Yes')
          .cancel('No');

    $mdDialog.show(confirm).then(function() {
            $http({ url: 'customers/'+cid, method: 'DELETE'}).success(function(data){
                al('Deleted Successfully');
                $scope.data.splice(index,1);
                }).error(function(data,status){
                    al('This Customer has invoice in use. Cant Delate');
                });
    }, function() {
        al('Delete Cancelled');
    });
}

$scope.createCustomer =  function(){
    if($scope.Type=='New')
    {
        add();
    }
    else
    {
        update();
    }
}
function add()
{    
    if($scope.submitbutton==false)    
        {
            return;
        }
      $scope.submitbutton=false;

    var custform=angular.copy($scope.custform);
    $http({ url: 'customers', method: 'POST',data:custform}).success(function(data){
        al('Customer created Successfully');
    $mdDialog.hide();
    $scope.custform='';
    $scope.data.push(data);

    var cachedResponse = httpCache.get('customers');
    cachedResponse[1]=$scope.data;
    httpCache.put('customers',cachedResponse);

    $scope.submitbutton=true;
    }).error(function(data,status){
        $scope.formError=data;
        $scope.submitbutton=true;
    });
}

function update()
{    
    var custform=angular.copy($scope.custform);
    $http({ url: 'customers/'+$scope.custform.CID, method: 'PUT',data:custform}).success(function(data){
        al('Customer Details Updated Successfully');
    $mdDialog.hide();
    $scope.custform='';
    $scope.data[$scope.curid]=data;

    var cachedResponse = httpCache.get('customers');
    cachedResponse[1]=$scope.data;
    httpCache.put('customers',cachedResponse);

    }).error(function(data,status){
        $scope.formError=data;
    });
}

function al(text)
{
    $mdToast.show($mdToast.simple().textContent(text).position('bottom right').hideDelay(3000));
}

})

app.config(['$routeProvider',function($routeProvider) {        
    $routeProvider
    .when('/payments', {
        controller: 'PayCtr',
        templateUrl: '/app/payment.html',
        title: 'Payments'
    })
    .when('/print-receipt/:id', {
        controller: 'ReceiptCtr',
        templateUrl: '/app/receipt.html',
        title: 'Print Receipt'
    })
    .when('/reports', {
        controller: 'ReportsCtr',
        templateUrl: '/app/report.html',
        title: 'Reports'
    })
    .when('/auditor-report', {
        templateUrl: '/app/auditor.html',
        title: 'Auditor Report',
        controller: 'AudCtr'
    });
}])
.controller('PayCtr', function($route,$http,$scope,$cacheFactory,ngTableParams,$mdToast,$mdDialog,$rootScope,$location){

var path;
var httpCache = $cacheFactory.get('$http');

    $scope.mainGridOptions = {
                dataSource: {
                    transport: {
                        read : function (options) {
                            path = '/invoice?'+jQuery.param(options.data);
                            $http({ url: path, method: 'GET', cache: true}).success(function(data){
                                options.success(data);
                            });
                            var cachedResponse = httpCache.get(path);
                            if(cachedResponse)
                            {
                              $http({url: path, method: 'GET'}).success(function(sync){
                                    options.success(sync);
                                    cachedResponse[1]=sync;
                                    httpCache.put(path,cachedResponse);                 
                              });  
                            }
                            }
                    },
                    schema: {
                        data: "data", 
                        total: "total"
                    },
                    sort: {
                        field: "InvNo",
                        dir: "desc"
                    },
                    height: 550,
                    groupable: true,
                    pageSize: 5,
                    cache:true,
                    serverFiltering: true,
                    serverPaging: true,
                    serverSorting: true,
                    filter: { Type:"Payment" },                    
                },
                sortable: true,                
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5,
                    pageSizes: [5,10,20,50,100]
                },
                columns: [{
                    field: "InvNo",
                    title: "Inv No",
                    width: "70px"
                    },{
                    template: '{{#: Date #*1000|date:"dd-MM-yyyy"}}',
                    field: "Date",
                    title: "Date",
                    width: "100px"
                    },{
                    template: '<a href="" > #: CName # - #: Mobile1 #</a>',
                    field: "CName",
                    title: "Company"
                    },{
                    template: '{{dataItem.Total | currency : "&\\#8377; " : 2}}',
                    field: "Total",
                    width: "120px"                    
                    },{                    
                    template: '{{dataItem.Total - dataItem.Balance| currency : "&\\#8377; " : 2}}',
                    title: "Paid",
                    width: "120px"                    
                    },{
                    template: '{{ dataItem.Balance| currency : "&\\#8377; " : 2}}',
                    field: "Balance",
                    width: "120px"
                    },{
                    template: '{{#: Due #*1000|date:"dd-MM-yyyy"}}',
                    field: "Due",
                    title: "Due Date",
                    width: "120px"
                    },{
                    template: '<b ng-if="dataItem.Status!=\'Closed\'&&dataItem.Diff>0">{{#: Diff #}}</b>',   
                    field: "Diff",
                    title: "Day Count",
                    width: "90px"
                    },{
                    template:'<span ng-if="dataItem.Diff<1&&dataItem.Status!=\'Closed\'" class="label label-success">Payable</span><span ng-if="dataItem.Diff>0&&dataItem.Status!=\'Closed\'" class="label label-danger">Over Due</span><span ng-if="dataItem.Status==\'Closed\'" class="label label-success">Closed</span>',
                    field: "Status",
                    width: "90px"                    
                    }]
            };

            $scope.detailGridOptions = function(dataItem) {
                $scope.data=dataItem;
                return {
                    dataSource: {
                        transport: {
                            read: "/payment"
                        },
                        schema: {
                        data: "data", 
                        total: "total" 
                        },
                        sort: {
                            field: "PID",
                            dir: "desc"
                        },
                        serverPaging: true,
                        serverSorting: true,
                        serverFiltering: true,
                        pageSize: 5,
                        filter: { field: "IID", operator: "=", value: dataItem.IID }
                    },
                    scrollable: false,
                    sortable: true,
                    pageable: true,
                    columns: [
                    { template: '{{#: Date #*1000|date:"dd-MM-yyyy"}}', field: "Date", title:"Date", width: "100px" },
                    { field: "Cheque", title:"Type", width: "110px" },
                    { field: "Bank", title:"Bank" },
                    { 
                        template: '{{ dataItem.Amount| currency : "&\\#8377; " : 2}}',
                        field: "Amount", title:"Amount" , width: "110px" },
                    { field: "Detail", title: "Detail" },
                    { template:'<ul class="icons-list"><li class="dropdown"><a href="" ng-click="editpay(dataItem)" class="dropdown-toggle md-primary" data-toggle="dropdown"><i class="glyphicon glyphicon-edit"></i></a></li></ul>',
                        title: "Action", width: "90px" }
                    ]
                };
            };

            
var httpCache = $cacheFactory.get('$http');
$scope.search={};

$scope.makepay =  function(data){
    $scope.Type='New';    
    $scope.data=angular.copy(data);
    $scope.Balance=angular.copy($scope.data.Balance);
    $scope.form={IID:data.IID,Dat:new Date()};
    console.log($scope.data);
    $mdDialog.show({      
      scope:$scope,  
      preserveScope: true,
      controller: DialogController,
      templateUrl: 'register.html',
      clickOutsideToHide:true
    });
}

$scope.editpay =  function(data){
    $scope.Type='Edit';
    $scope.form=data;
    $scope.Balance=parseInt(data.Amount)+parseInt(angular.copy($scope.data.Balance));
    $scope.form.Dat = new Date(data.Date*1000);
    $mdDialog.show({      
      scope:$scope,  
      preserveScope: true,
      controller: DialogController,
      templateUrl: 'register.html',
      clickOutsideToHide:true
    });
    
}

function DialogController($scope, $mdDialog) {
$scope.hide = function() {
  $mdDialog.hide();
};
}

$scope.submit =  function(){
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
    form.Date= Math.round(new Date($scope.form.Dat).getTime() / 1000);
    $http({ url: 'payment', method: 'POST',data:form}).success(function(data){
        al('Payment created Successfully');
        $route.reload();
        $scope.submitbutton=true;
    }).error(function(data,status){
        $scope.formError=data;
        $scope.submitbutton=true;
    });
}

function update()
{    
    var form=angular.copy($scope.form);
    form.Date= Math.round(new Date($scope.form.Dat).getTime() / 1000);
    $http({ url: 'payment/'+$scope.form.PID, method: 'PUT',data:form}).success(function(data){
        al('Payment Details Updated Successfully');
        $route.reload();
    }).error(function(data,status){
        $scope.formError=data;
    });
}

function al(text)
{
    $mdToast.show($mdToast.simple().textContent(text).position('bottom right').hideDelay(3000));
}


$scope.searchform =  function(){

    var grid = $("#grid").data("kendoGrid");
    $scope.search.FromDate = Math.round(new Date($scope.FromDat).getTime() / 1000);
    $scope.search.ToDate = Math.round(new Date($scope.ToDat).getTime() / 1000);
    grid.dataSource.filter($scope.search);
 
}

$scope.reset =  function(){
    $scope.ToDat=null;
    $scope.FromDat=null;
    $scope.search={};
    var grid = $("#grid").data("kendoGrid");
    grid.dataSource.filter($scope.search);
 
}

})
.controller('ReceiptCtr', function($window,$http,$scope,$cacheFactory,ngTableParams,$mdToast,$mdDialog,$location,$routeParams){

var pid=$routeParams.id;
$http({url: 'payment/'+pid+'/edit', method: 'GET', ignoreLoadingBar:true}).success(function(data){
$scope.data = data.data;                  
$scope.form = data.form;                  
});

$scope.data=print.data;
var httpCache = $cacheFactory.get('$http');    
var cachedResponse = httpCache.get('payment/'+pid+'/edit');
if(cachedResponse)
{
  $http({url: 'payment/'+pid+'/edit', method: 'GET', ignoreLoadingBar:true}).success(function(sync){
        cachedResponse[1]=sync;
        httpCache.put('payment/'+pid+'/edit',cachedResponse);
        $scope.data = sync.data;                  
        $scope.form = sync.form;                  
  });  
}

$scope.print = function()
{    
 $window.print();
}
})
.controller('ReportsCtr', function($q,$timeout,$window,$http,$scope,$cacheFactory,ngTableParams,$mdToast,$mdDialog,$location,$routeParams){
$scope.search={};
var dialog = {scope:$scope, preserveScope: true, controller: function($scope, $mdDialog){$scope.hide=function(){$mdDialog.hide(); if($scope.Type=='Edit'){$scope.form="";}$scope.formError='';};}, clickOutsideToHide:true};
$scope.FromDat=new Date();
$scope.ToDat=new Date();

$scope.searchform =  function(){

    $scope.search.FromDate = Math.round(new Date($scope.FromDat).getTime() / 1000);
    $scope.search.ToDate = Math.round(new Date($scope.ToDat).getTime() / 1000);
    $scope.search.CID=angular.copy($scope.form.Customer.CID);
    $http({ url: 'reports', method: 'GET',params:$scope.search}).success(function(data){
    $scope.data=data;
    });
 
}



$scope.mailto =  function(ev){
    dialog.targetEvent= ev;
    dialog.templateUrl= '/app/mailto.html';
    $mdDialog.show(dialog);
}

$scope.sendmail =  function(){

    $mdDialog.hide();
    kendo.drawing.drawDOM($('.printpage'),{paperSize:"a3"}).then(function(group){
    kendo.drawing.pdf.toDataURL(group, function(dataURL){
        $scope.emailform.Pdf=dataURL;
    $http({ url: 'sendinvoice', method: 'POST',data:$scope.emailform}).success(function(data){
        al('Report Sent Successfully');
    }).error(function(data,status){
            var confirm = $mdDialog.alert({
                title: 'Warning',
                textContent: 'Mail Configuration Error',
                ok: 'Close'
              });
        $mdDialog.show(confirm);
    }); 

    });
    });
}

function al(text)
{
    $mdToast.show($mdToast.simple().textContent(text).position('bottom right').hideDelay(3000));
}
$scope.print = function(selector)
{
kendo.drawing.drawDOM($('.printpage'),{paperSize:"a3"}).then(function(group){
kendo.drawing.pdf.toDataURL(group, function(dataURL){
$scope.url = dataURL;
});
});
}


$http({url: 'customers/1', method: 'GET',cache:true, ignoreLoadingBar:true}).success(function(sync){
    $scope.Customers=sync;               
});
$scope.query = function(searchText) {

var deferred = $q.defer();

$timeout(function() {
    var states = getStates().filter(function(state) {
        return (state.Name.toUpperCase().indexOf(searchText.toUpperCase()) !== -1 || state.CName.toUpperCase().indexOf(searchText.toUpperCase()) !== -1);
    });
    deferred.resolve(states);
});

return deferred.promise;
   

};

function getStates() {
    return $scope.Customers;
    }

})
.controller('AudCtr', function($q,$timeout,$window,$http,$scope,$cacheFactory,ngTableParams,$mdToast,$mdDialog,$location,$routeParams){
$scope.search={};
var dialog = {scope:$scope, preserveScope: true, controller: function($scope, $mdDialog){$scope.hide=function(){$mdDialog.hide(); if($scope.Type=='Edit'){$scope.form="";}$scope.formError='';};}, clickOutsideToHide:true};
$scope.FromDat=new Date();
$scope.ToDat=new Date();

$scope.searchform =  function(){
    $scope.search.FromDate = Math.round(new Date($scope.FromDat).getTime() / 1000);
    $scope.search.ToDate = Math.round(new Date($scope.ToDat).getTime() / 1000);
    $http({ url: 'auditor', method: 'GET',params:$scope.search}).success(function(data){
        $scope.data=data;
    });
 
}

$scope.mailto =  function(ev){
    dialog.targetEvent= ev;
    dialog.templateUrl= '/app/mailto.html';
    $mdDialog.show(dialog);
}

$scope.sendmail =  function(){

    $mdDialog.hide();
    kendo.drawing.drawDOM($('.printpage'),{paperSize:"a3"}).then(function(group){
    kendo.drawing.pdf.toDataURL(group, function(dataURL){
        $scope.emailform.Pdf=dataURL;
    $http({ url: 'sendinvoice', method: 'POST',data:$scope.emailform}).success(function(data){
        al('Report Sent Successfully');
    }).error(function(data,status){
            var confirm = $mdDialog.alert({
                title: 'Warning',
                textContent: 'Mail Configuration Error',
                ok: 'Close'
              });
        $mdDialog.show(confirm);
    }); 

    });
    });
}

function al(text)
{
    $mdToast.show($mdToast.simple().textContent(text).position('bottom right').hideDelay(3000));
}
$scope.print = function(selector)
{
kendo.drawing.drawDOM($('.printpage'),{paperSize:"a3"}).then(function(group){
kendo.drawing.pdf.toDataURL(group, function(dataURL){
$scope.url = dataURL;
});
});
}


})
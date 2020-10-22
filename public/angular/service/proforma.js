app.config(['$routeProvider',function($routeProvider) {        
    $routeProvider.when('/dashboard', {
        templateUrl: '/app/dashboard.html',
        title: 'Dashboard',
        controller: 'DashCtr',
    })
    .when('/create-proforma', {
        controller: 'ProcreateCtr',
        templateUrl: '/app/create-proforma.html',
        title: 'Proforma'
    })
    .when('/regen/:rid', {
        controller: 'ProcreateCtr',
        templateUrl: '/app/create-proforma.html',
        title: 'Proforma'
    })
    .when('/proforma', {
        controller: 'ProCtr',
        templateUrl: '/app/proforma.html',
        title: 'Proforma'
    })
    .when('/proforma-edit/:id', {
        controller: 'ProcreateCtr',
        templateUrl: '/app/create-proforma.html',
        title: 'Edit Proforma'
    })
    .when('/proforma-invoice/:pi', {
        controller: 'InvcreateCtr',
        templateUrl: '/app/create-invoice.html',
        title: 'Create Invoice'
    })
    .when('/proforma-print/:id', {
        controller: 'ProformaPrintCtr',
        templateUrl: '/app/proformaprint.html',
        title: 'Print'
    }).otherwise({ redirectTo: '/dashboard' });
}])
.controller('DashCtr', function($filter,$http,$scope,$cacheFactory,$rootScope){
$rootScope.isLoading = false;


$http({url: 'dash', method: 'GET',cache:true}).success(function(sync){
$scope.invoice=sync.invoice;
$scope.invamount=sync.invamount;
$scope.puramount=sync.puramount;
$scope.purchase=sync.payment;
$scope.stat=sync.stat;
$scope.report=sync.report;
var totin=0;
var payin=0;
var totpo=0;
var paypo=0;
angular.forEach(sync.invoice, function(val){
               totin=totin+parseFloat(val.Total);
               payin=payin+parseFloat(val.Balance);
    });

angular.forEach(sync.payment, function(val2){
               totpo=totpo+parseFloat(val2.Amount);
               paypo=paypo+parseFloat(val2.Balance);
    });

$scope.totin=totin;
$scope.payin=payin;
$scope.totpo=totpo;
$scope.paypo=paypo;

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

var data = google.visualization.arrayToDataTable([
  ['Status','Total'],
  ['',($scope.stat.Payable/$scope.stat.Total)*100],
  ['',(($scope.stat.Total-$scope.stat.Payable)/$scope.stat.Total)*100],
]);

var data2 = google.visualization.arrayToDataTable([
  ['Status','Total'],
  ['',($scope.stat.Overdue/$scope.stat.Total)*100],
  ['',(($scope.stat.Total-$scope.stat.Overdue)/$scope.stat.Total)*100],
]);

var options = {
    title: 'Payments Pending',
    sliceVisibilityThreshold: .2,
  pieHole: 0.9,
  pieSliceTextStyle: {
    color: 'black',
  },
  legend: 'none'
};

var options2 = {
    title: 'Overdue',
    sliceVisibilityThreshold: .2,
  pieHole: 0.9,
  pieSliceTextStyle: {
    color: 'black',
  },
  legend: 'none'
};
var report=[['Month', 'Payments', 'Invoice']];
angular.forEach($scope.report, function(val){
        var t=[];
        t.push($filter('date')(val.Date*1000, "dd-MM-yyyy"));
        t.push(val.Payment);
        t.push(val.Invoice);
        report.push(t);
    });
var data3 = google.visualization.arrayToDataTable(report);

        var options3 = {
          title: 'Company Performance',
          curveType: 'function',
          legend: { position: 'bottom' }
        };


var chart3 = new google.visualization.LineChart(document.getElementById('curve_chart'));
chart3.draw(data3, options3);

}

});

})
.controller('ProcreateCtr', function($rootScope,$mdDialog, $filter,$q,$timeout, $http,$scope,$cacheFactory,ngTableParams,$mdToast,$mdDialog,$location,$routeParams){

var prid=$routeParams.id;
var rid=$routeParams.rid;
var dc=$routeParams.dc;
var httpCache = $cacheFactory.get('$http');    
$scope.form2={};
$scope.multiple=false;

$scope.InvFrom = JSON.parse($rootScope.Authuser.InvFrom);
$scope.InvThr = JSON.parse($rootScope.Authuser.InvThr);
$scope.InvTy = JSON.parse($rootScope.Authuser.InvTy);

  $http({url: 'customers/1', method: 'GET',cache:true, ignoreLoadingBar:true}).success(function(sync){
        $scope.Customers=sync;               
  });


  $http({url: 'items', method: 'GET',cache:true, ignoreLoadingBar:true}).success(function(items){
        $scope.Items=items;               
  });

var items = httpCache.get('items');
if(items)
{
    $http({ url: 'items', method: 'GET', cache:true}).success(function(items){
        $scope.Items=items
        items[1]=items;
        httpCache.put('items',items);
    });
}

$http({ url: 'hsn/hsn', method: 'GET'}).success(function(hsn){
        $scope.GST=hsn.gst;
        $scope.HSN=hsn.hsn;
    });

if(prid)
{
$scope.Type="Edit";
$http({url: 'proforma/'+prid+'/edit', method: 'GET', ignoreLoadingBar:true}).success(function(data){

$scope.details=data.proforma_details;
$scope.form=data;


$scope.form.Dat=new Date(data.Date*1000);
$scope.form.Du=new Date(data.Due*1000);
$scope.form.Customer = $filter('filter')($scope.Customers, {CID:angular.copy(parseInt(data.CID))}, true)[0];
// $scope.form.Customer=data.CName;
if(data.details[0].RIGST==0)
{
    $scope.form.GST=data.details[0].RCGST*2;
}
else
{
    $scope.form.GST=data.details[0].RIGST;
}
});

$scope.data=print.data;
var cachedResponse = httpCache.get('proforma/'+prid+'/edit');
if(cachedResponse)
{
  $http({url: 'proforma/'+prid+'/edit', method: 'GET', ignoreLoadingBar:true}).success(function(sync){
        cachedResponse[1]=sync;
        httpCache.put('proforma/'+prid+'/edit',cachedResponse);
        
        $scope.details=sync.details;
        $scope.form=sync;
        $scope.form.Dat=new Date(sync.Date*1000); 
        $scope.form.Du=new Date(sync.Due*1000); 
        $scope.form.Customer=data.CName;    
                      

  });  
}

}
else
{
$scope.Type="Create";    
$scope.details=[];
$scope.form={Dat: new Date(),Du: new Date()};
}


if(dc)
{

    var httpCache = $cacheFactory.get('$http');    
    var cachedResponse = httpCache.get('dcconvert');

    $scope.form.Dat=new Date(); 
    $scope.form.Du=new Date(); 
    

    angular.forEach(cachedResponse, function(val){
        var det={};
        det.Dc=val.DcNo;
        det.Date=$filter('date')(val.Date*1000, "dd-MM-yyyy");
        det.Des=val.Description;
        det.Qty=val.TotMeters;
        $scope.details.push(det);
        $scope.form.Customer={CName:val.CName,CID:val.CID}; 
        $scope.form.CID=val.CID; 
        calctotal();        
    });

}
var value;

$scope.query = function(searchText) {
var deferred = $q.defer();
$timeout(function() {
    var states = getStates().filter(function(state) {
        return (state.Name.toUpperCase().indexOf(searchText.toUpperCase()) !== -1 || state.CName.toUpperCase().indexOf(searchText.toUpperCase()) !== -1);
    });
    deferred.resolve(states);
}, 0);
return deferred.promise;
};

function getStates() {
    return $scope.Customers;
    }




$scope.fill =  function(){

        angular.forEach($scope.dc, function(val){
            if(val.DcNo==$scope.form2.Dc)
            {
                var curdata=angular.copy(val);
                $scope.form2.Date=$filter('date')(curdata.Date*1000, "dd-MM-yyyy");
                $scope.form2.Dat=curdata.Date;
                $scope.form2.Des=curdata.Description;
                $scope.form2.Qty=curdata.TotMeters;
            }
        });
}

$scope.create =  function(){
    
    $scope.form.Date = Math.round(new Date($scope.form.Dat).getTime() / 1000);

    var date = new Date($scope.form.Dat);
    date.setDate(date.getDate() + $rootScope.Authuser.Due*1);
    $scope.form.Due = Math.round(date.getTime() / 1000);

    if($scope.Type=='Create')
    {
        if(rid)
        {
           $scope.form.RID=rid; 
        }
        newin();
    }
    else
    {
        updatein();
    }

     
}

function newin()
{
    if($scope.details.length>0&&$scope.form.Total)
    {

    if($scope.submitbutton==false)    
    {
        return;
    }
    $scope.submitbutton=false;

    $http({ url: 'proforma', method: 'POST',data:{proforma:$scope.form,details:$scope.details}}).success(function(data){
        al('Proforma created Successfully');
    $location.path('/proforma');

    }).error(function(data,status){
        $scope.formError=data;
        $scope.submitbutton=true;
        var confirm = $mdDialog.alert({
                title: 'Warning',
                textContent: data,
                ok: 'Close'
              });
        $mdDialog.show(confirm);
    }); 
    }
    else
    {
        var confirm = $mdDialog.alert({
                title: 'Warning',
                textContent: 'Add atleast one record',
                ok: 'Close'
              });
        $mdDialog.show(confirm);
    }
}

function updatein()
{
    if($scope.details.length>0)
    {
    $http({ url: 'proforma/'+$scope.form.PRID, method: 'PUT',data:{proforma:$scope.form,details:$scope.details}}).success(function(data){
        al('Proforma Updated Successfully');
    $location.path('/proforma');

    }).error(function(data,status){
        var confirm = $mdDialog.alert({
                title: 'Warning',
                textContent: data,
                ok: 'Close'
              });
        $mdDialog.show(confirm);
    });
    }
    else
    {
        var confirm = $mdDialog.alert({
                title: 'Warning',
                textContent: 'Add atleast one record',
                ok: 'Close'
              });
        $mdDialog.show(confirm);
    }
}

$scope.todelete =  function(prid){
   var confirm = $mdDialog.confirm()
          .title('Are You sure to delete this Proforma?')
          .ok('Yes Delete it!')
          .cancel('Cancel');

    $mdDialog.show(confirm).then(function() {
            $http({ url: 'proforma/'+prid, method: 'DELETE'}).success(function(data){
                al('Deleted Successfully');
                $location.path('/proforma');
                }).error(function(data,status){
                    al('This Proforma in use. Cant Delate');
                });
    }, function() {
        al('Delete Cancelled');
    });
}

$scope.cancel =  function(status){

   $http({ url: 'proforma-st', method: 'POST',data:{PRID:$scope.form.PRID,Status:status}}).success(function(data){
        $scope.form.Status=data.Status;
        al('Status changed Successfully');
    }).error(function(data,status){
        var confirm = $mdDialog.alert({
                title: 'Warning',
                textContent: data,
                ok: 'Close'
              });
        $mdDialog.show(confirm);
    });
}


$scope.delete =  function(index){
    $scope.details.splice(index,1);
    calctotal();
}





$scope.edit =  function(index){

    $scope.form2=angular.copy($scope.details[index]);
    $scope.form2.Item = $filter('filter')($scope.Items, {ITID:angular.copy(parseInt($scope.form2.ITID))}, true)[0];
    $scope.curedit=index;
}

$scope.save =  function(index){

    if($scope.form.State==32)
    {
        $scope.form2.RCGST=angular.copy($scope.form2.GST/2);
        $scope.form2.RSGST=angular.copy($scope.form2.GST/2);
        $scope.form2.RIGST=0;
        var gst = angular.copy(($scope.form2.Amount*$scope.form2.RCGST)/100);
        $scope.form2.CGST=gst;
        $scope.form2.SGST=gst;
        $scope.form2.IGST=0;
    }
    else
    {
        $scope.form2.RCGST=0;
        $scope.form2.RSGST=0;
        $scope.form2.RIGST=angular.copy($scope.form2.GST);
        var gst = angular.copy(($scope.form2.Amount*$scope.form2.RIGST)/100);
        $scope.form2.CGST=0;
        $scope.form2.SGST=0;
        $scope.form2.IGST=gst;
    }

     $scope.form2.Total=parseFloat($scope.form2.Amount)+parseFloat($scope.form2.CGST)+parseFloat($scope.form2.SGST)+parseFloat($scope.form2.IGST);



    $scope.details[$scope.curedit]=angular.copy($scope.form2);
    $scope.form2="";
    $scope.curedit=undefined;
    calctotal();
}



function al(text)
{
    $mdToast.show($mdToast.simple().textContent(text).position('bottom right').hideDelay(3000));
}

var dialog = {scope:$scope, preserveScope: true, controller: function($scope, $mdDialog){$scope.hide=function(){$mdDialog.hide(); if($scope.Type=='Edit'){$scope.custform="";}$scope.formError='';};}, clickOutsideToHide:true};


$scope.proformadetails =  function(ev){
    $scope.formError='';
    dialog.targetEvent= ev;
    dialog.templateUrl= '/app/proformadetails.html';
    $mdDialog.show(dialog);
}

$scope.createNewCustomer =  function(ev){
    $scope.Type='New';
    $scope.formError='';
    dialog.targetEvent= ev;
    dialog.templateUrl= '/app/new-customer.html';
    $mdDialog.show(dialog);
}

$scope.createCustomer = function()
{    
    var custform=angular.copy($scope.custform);
    $http({ url: 'customers', method: 'POST',data:custform}).success(function(data){
        al('Customer created Successfully');
    $mdDialog.hide();
    $scope.custform='';
    $scope.Customers.push(data);
    var cachedResponse = httpCache.get('customers/1');
    cachedResponse[1]=$scope.data;
    httpCache.put('customers/1',cachedResponse);
    $scope.form.Customer=data;
    }).error(function(data,status){
        $scope.formError=data;
    });
}

$scope.itemquery = function(itemText) {
var deferred = $q.defer();
var states = $scope.Items.filter(function(state) {
    if(angular.isDefined(itemText)&&itemText!='')
    {
        return (state.IName.toUpperCase().indexOf(itemText.toUpperCase()) !== -1);        
    }
    else
    {
        $scope.form2.ITID = undefined;
        return [];
    }
});
deferred.resolve(states);
return deferred.promise;
};


$scope.createNewItem =  function(ev){
    $scope.Type='New';
    $scope.formError='';
    dialog.targetEvent= ev;
    dialog.templateUrl= '/app/new-item.html';
    $mdDialog.show(dialog);
}

$scope.customerchange = function()
{
    if(angular.isDefined($scope.form.Customer)&&$scope.form.Customer!=null)
    {        
        $scope.form.CID=angular.copy($scope.form.Customer.CID);
        $scope.form.State=angular.copy($scope.form.Customer.State);
        $scope.calcdetails();
    }

}

$scope.inamechange = function()
{
    if(!$scope.form2.IName)
    {        
        $scope.form2.Item = undefined;        
        $scope.form2.ITID = undefined;
       document.querySelector('#autoCompleteId').focus();
    }
}

$scope.itemchange = function()
{
    if(angular.isDefined($scope.form2.Item)&&$scope.form2.Item!=null)
    {        
        $scope.form2.ITID=angular.copy($scope.form2.Item.ITID);
        $scope.form2.IName=angular.copy($scope.form2.Item.IName);
        $scope.form2.HSN=angular.copy($scope.form2.Item.HSN);
        $scope.form2.Rate=angular.copy($scope.form2.Item.SRate);
        // $scope.form2.GST=angular.copy($scope.form2.Item.GST);
        $scope.calc();
        $( "#qty" ).focus();
    }

}



$scope.gstchange = function()
{
    $scope.details=[];
    calctotal();
}


$scope.createItem =  function()
{    
    var form=angular.copy($scope.form);
    $http({ url: 'items', method: 'POST',data:form}).success(function(data){
        al('Item created Successfully');
    $mdDialog.hide();
    $scope.form='';
    $scope.Items.push(data);

    var cachedResponse = httpCache.get('items');
    cachedResponse[1]=$scope.Items;
    httpCache.put('items',cachedResponse);
    $scope.form2.Item=data;
    }).error(function(data,status){
        $scope.formError=data;
    });
}


$scope.calc =  function(){
    if($scope.form.Customer==undefined||$scope.form.Customer==null)
    {
        var confirm = $mdDialog.alert({
            title: 'Warning',
            textContent: 'Select Customer',
            ok: 'Close'
          });
        $mdDialog.show(confirm);
        // $scope.form2.Rate=0;
        // $scope.form2.Qty=0;
        // $scope.form2.Taxable=0;
        return;
    }
    // $scope.form2.Amount=Math.round(parseFloat($scope.form2.Rate)*parseFloat($scope.form2.Qty)*100)/100;
    if($scope.form.State==32)
    {
        $scope.form2.RCGST=angular.copy($scope.form2.GST/2);
        $scope.form2.RSGST=angular.copy($scope.form2.GST/2);
        $scope.form2.RIGST=0;
        var gst = angular.copy(($scope.form2.Amount*$scope.form2.RCGST)/100);
        $scope.form2.CGST=gst;
        $scope.form2.SGST=gst;
        $scope.form2.IGST=0;
    }
    else
    {
        $scope.form2.RCGST=0;
        $scope.form2.RSGST=0;
        $scope.form2.RIGST=angular.copy($scope.form2.GST);
        var gst = angular.copy(($scope.form2.Amount*$scope.form2.RIGST)/100);
        $scope.form2.CGST=0;
        $scope.form2.SGST=0;
        $scope.form2.IGST=gst;
    }
     $scope.form2.Total=parseFloat($scope.form2.Amount)+parseFloat($scope.form2.CGST)+parseFloat($scope.form2.SGST)+parseFloat($scope.form2.IGST);   

}

$scope.calcdetails =  function(){
    if($scope.form.Customer==undefined||$scope.form.Customer==null)
    {
        return;
    }    

     angular.forEach($scope.details, function(val,key){
        // if($scope.form.GST==undefined)
        // {
        //     calctotal();
        //     return;
        // }
            if($scope.form.State==32)
            {
                val.RCGST=angular.copy(val.GST/2);
                val.RSGST=angular.copy(val.GST/2);
                val.RIGST=0;
                var gst = angular.copy((val.Amount*val.RCGST)/100);
                val.CGST=gst;
                val.SGST=gst;
                val.IGST=0;
            }
            else
            {
                val.RCGST=0;
                val.RSGST=0;
                val.RIGST=angular.copy(val.GST);
                var gst = angular.copy((val.Amount*val.RIGST)/100);
                val.CGST=0;
                val.SGST=0;
                val.IGST=gst;
            }
            val.Total=parseFloat(val.Amount*1)+parseFloat(val.CGST)+parseFloat(val.SGST)+parseFloat(val.IGST);
            $scope.details[key]=val;
    });
     calctotal();
   

}

$scope.add =  function(){

    if ($scope.curedit||$scope.curedit==0) {
        $scope.save();
        return;
    }

    if($scope.form2.Amount)
    {

    if($scope.form.Customer==undefined||$scope.form.Customer==null)
    {
        var confirm = $mdDialog.alert({
            title: 'Warning',
            textContent: 'Select Customer',
            ok: 'Close'
          });
        $mdDialog.show(confirm);
        return;
    }
    if($scope.form.State==32)
    {
        $scope.form2.RCGST=angular.copy($scope.form2.GST/2);
        $scope.form2.RSGST=angular.copy($scope.form2.GST/2);
        $scope.form2.RIGST=0;
        var gst = angular.copy(($scope.form2.Amount*$scope.form2.RCGST)/100);
        $scope.form2.CGST=gst;
        $scope.form2.SGST=gst;
        $scope.form2.IGST=0;
    }
    else
    {
        $scope.form2.RCGST=0;
        $scope.form2.RSGST=0;
        $scope.form2.RIGST=angular.copy($scope.form2.GST);
        var gst = angular.copy(($scope.form2.Amount*$scope.form2.RIGST)/100);
        $scope.form2.CGST=0;
        $scope.form2.SGST=0;
        $scope.form2.IGST=gst;
    }

     $scope.form2.Total=parseFloat($scope.form2.Amount)+parseFloat($scope.form2.CGST)+parseFloat($scope.form2.SGST)+parseFloat($scope.form2.IGST);



       $scope.details.push(angular.copy($scope.form2));
       $scope.form2='';
       calctotal(); 
    }    
}

function calctotal()
{   
    var qty=0;
    var amount=0;
    var cgst=0;
    var sgst=0;
    var igst=0;
    var round=0;

    angular.forEach($scope.details, function(val){
        qty=qty+parseInt(val.Qty);
        amount=amount+parseFloat(val.Amount);
        cgst=cgst+parseFloat(val.CGST);
        sgst=sgst+parseFloat(val.SGST);
        igst=igst+parseFloat(val.IGST);
    });
    var total = Math.round(amount+cgst+sgst+igst);
    round=Math.round((total-(amount+cgst+sgst+igst))*100)/100;

    $scope.form.Qty=qty
    $scope.form.Amount=amount;
    $scope.form.CGST=cgst;
    $scope.form.SGST=sgst;
    $scope.form.IGST=igst;
    $scope.form.Total=total;
    $scope.form.Round=round;
    $scope.form.Balance=total;
}


})
.controller('ProCtr', function($http,$scope,$cacheFactory,ngTableParams,$mdToast,$mdDialog,$rootScope,$location){

var path;
var httpCache = $cacheFactory.get('$http');

    $scope.mainGridOptions = {
                dataSource: {
                    transport: {
                        read : function (options) {

                            path = '/proforma?'+jQuery.param(options.data);
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
                        field: "ProNo",
                        dir: "desc"
                    },
                    height: 550,
                    groupable: true,
                    pageSize: 5,
                    serverFiltering: true,
                    serverPaging: true,
                    serverSorting: true,
                    filter: { Status:"Open" },                    
                },
                sortable: true,                
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5,
                    pageSizes: [5,10,20,50,100]
                },
                columns: [{
                    template: '#: InvThr # / #: InvTy # / #: ProNo #',
                    field: "ProNo",
                    title: "Proforma No",
                    width: "140px"
                    },{
                    template: '#: InvTy # / #: Job #',
                    field: "Job",
                    title: "Job No",
                    width: "110px"
                    },{
                    template: '{{#: Date #*1000|date:"dd-MM-yyyy"}}',
                    field: "Date",
                    title: "Date",
                    width: "100px"
                    },{
                    template: '<a href="" > #: CName # - #: Mobile1 #</a>',
                    field: "CName",
                    title: "Company",
                    width: "230px"
                    },{
                    template: '{{dataItem.Total | currency : "&\\#8377; " : 2}}',
                    field: "Total",
                    width: "120px"
                    },
                    {
                    template:'<span class="label" ng-class="{Open:\'label-warning\', Invoiced:\'label-success\'}[dataItem.Status]">#: Status #</span>',
                    field: "Status",
                    width: "120px"
                    },{
                    template:'<ul class="icons-list"><li class="dropdown"><a href="\\#/proforma-edit/{{dataItem.PRID}}" class="dropdown-toggle md-primary" data-toggle="dropdown"><i class="glyphicon glyphicon-edit"></i></a></li><li class="dropdown"><a href="\\#/proforma-print/{{dataItem.PRID}}" class="dropdown-toggle"  md-colors="{color: \'pink\'}" data-toggle="dropdown"><i class="glyphicon glyphicon-print"></i></a></li></ul>',
                    title: "Actions",
                    width: "120px"
                    },{
                    template:'<ul class="icons-list"><li class="dropdown"><a href="\\#/proforma-invoice/{{dataItem.PRID}}"  class="dropdown-toggle md-primary" ng-hide=dataItem.Status=="Invoiced" data-toggle="dropdown"><i class="glyphicon glyphicon-check"></i></a></li></ul>',
                    title: "Generete To Invoice",
                    width: "120px"
                }
                ]
            };
            
$scope.search={};

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
.controller('ProformaPrintCtr', function($mdToast,$timeout,$filter,$window,$http,$scope,$cacheFactory,ngTableParams,$mdToast,$mdDialog,$location,$routeParams,$rootScope){

var prid=$routeParams.id;
var sid=$routeParams.sid;
var prdid=$routeParams.prdid;
$scope.InvType = JSON.parse($rootScope.Authuser.InvType);
$scope.InvCur = angular.copy($scope.InvType);
var dialog = {scope:$scope, preserveScope: true, controller: function($scope, $mdDialog){$scope.hide=function(){$mdDialog.hide(); if($scope.Type=='Edit'){$scope.form="";}$scope.formError='';};}, clickOutsideToHide:true};


if(prid)
{
$http({url: 'proforma/'+prid+'/edit', method: 'GET', ignoreLoadingBar:true}).success(function(data){
$scope.data = data;
// console.log(data); 

$timeout(function(){

$scope.tbody = angular.element("#tbody")[0].offsetHeight;
var tbody=angular.copy($scope.tbody);
if(tbody<1070)
{
    $scope.myheight={'height':(1070-tbody)+'px'};
}

},500);



});


$scope.data=print.data;
var httpCache = $cacheFactory.get('$http');    
var cachedResponse = httpCache.get('proforma/'+prid+'/edit');
if(cachedResponse)
{
  $http({url: 'proforma/'+prid+'/edit', method: 'GET', ignoreLoadingBar:true}).success(function(sync){
        cachedResponse[1]=sync;
        httpCache.put('proforma/'+prid+'/edit',cachedResponse);
        $scope.data = sync;  

        $timeout(function(){

        $scope.tbody = angular.element("#tbody")[0].offsetHeight;
        var tbody=angular.copy($scope.tbody);
        if(tbody<1070)
        {
            $scope.myheight={'height':(1070-tbody)+'px'};
        }

        },1000);

  });  
}
  
}


else if(sid)
{

$http({url: 'packing/'+sid+'/edit', method: 'GET', ignoreLoadingBar:true}).success(function(data){
$scope.data = data;                  
});

$scope.data=print.data;
var httpCache = $cacheFactory.get('$http');    
var cachedResponse = httpCache.get('packing/'+sid+'/edit');
if(cachedResponse)
{
  $http({url: 'packing/'+sid+'/edit', method: 'GET', ignoreLoadingBar:true}).success(function(sync){
        cachedResponse[1]=sync;
        httpCache.put('packing/'+sid+'/edit',cachedResponse);
        $scope.data = sync;                  
  });  
}
  
}

else if(prdid)
{

$http({url: 'dc/'+prdid+'/edit', method: 'GET', ignoreLoadingBar:true}).success(function(data){
$scope.data = data;                  
});

$scope.data=print.data;
var httpCache = $cacheFactory.get('$http');    
var cachedResponse = httpCache.get('dc/'+prdid+'/edit');
if(cachedResponse)
{
  $http({url: 'dc/'+prdid+'/edit', method: 'GET', ignoreLoadingBar:true}).success(function(sync){
        cachedResponse[1]=sync;
        httpCache.put('dc/'+prdid+'/edit',cachedResponse);
        $scope.data = sync;                  
  });  
}
  
}

// $scope.print = function()
// {    
//  $window.print();
// }
$scope.proformachange = function(cur)
{
    if(cur=='All')
    {
        $scope.InvCur = angular.copy($scope.InvType);
    }
    else
    {
        $scope.InvCur=[];
        $scope.InvCur.push(cur);

    }
}

$scope.mailto =  function(ev){
    dialog.targetEvent= ev;
    dialog.templateUrl= '/app/mailto.html';
    $mdDialog.show(dialog);
}

$scope.sendmail =  function(){

    $mdDialog.hide();
    kendo.drawing.drawDOM($('.printpage'),{
    forcePageBreak: ".page-break"}).then(function(group){
    kendo.drawing.pdf.toDataURL(group, function(dataURL){
        $scope.emailform.Pdf=dataURL;
    $http({ url: 'sendproforma', method: 'POST',data:$scope.emailform}).success(function(data){
        al('Proforma Sent Successfully');
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

    // window.pako();
    
kendo.drawing.drawDOM($(selector),{
forcePageBreak: ".page-break"}).then(function(group){
// kendo.drawing.pdf.saveAs(group, "Invoice.pdf");
kendo.drawing.pdf.toDataURL(group, function(dataURL){
    $scope.url = dataURL;
// window.open(dataURL,'_blank');
});
});
}

})

.filter('trustAsResourceUrl', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsResourceUrl(val);
    };
}])
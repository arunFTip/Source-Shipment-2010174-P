<!DOCTYPE html>
<html lang="en" ng-app="dolphin" ng-cloak>
<meta http-equiv="content-type" content="text/html;charset=UTF-8" />
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Zebra - {{Auth::user()->CName}}</title>
    <link rel="icon" type="icon" href="assets/logo.png">
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,300,100,500,700,900" rel="stylesheet" type="text/css">
    <link href="assets/css/icons/icomoon/styles.css" rel="stylesheet" type="text/css">
    <link href="assets/css/bootstrap.css" rel="stylesheet" type="text/css">
    <link href="assets/css/core.css" rel="stylesheet" type="text/css">
    <link href="assets/css/components.css" rel="stylesheet" type="text/css">
    <link href="assets/css/colors.css" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="kendo/kendo.common-material.min.css" />
    <link rel="stylesheet" href="kendo/kendo.material.min.css" />
    <link rel="stylesheet" href="kendo/kendo.material.mobile.min.css" />
    <link href="assets/css/style.css" rel="stylesheet" type="text/css">
    <script type="text/javascript" src="assets/js/core/libraries/jquery.min.js"></script>
    <script type="text/javascript" src="assets/js/core/libraries/bootstrap.min.js"></script>
    <script type="text/javascript" src="assets/js/plugins/ui/nicescroll.min.js"></script>
    <script type="text/javascript" src="assets/js/plugins/ui/layout_fixed_custom.js"></script>
    <script type="text/javascript" src="assets/js/core/app.js"></script>
</head>

<body layout="column" class="navbar-top  pace-done">
<md-content>
<div class="navbar navbar-inverse bg-indigo navbar-fixed-top">
    <div class="navbar-header" style="min-width: 170px;">
    <a class="navbar-brand" href="" style="padding-left: 60px;"> <b  style="font-size: 20px;">Zebra</b></a>
        <ul class="nav navbar-nav">
            <b class=" hidden-xs" style="position:absolute;margin-top: 25px;left: 50%;font-size: 20px;margin-right: -50%;
    transform: translate(-50%, -50%)">{{Auth::user()->CName}}</b>
            <li><a class=" visible-xs-block sidebar-mobile-main-toggle"><i class="icon-paragraph-justify3"></i></a></li>
        </ul>
    </div>
    <div class="navbar-collapse collapse" id="navbar-mobile">
        <ul class="nav navbar-nav">
            <li><a class="sidebar-control sidebar-main-toggle hidden-xs"><i class="icon-paragraph-justify3"></i></a></li>
        </ul>
        <div class="navbar-right">
                <p class="navbar-text">{{Auth::user()->CName}}</p>
                
                <ul class="nav navbar-nav">             
                    <li class="dropdown">
                    <md-tooltip>Logout</md-tooltip>
                        <a href="/logout" class="dropdown-toggle legitRipple">
                            <i class="icon-switch2"></i>
                            <span class="visible-xs-inline-block position-right">Messages</span>
                        </a>
                    </li>                   
                </ul>
            </div>
    </div>
</div>
<div class="page-container">
    <div class="page-content">
@include('layout.sidebar')
        <div class="content-wrapper slideInUp">
            <div class="page-header page-header-default">
                <div class="page-header-content">
                    <div class="page-title">
                        <h4><i class="icon-arrow-left52 position-left" style="font-size: 25px;" back></i> <span class="text-semibold" ng-bind="$root.title"></span></h4>
                    </div>
                    <div class="heading-elements">
                        <div class="heading-btn-group">
                            <a href="" class="btn btn-link btn-float text-size-small has-text">
                                <md-progress-circular md-mode="indeterminate" ng-show="isLoading"></md-progress-circular>
                            </a>
                            <!-- <a href="#/new-dc" class="btn btn-link btn-float text-size-small has-text"><i class="icon-truck text-primary"></i> <span>DC</span></a> -->
                            @if(Auth::user()->Type=='Admin')
                            <a href="#/create-invoice" class="btn btn-link btn-float text-size-small has-text"><i class="icon icon-clipboard6 text-primary"></i> <span>Invoice</span></a>
                            @endif
                        </div>
                    </div>
                </div>
            </div>
            <div class="content" ng-init="Authuser={{Auth::user()}}">
                <div ng-view class="slideInUp ng-animate"></div>

                
                  <div style="position: fixed;bottom: 0;right: 50%;">
                    © 2017. Powered by <a href="http://ftipinfosol.com" target="_blank">FTip infosol</a>
                </div>  

            </div>
        </div>
    </div>




</div>



</md-content>



<link rel="stylesheet" href="material/angular-material.min.css">
<script src="material/angular.min.js"></script>
<script src="kendo/kendo.all.min.js"></script>
<script src="material/moment.min.js"></script>
<script src="material/angular-moment.min.js"></script>
<script src="material/angular-animate.min.js"></script>
<script src="material/angular-aria.min.js"></script>
<script src="material/angular-messages.min.js"></script>
<script src="material/angular-material.min.js"></script>
<script type="text/javascript" src="angular/img-crop.js"></script>
<script type='text/javascript' src="angular/angular-image-compress.js"></script>
<script type='text/javascript' src="angular/ng-table.min.js"></script>
<script type='text/javascript' src="angular/angular-route.min.js"></script> 
<script type='text/javascript' src="angular/service/app.js?v4"></script> 
<script type='text/javascript' src="angular/service/master.js?v4"></script> 
<script type='text/javascript' src="angular/service/invoice.js?v4"></script> 
<script type='text/javascript' src="angular/service/proforma.js?v4"></script> 
<script type='text/javascript' src="angular/service/payments.js?v4"></script> 

<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
</body>
</html>

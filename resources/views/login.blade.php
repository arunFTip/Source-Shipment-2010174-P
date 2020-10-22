<!DOCTYPE html>
<html lang="en">

<!-- Mirrored from demo.interface.club/limitless/layout_1/LTR/material/login_simple.html by HTTrack Website Copier/3.x [XR&CO'2014], Sat, 11 Mar 2017 08:49:34 GMT -->
<!-- Added by HTTrack --><meta http-equiv="content-type" content="text/html;charset=UTF-8" /><!-- /Added by HTTrack -->
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Zebra</title>
	 <link rel="icon" type="icon" href="assets/logo.png">

	<!-- Global stylesheets -->
	<link href="https://fonts.googleapis.com/css?family=Roboto:400,300,100,500,700,900" rel="stylesheet" type="text/css">
	<link href="assets/css/icons/icomoon/styles.css" rel="stylesheet" type="text/css">
	<link href="assets/css/bootstrap.css" rel="stylesheet" type="text/css">
	<link href="assets/css/core.css" rel="stylesheet" type="text/css">
	<link href="assets/css/components.css" rel="stylesheet" type="text/css">
	<link href="assets/css/colors.css" rel="stylesheet" type="text/css">
	<!-- /global stylesheets -->

	<!-- Core JS files -->
	<script type="text/javascript" src="assets/js/plugins/loaders/pace.min.js"></script>
	<script type="text/javascript" src="assets/js/core/libraries/jquery.min.js"></script>
	<script type="text/javascript" src="assets/js/core/libraries/bootstrap.min.js"></script>
	<script type="text/javascript" src="assets/js/plugins/loaders/blockui.min.js"></script>
	<!-- /core JS files -->


	<!-- Theme JS files -->
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
	<script type="text/javascript" src="assets/js/core/app.js"></script>
	<!-- <script type="text/javascript" src="assets/js/plugins/ui/ripple.min.js"></script> -->
	<!-- /theme JS files -->

</head>

<body ng-app="dolphin" class="login-container">

	<!-- Main navbar -->
	<div class="navbar navbar-inverse bg-indigo">
		<div class="navbar-header">
			<a class="navbar-brand" href="#"></a>

			<ul class="nav navbar-nav">
            <b  style="position:absolute;width: 237px;margin-top: 10px;left: 54%;margin-left: -90px;font-size: 20px;">Zebra</b>
				
			</ul>
		</div>

	</div>
	<!-- /main navbar -->


	<!-- Page container -->
	<div class="page-container">

		<!-- Page content -->
		<div class="page-content">

			<!-- Main content -->
			<div class="content-wrapper">

				<!-- Content area -->
				<div class="content">
					<ng-view></ng-view>


                  <div style="position:absolute;margin-top: 25px;left: 50%;margin-right: -50%;bottom:20px;
    transform: translate(-50%, -50%)">
                    © 2017. Powered by <a href="http://ftipinfosol.com" target="_blank">FTip infosol</a>
                </div>  

				</div>
				<!-- /content area -->
			</div>
			<!-- /main content -->
		</div>
		<!-- /page content -->

	</div>
	<!-- /page container -->
<script type="text/javascript">
var app =  angular.module('dolphin',['ngRoute','ngTable','ngMaterial','angularMoment','ngAnimate',"kendo.directives"])
.config(['$routeProvider',function($routeProvider) {        
    $routeProvider.when('/', {
        controller: 'ReCtr',
        templateUrl: 'register.html'
    })
    .otherwise({ redirectTo: '/' });
}])
.controller('ReCtr', function($http,$scope,$route,$window,$mdDialog){
$scope.register = function()
{	
	$http({ url: 'login', method: 'POST',data:$scope.form}).success(function(data){
		$window.location.href = '/';
    }).error(function(data,status){
     	$scope.formError=data;
	       if(status==500)
	       {
	        $window.location.href = '/';        
	       }
    });
}

$scope.forget = function(ev)
{
	$mdDialog.show(
      $mdDialog.alert()
        .clickOutsideToClose(true)
        .title('Forget Password !')
        .textContent("contact support@ftipinfosol.com or 0421-4255388")
        .ariaLabel('Forget Password !')
        .ok('Close')
        .targetEvent(ev)
    );
}
})
 </script>

<script type="text/ng-template" id="register.html">
		<form role="form" method="post" ng-submit="register()" name="login">
		{!! csrf_field() !!}
			<div class="panel panel-body login-form">
				<div class="text-center">
					<div class="icon-object border-slate-300 text-slate-300" style="padding: 15px;">
					<img src="assets/logo.png" style="width: 75px">
					</div>
					<h5 class="content-group">Login to your account <small class="display-block">Enter your credentials below</small></h5>
				</div>

				<div class="form-group has-feedback has-feedback-left">
					<input type="text" class="form-control" placeholder="Username" ng-model="form.email" name="email" >
					<div class="form-control-feedback">
						<i class="icon-user text-muted"></i>
					</div>
					<label class="validation-error-label" ng-if="formError.email" ng-bind="formError.email" name="email" required></label>
				</div>

				<div class="form-group has-feedback has-feedback-left">
					<input type="password" class="form-control" placeholder="Password" ng-model="form.password" name="password" required>
					<div class="form-control-feedback">
						<i class="icon-lock2 text-muted"></i>
					</div>
					<label class="validation-error-label" ng-if="formError.password" ng-bind="formError.password"></label>
				</div>

				<div class="form-group login-options">
					<div class="row">
						<div class="col-sm-6">
							<label class="checkbox-inline">
								<div class="checker"><span class="checked"><input type="checkbox" class="styled" checked="checked" ng-model="form.remember"></span></div>
								Remember
							</label>
						</div>

						<div class="col-sm-6 text-right">
							<a href="http://www.ftipinfosol.com/contact.php">Forgot password?</a>
						</div>
					</div>
				</div>

				<div class="form-group">
					<button type="submit" class="btn bg-pink-400 btn-block">Sign in <i class="icon-circle-right2 position-right"></i></button>
				</div>

			</div>
		</form>
</script>

</body>

</html>

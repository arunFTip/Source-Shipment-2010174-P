<?php


Route::get('/', 'Auth\AuthController@getlogin');
Route::get('login','Auth\AuthController@getlogin');

Route::post('login','Auth\AuthController@postlogin');
Route::get('/logout', function(){
	Auth::logout();
    return redirect('/');
});


Route::group(['middleware' => 'auth'],function(){
Route::resource('users','Auth\AuthController');
Route::resource('items','ItemsController');
Route::resource('hsn','HsnController');
Route::resource('customers','CustomersController');
Route::resource('settings','SettingsController');

Route::resource('invoice','InvoiceController');
Route::resource('proforma','ProformaController');

Route::resource('payment','PaymentController');
Route::resource('dc','DcController');

Route::post('invoice-st','InvoiceController@status');
Route::post('proforma-st','ProformaController@status');

Route::post('reports','PaymentController@report');
Route::get('reports','PaymentController@report');

Route::get('auditor','InvoiceController@auditor');
Route::get('proformaauditor','ProformaController@proformaauditor');

Route::get('getdc/{id}','DcController@getdc');

Route::get('dash','PaymentController@dash');

Route::group(array('prefix'=>'/appprint/'),function(){
	Route::get('{template}', array( function($template)
    {
	if(Auth::id()==1)
	{
		$template='print1.html';
	}
	else
	{
		$template='print2.html';
	}
	
        $template = str_replace(".html","",$template);
        View::addExtension('html','php');
        return View::make($template);
	}));
});

Route::group(array('prefix'=>'/app/'),function(){
    Route::get('{template}', array( function($template)
    {
        $template = str_replace(".html","",$template);
        View::addExtension('html','php');
        return View::make($template);

    }));
});

Route::post('sendinvoice','InvoiceController@sendinvoice');
Route::post('sendproforma','ProformaController@sendproforma');

Route::get('proformadetails','ProformaController@details');


});
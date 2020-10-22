var app =  angular.module('dolphin',['ngRoute','ngTable','ngMaterial','angularMoment','ngAnimate',"kendo.directives"])
.run(['$rootScope',function($rootScope) {
        $rootScope.states = [{id:0},{id:1,Name:'Andaman and Nicobar Islands',code:'35'},{id:2,Name:'Andhra Pradesh',code:'28'},{id:3,Name:'Andhra Pradesh (New)',code:'37'},{id:4,Name:'Arunachal Pradesh',code:'12'},{id:5,Name:'Assam',code:'18'},{id:6,Name:'Bihar',code:'10'},{id:7,Name:'Chandigarh',code:'04'},{id:8,Name:'Chattisgarh',code:'22'},{id:9,Name:'Dadra and Nagar Haveli',code:'26'},{id:10,Name:'Daman and Diu',code:'25'},{id:11,Name:'Delhi',code:'07'},{id:12,Name:'Goa',code:'30'},{id:13,Name:'Gujarat',code:'24'},{id:14,Name:'Haryana',code:'06'},{id:15,Name:'Himachal Pradesh',code:'02'},{id:16,Name:'Jammu and Kashmir',code:'01'},{id:17,Name:'Jharkhand',code:'20'},{id:18,Name:'Karnataka',code:'29'},{id:19,Name:'Kerala',code:'32'},{id:20,Name:'Lakshadweep Islands',code:'31'},{id:21,Name:'Madhya Pradesh',code:'23'},{id:22,Name:'Maharashtra',code:'27'},{id:23,Name:'Manipur',code:'14'},{id:24,Name:'Meghalaya',code:'17'},{id:25,Name:'Mizoram',code:'15'},{id:26,Name:'Nagaland',code:'13'},{id:27,Name:'Odisha',code:'21'},{id:28,Name:'Pondicherry',code:'34'},{id:29,Name:'Punjab',code:'03'},{id:30,Name:'Rajasthan',code:'08'},{id:31,Name:'Sikkim',code:'11'},{id:32,Name:'Tamil Nadu',code:'33'},{id:33,Name:'Telangana',code:'36'},{id:34,Name:'Tripura',code:'16'},{id:35,Name:'Uttar Pradesh',code:'09'},{id:36,Name:'Uttarakhand',code:'05'},{id:37,Name:'West Bengal',code:'19'}];
}])
.run(['$rootScope', function($rootScope) {
    $rootScope.$on("$routeChangeSuccess", function(event, currentRoute, previousRoute) {
    $rootScope.title = currentRoute.title;
    });
}])
.config(['$httpProvider', function($httpProvider,$location) {
    $httpProvider.interceptors.push(function($q) {
        return {
            'responseError': function(rejection){
                var defer = $q.defer();
                if(rejection.status == 401){
                    console.dir(rejection);
                    window.location = "/login";
                }
                defer.reject(rejection);
                return defer.promise;
            }
        };
    });
}])
.directive('stringToNumber', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(value) {
        return '' + value;
      });
      ngModel.$formatters.push(function(value) {
        return parseFloat(value);
      });
    }
  };
})
.directive('print', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
              var selector = '.pdf-page';
              kendo.drawing.drawDOM($(selector), {
                paperSize: "A4",
                multipage: true,
            }).then(function(group){
              kendo.drawing.pdf.saveAs(group, "Invoice.pdf");
              });
            });
        }
    };
}])
.directive('back', function(){
    return {
      restrict: 'A',

      link: function(scope, element, attrs) {
        element.bind('click', goBack);

        function goBack() {
          history.back();
          scope.$apply();
        }
      }
    }
})
.config(function($mdAriaProvider) {
   $mdAriaProvider.disableWarnings();
})
.config(function($mdDateLocaleProvider) {
    $mdDateLocaleProvider.formatDate = function(date) {
       return moment(date).format('DD-MM-YYYY');
    };
});

app.filter('words', function() {
  function isInteger(x) {
        return x % 1 === 0;
    }

  
  return function(value) {
    if (value && isInteger(value))
      return  toWords(value);
    
    return value;
  };

});


function toWords(inputNumber)
{  
var str = new String(inputNumber)
    var splt = str.split("");
    var rev = splt.reverse();
    var once = ['Zero', ' One', ' Two', ' Three', ' Four', ' Five', ' Six', ' Seven', ' Eight', ' Nine'];
    var twos = ['Ten', ' Eleven', ' Twelve', ' Thirteen', ' Fourteen', ' Fifteen', ' Sixteen', ' Seventeen', ' Eighteen', ' Nineteen'];
    var tens = ['', 'Ten', ' Twenty', ' Thirty', ' Forty', ' Fifty', ' Sixty', ' Seventy', ' Eighty', ' Ninety'];

    numLength = rev.length;
    var word = new Array();
    var j = 0;

    for (i = 0; i < numLength; i++) {
        switch (i) {

            case 0:
                if ((rev[i] == 0) || (rev[i + 1] == 1)) {
                    word[j] = '';
                }
                else {
                    word[j] = '' + once[rev[i]];
                }
                word[j] = word[j];
                break;

            case 1:
                aboveTens();
                break;

            case 2:
                if (rev[i] == 0) {
                    word[j] = '';
                }
                else if ((rev[i - 1] == 0) || (rev[i - 2] == 0)) {
                    word[j] = once[rev[i]] + " Hundred ";
                }
                else {
                    word[j] = once[rev[i]] + " Hundred and";
                }
                break;

            case 3:
                if (rev[i] == 0 || rev[i + 1] == 1) {
                    word[j] = '';
                }
                else {
                    word[j] = once[rev[i]];
                }
                if ((rev[i + 1] != 0) || (rev[i] > 0)) {
                    word[j] = word[j] + " Thousand";
                }
                break;

                
            case 4:
                aboveTens();
                break;

            case 5:
                if ((rev[i] == 0) || (rev[i + 1] == 1)) {
                    word[j] = '';
                }
                else {
                    word[j] = once[rev[i]];
                }
                if (rev[i + 1] !== '0' || rev[i] > '0') {
                    word[j] = word[j] + " Lakh";
                }
                 
                break;

            case 6:
                aboveTens();
                break;

            case 7:
                if ((rev[i] == 0) || (rev[i + 1] == 1)) {
                    word[j] = '';
                }
                else {
                    word[j] = once[rev[i]];
                }
                if (rev[i + 1] !== '0' || rev[i] > '0') {
                    word[j] = word[j] + " Crore";
                }                
                break;

            case 8:
                aboveTens();
                break;

            default: break;
        }
        j++;
    }

    function aboveTens() {
        if (rev[i] == 0) { word[j] = ''; }
        else if (rev[i] == 1) { word[j] = twos[rev[i - 1]]; }
        else { word[j] = tens[rev[i]]; }
    }

    word.reverse();
    var finalOutput = '';
    for (i = 0; i < numLength; i++) {
        finalOutput = finalOutput + word[i];
    }
    return finalOutput;
}

window.toWords = toWords;

angular
    .module('conisoft16.filters', [])
    .filter('paymentStatus',paymentStatus)
    .filter('kitStatus',kitStatus);

    function paymentStatus() {
      var locale = 'es';
      if (navigator.language) {
          if (navigator.language.split('-')[0] == "es" || navigator.language.split('-')[0] == "en") {
              locale = navigator.language.split('-')[0];
          }
      }
      return function(status){
        if (status == 3){
          if(locale == 'en')
            return "Without Payment"
          else
            return "Sin Pago"
        } else if( status == 1 ){
          if(locale == 'en')
            return "Paid"
          else
            return "Pagado"
        } else if( status == 2){
          if(locale == 'en')
            return "Over Payment"
          else
            return "Pagó de mas"
        }
      }
    }
    paymentStatus.$inject = [];

    function kitStatus() {
      var locale = 'es';
      if (navigator.language) {
          if (navigator.language.split('-')[0] == "es" || navigator.language.split('-')[0] == "en") {
              locale = navigator.language.split('-')[0];
          }
      }
      return function(status){
        if (status){
          if(locale == 'en')
            return "Delivered"
          else
            return "Entregado"
        } else {
          if(locale == 'en')
            return "Not Delivered"
          else
            return "No entregado"
        } 
      }
    }
    kitStatus.$inject = [];
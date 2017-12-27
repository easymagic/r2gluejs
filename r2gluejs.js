var ui = {};
(function($,win,undefined,ui){
  

  

    ui.observable = function(value){
             
      var listeners = [];          


             function notify(vl){
                listeners.forEach(function(item,k){
                	// console.log(k,item);
                	item(vl,k);
                });
             }

             function accessor(vl){
                if (arguments.length && vl != value){
                  value = vl;
                  notify(vl);
                }

                return value;
             }

             accessor.subscribe = function(cb){
              listeners.push(cb);
             };

	         accessor.get_listeners = function(){
	           return listeners;
	         };

	         accessor.garbage = function(index){
               listeners.splice(index,1);
	         };


             return accessor; 

    };

    ui.observable_array = function(arr_value){
       var listeners = [];

       function notify(arr_change){
         listeners.forEach(function(item,k){
         	item(arr_change,k);
         });
       }

       function accessor(arr_vl){


       	 if ( arguments.length && (arr_vl.length != arr_value.length) ){
	
	       var old_length = arr_value.length;
	       var new_length = arr_vl.length;

           arr_value = arr_vl;

           notify(arr_vl);

       	 }

       	 return arr_value;
   
       }

       accessor.subscribe = function(cb){
        listeners.push(cb);
       };

       accessor.get_listeners = function(){
         return listeners;
       };

       accessor.garbage = function(index){
         listeners.splice(index,1);
       };


       return accessor;
    };


    ui.bind_css = function($el,obj){

    	$.each(obj,function(k,v){
          $el.css(k,v());

          v.subscribe(function(vl,index){
          	if (ui.contains($el)){
              $el.css(k,v());
          	}else{
          	  v.garbage(índex);	
          	}
            
          });

    	});
     
    };


    ui.bind_html = function($el,obs){

    	// console.log($el,obs);
     
     var value = obs();

     $el.html(obs());

     obs.subscribe(function(vl,index){
     	if (ui.contains($el)){
          $el.html(obs());
     	}else{
          obs.garbage(index);
     	}
       
     });

    };


    ui.bind_text = function($el,obs){
    	// console.log(obs);
     
     var value = obs();

     $el.text(obs());

     obs.subscribe(function(vl,index){
      
      if (ui.contains($el)){
        $el.text(obs());
      }else{
      	obs.garbage(index);
      }  

     });

    };



    ui.bind_input = function($el,obs){
     
     var value = obs();

     $el.val(obs());

     obs.subscribe(function(vl,index){
       if (ui.contains($el)){     	
         $el.html(obs());
       }else{
       	 obs.garbage(index);
       }  
     });

     $el.on('keyup',function(){
         
         obs($(this).val());

     });

    };


    ui.bind_event = function(evt){
      
      var fn_bind = 'bind_' + evt;
      
      ui[fn_bind] = function($el,fn){
          $el.on(evt,function(){
          	fn();
          });
      };

    };


    (['click','blur','mouseout','mousein','mouseover','hover']).forEach(function(event){
         
         ui.bind_event(event);

    });

    ui.contains = function(child){
      return $.contains(document,child[0]);
    };

    ui.scan_el = function($el,cb){

    	$el.find('[data-bind]').add($el).each(function(){
	        if (ui.contains($(this))){
	        	// console.log($(this)[0]);
	            cb($(this));
	        }
    	});

    };

    ui.add_binding = function(binding,cb){
     var fn = 'bind_' + binding;
     ui[fn] = cb;
    };
 

    ui.init_binding = function(obj){
      ui.scan_data_bind($('*'),obj);
    };


    ui.scan_data_bind = function($el,obj){

    	ui.scan_el($el,function(el){
           
           if (el.data('bind')){             

		    		var data_bind = el.data('bind');
		            var fn = new Function('','return {' + data_bind + '};');
		            var json = fn();

		            $.each(json,function(k,v){

		            	var error = false;

		            	 // console.log(k,v);

		            	 var fn_ = 'bind_' + k;
		            	 if (typeof(v) == 'object'){

		            	 	 $.each(v,function(k2,v2){
		            	 	  
		            	 	  // if (typeof(obj[v2]) != 'function'){
                   //                error = true;
		            	 	  // }

		                       v[k2] = obj[v2];
		            	 	 });

		            	 	 // if (!error){
                               ui[fn_](el,v);	
		            	 	 // }

		            	 	 error = false;

		            	 	 
		            	 	 // $this.data('scanned');

		            	 }else{
		            	 	// console.log(fn_,obj[v],v);

		            	 	// if (typeof(obj[v]) != 'function'){
                 //               error = true;
		            	 	// }

		            	 	// if (!error){
                              ui[fn_](el,obj[v]);	
		            	 	// }

		            	 	error = false;

		            	 }
		            	 

		            });

           }


    	});

    	// $el.find('[data-bind^="foreach"]').each(function(){
    	// 	$(this).data('row-html',$(this).html());
    	// 	$(this).html('');
    	// });

    	// $el.find('[data-bind]').each(function(){
    		



    	// });

    };

    ui.bind_foreach = function($el,obs_array){

    	var $inner_el = $($el.html()).clone();

    	function reload(arr){
          $el.html('');

          console.log(arr);

          $.each(arr,function(k,item){
          	// console.log(item);
          	//console.log(k,item);

          	var $tmp = $inner_el.clone();

          	if (typeof(item) == 'object'){
              $.each(item,function(k,v){
                 item[k] = ui.observable(v);
              });
              $el.append($tmp);
              ui.scan_data_bind($tmp,item); 
          	}else{
              var obj = {};
              obj.$value = ui.observable(item);
               // console.log(obj);
               $el.append($tmp);
               ui.scan_data_bind($tmp,obj); 
          	}

          

          });    		
    	}

    	reload(obs_array());

    	obs_array.subscribe(function(arr){
          reload(arr);
    	});

    };



})(jQuery,window,undefined,ui);

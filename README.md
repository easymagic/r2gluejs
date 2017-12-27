# r2gluejs

MVVM Library

Dependency:
*jQuery*

Usage:
1. Include the script via script-tag
2. Create your view-model
3. init your view-model to the DOM

Example:
<!DOCTYPE html>
<html>
<head>
	<title></title>
	<script type="text/javascript" src="jquery.js"></script>
	<script type="text/javascript" src="r2gluejs.js"></script>
</head>
<body>

	<div data-bind="html: 'bg'">I am BG.</div>
	<div id="count">Counter</div>
	<input data-bind="input: 'bg',css: {backgroundColor: 'bg',fontSize: 'size'}" id="input" type="text" name="">

	<input data-bind="input: 'size',visible: 'v'" id="input" type="text" name="">


	<div data-bind="foreach: 'list'">
		<div data-bind="html: 'name'">item...</div>
        <input type="" name="" data-bind="input: 'name'">
	</div>
	<button id="click">Click</button>

</body>
<script type="text/javascript">
  
  //create your own custom ui-binding.
  
	ui.add_binding('visible',function($el,obs){
    
      function update_visibility(){
	      if (obs()){
	        $el.show();
	      }else if (!obs()){
	        $el.hide();
	      }      	
      }

      update_visibility();

      obs.subscribe(function(vl,garbage_index){
        if (ui.contains($el)){
          update_visibility(); 
        }else{
          obs.garbage(garbage_index);
        }       
      });

	});



   


	var obj = {
       v:ui.observable(true), 
       bg:ui.observable('green'),
       size:ui.observable('11px'),
       list:ui.observable_array([{name:'akl',age:22},{name:'akl2',age:23},{name:'nms',age:24}])

	};
	

	(function($){

       ui.init_binding(obj);  

	})(jQuery);
</script>
</html>

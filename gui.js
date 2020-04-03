$(function() {

	var versionNr = '2.3.2' //for official release versionNr is ''

	/*
	number of fieldsets
	*/
	var fieldsetCount = $('#formElem').children().length;
	
	/*
	current position of fieldset / navigation link
	*/
	var current 	= 1;
    
	/*
	sum and save the widths of each one of the fieldsets
	set the final sum as the total width of the steps element
	*/
	var stepsWidth	= 0;
	var singleStepWidth = $('#wrapper').width();
	var stepsHeight = $('#wrapper').height();
	var widths 		= new Array();
	
	function setStepSizes(){
		//change by GCA
		stepsWidth	= 0;
		widths 		= new Array();
		$('#steps .step').each(function(i){
			var $step 		= $(this);
			$step.width(singleStepWidth);
			$step.height(stepsHeight);
			widths[i]  		= stepsWidth;
			stepsWidth	 	+= singleStepWidth;
		});
		$('#steps').width(stepsWidth);
	}	
	/*
	to avoid problems in IE, focus the first input of the form
	*/
	$('#formElem').children(':first').find(':input:first').focus();

	/*
	Arrow functions
	*/
	$('#backward').hide(); //start with backward hidden
	$('#backward').bind('click',function(e){
		$('#nav'+(current-1)).trigger('click');
	});
	$('#forward').bind('click',function(e){
		$('#nav'+(current+1)).trigger('click');
	});
	/*
	show the navigation bar
	*/
	$('#navigation').show();

	/*
	when clicking on a navigation link 
	the form slides to the corresponding fieldset
	*/
    $('#nav2, #nav3, #nav4, #nav5').bind('click',function(e){
		
		if(current==1){
			//check E-MAIL & country
			if($('#email').val() == "" || $('#country :selected').val() == 'blank'){

				validateStep(current);

				warningMsg(strings.warningTitle, strings.warningMsg);

				return;
				
			}
		}
		var $this	= $(this);
		var prev	= current;
		$this.closest('ul').find('li').removeClass('selected');
		$this.parent().addClass('selected');
	
		/*
		we store the position of the link
		in the current variable	
		*/
		current = $this.parent().index() + 1;

		//step progress indication
		for(var i = 1; i < fieldsetCount; ++i){
			if(i<current)
				$('#navlist').children(':nth-child('+ i +')').addClass('prev');
			else
				$('#navlist').children(':nth-child('+ i +')').removeClass('prev');
		}

		/*
		animate / slide to the next or to the corresponding
		fieldset. The order of the links in the navigation
		is the order of the fieldsets.
		Also, after sliding, we trigger the focus on the first 
		input element of the new fieldset
		If we clicked on the last link (confirmation), then we validate
		all the fieldsets, otherwise we validate the previous one
		before the form slided
		*/
        $('#steps').stop().animate({marginLeft:'-'+widths[current-1]+'px'},500,function(){
			// if(current == fieldsetCount)
			// 	validateSteps();
			// else
			// 	validateStep(prev);


			//validate all previous steps in order
			var prevAux = prev;
			while(prevAux<current){
				validateStep(prevAux);
				prevAux++;
			}
	
			$('#formElem').children(':nth-child('+ parseInt(current) +')').find(':input:first').focus();
			
			// hide/show content after animation
			switch(current){
				case 1:
					$('#backward').hide();
					break;
				case 3:
					//Project design
					$('#designContainer').show();
					$('#toolsWrapper').show();
					//setup variable to check if there were changes to the design
					designHasChanged = false;
					break;
				case 4:
					//Project Configuration
					$('#configContainer').show();
					$('#tableWrap').show();					
					//setup config only if there were changes in the design
					if(designHasChanged){
						loadConfigMap();
						createChannelTable();
						designHasChanged = false;
					}
					break;
				case 5:
					if(designHasChanged){
						loadConfigMap();
						createChannelTable();
						designHasChanged = false;
					}
					createPath();
					//show export container
					$('#exportContainer').show();
					$('#overviewContainer').show();
					$('#submitPanel').show();
					$('#forward').hide();
					break;
			}			
		});

		//hide/show content before animation
		switch(current){
			case 1: //Project Definition
				//nav buttons
				$('#forward').show();
				//hide design container
				$('#designContainer').hide();
				$('#toolsWrapper').hide();
				//hide config container
				$('#configContainer').hide();
				$('#tableWrap').hide();
				//hide export container
				$('#exportContainer').hide();
				$('#overviewContainer').hide();
				$('#submitPanel').hide();
				break;
			case 2: //Line Definition
				//nav buttons
				$('#backward').show();
				$('#forward').show();
				//hide design container
				$('#designContainer').hide();
				$('#toolsWrapper').hide();
				//hide config container
				$('#configContainer').hide();
				$('#tableWrap').hide();
				//hide export container
				$('#exportContainer').hide();
				$('#overviewContainer').hide();
				$('#submitPanel').hide();				
				break;
			case 3: //Line Design
				//nav buttons
				$('#backward').show();
				$('#forward').show();
				//hide config container
				$('#configContainer').hide();
				$('#tableWrap').hide();				
				//hide export container
				$('#exportContainer').hide();
				$('#overviewContainer').hide();
				$('#submitPanel').hide();				
				break;
			case 4: //Line Configuration
				//nav buttons
				$('#backward').show();
				$('#forward').show();
				//hide design container
				$('#designContainer').hide();
				$('#toolsWrapper').hide();
				//hide export container
				$('#exportContainer').hide();
				$('#overviewContainer').hide();
				$('#submitPanel').hide();
				break;
			case 5: //Export Data
				//nav buttons
				$('#backward').show();
				//hide design container
				$('#designContainer').hide();
				$('#toolsWrapper').hide();
				//hide config container
				$('#configContainer').hide();
				$('#tableWrap').hide();				
				break;
			default:
				break
		}
		e.preventDefault();
	});
	

	$('#nav1').bind('click',function(e){
		
		if(current==1){
			//check E-MAIL & country
			if($('#email').val() == "" || $('#country :selected').val() == 'blank'){

				validateStep(current);

				return;
				
			}
		}
		var $this	= $(this);
		var prev	= current;
		$this.closest('ul').find('li').removeClass('selected');
		$this.parent().addClass('selected');
	
		/*
		we store the position of the link
		in the current variable	
		*/
		current = $this.parent().index() + 1;

		//step progress indication
		for(var i = 1; i < fieldsetCount; ++i){
			if(i<current)
				$('#navlist').children(':nth-child('+ i +')').addClass('prev');
			else
				$('#navlist').children(':nth-child('+ i +')').removeClass('prev');
		}

		/*
		animate / slide to the next or to the corresponding
		fieldset. The order of the links in the navigation
		is the order of the fieldsets.
		Also, after sliding, we trigger the focus on the first 
		input element of the new fieldset
		If we clicked on the last link (confirmation), then we validate
		all the fieldsets, otherwise we validate the previous one
		before the form slided
		*/
        $('#steps').stop().animate({marginLeft:'-'+widths[current-1]+'px'},500,function(){
			// if(current == fieldsetCount)
			// 	validateSteps();
			// else
			// 	validateStep(prev);


			//validate all previous steps in order
			var prevAux = prev;
			while(prevAux<current){
				validateStep(prevAux);
				prevAux++;
			}
	
			$('#formElem').children(':nth-child('+ parseInt(current) +')').find(':input:first').focus();
			
			// hide/show content after animation
			switch(current){
				case 1:
					$('#backward').hide();
					break;
				case 3:
					//Line design
					$('#designContainer').show();
					$('#toolsWrapper').show();
					//setup variable to check if there were changes to the design
					designHasChanged = false;
					break;
				case 4:
					//Line Configuration
					$('#configContainer').show();
					$('#tableWrap').show();					
					//setup config only if there were changes in the design
					if(designHasChanged){
						loadConfigMap();
						createChannelTable();
						designHasChanged = false;
					}
					break;
				case 5:
					if(designHasChanged){
						loadConfigMap();
						createChannelTable();
						designHasChanged = false;
					}
					createPath();
					//show export container
					$('#exportContainer').show();
					$('#overviewContainer').show();
					$('#submitPanel').show();
					$('#forward').hide();
					break;
			}			
		});

		//hide/show content before animation
		switch(current){
			case 1: //Project Definition
				//nav buttons
				$('#forward').show();
				//hide design container
				$('#designContainer').hide();
				$('#toolsWrapper').hide();
				//hide config container
				$('#configContainer').hide();
				$('#tableWrap').hide();
				//hide export container
				$('#exportContainer').hide();
				$('#overviewContainer').hide();
				$('#submitPanel').hide();
				break;
			case 2: //Line Definition
				//nav buttons
				$('#backward').show();
				$('#forward').show();
				//hide design container
				$('#designContainer').hide();
				$('#toolsWrapper').hide();
				//hide config container
				$('#configContainer').hide();
				$('#tableWrap').hide();
				//hide export container
				$('#exportContainer').hide();
				$('#overviewContainer').hide();
				$('#submitPanel').hide();				
				break;
			case 3: //Line Design
				//nav buttons
				$('#backward').show();
				$('#forward').show();
				//hide config container
				$('#configContainer').hide();
				$('#tableWrap').hide();				
				//hide export container
				$('#exportContainer').hide();
				$('#overviewContainer').hide();
				$('#submitPanel').hide();				
				break;
			case 4: //Line Configuration
				//nav buttons
				$('#backward').show();
				$('#forward').show();
				//hide design container
				$('#designContainer').hide();
				$('#toolsWrapper').hide();
				//hide export container
				$('#exportContainer').hide();
				$('#overviewContainer').hide();
				$('#submitPanel').hide();
				break;
			case 5: //Export Data
				//nav buttons
				$('#backward').show();
				//hide design container
				$('#designContainer').hide();
				$('#toolsWrapper').hide();
				//hide config container
				$('#configContainer').hide();
				$('#tableWrap').hide();				
				break;
			default:
				break
		}
		e.preventDefault();
    });
	/*
	clicking on the tab (on the last input of each fieldset), makes the form
	slide to the next step
	*/
	$('#country').keydown(function(e){ //only do it for last element of first fieldset
		if (e.which == 9){
			$('#navigation li:nth-child(' + 2 + ') a').click();
			/* force the blur for validation */
			$(this).blur();
			e.preventDefault();
		}		
	});	
	// $('#formElem > fieldset').each(function(){
	// 	var $fieldset = $(this);
	// 	$fieldset.children().keydown(function(e){
	// 		if (e.which == 9 && e.target.id == "country"){
	// 			$('#navigation li:nth-child(' + (parseInt(current)+1) + ') a').click();
	// 			/* force the blur for validation */
	// 			$(this).blur();
	// 			e.preventDefault();
	// 		}
	// 	});
	// });	
	/*
	validates errors on all the fieldsets
	records if the Form has errors in $('#formElem').data()
	*/
	function validateSteps(){
		var FormErrors = false;
		for(var i = 1; i < fieldsetCount; ++i){
			var error = validateStep(i);
			if(error == -1)
				FormErrors = true;
		}
		$('#formElem').data('errors',FormErrors);
	}	
	/*
	validates one fieldset
	and returns -1 if errors found, or 1 if not
	*/
	function validateStep(step){
		if(step == fieldsetCount) return;
		
		var error = 1;
		var hasError = false;
		$('#formElem').children(':nth-child('+ parseInt(step) +')').find(':input:not(button)').each(function(){
			var $this 		= $(this);
			var valueLength = jQuery.trim($this.val()).length;
			
			if(valueLength == ''){
				hasError = true;
				$this.css('background-color','#FFEDEF');
			}
			else if(!$this.is(':disabled'))
				$this.css('background-color','#FFFFFF');	
		});
		var $link = $('#navigation li:nth-child(' + parseInt(step) + ') a');
		$link.parent().find('.error,.checked').remove();
		
		var valclass = 'checked';
		if(hasError){
			error = -1;
			valclass = 'error';
		}
		// TODO: Check if needed to use icon - if so, check icon
		// $('<span class="'+valclass+'"></span>').insertAfter($link);
		
		//exectute functions after leaving the step
		switch(step){
			case 1:
				// Load project definition data
				loadProjectDefData();
				break;
			case 2:
				/* Load line configuration characteristics */
				loadLineCharacteristics();
				break;
			case 3:
				break;
			case 4:
				break;
			case 5:
				break;
		}


		return error;
	}	
	/*
	if there are errors don't allow the user to submit
	*/
	// $('#registerButton').bind('click',function(){
	// 	if($('#formElem').data('errors')){
	// 		alert('Please correct the errors in the Form');
	// 		return false;
	// 	}	
	// });

	/*GUI Functions*/
	$( document ).ready(function() {
		//load translations
		var urlParams = new URLSearchParams(window.location.search);
		if(urlParams.get('lang') != null){
			console.log(urlParams.get('lang'));
			locale = urlParams.get('lang');
		}
		$("#langSel").val(locale);
		getTranslationFile();
		// applyTranslations();

		setStepSizes();
		//set date
		var currentDate = new Date();
		$('#date').val(currentDate.toLocaleString('en-GB'));
		//set up maps
		setUpDesignMap();
		setUpConfigMap();
		//get luminaires codes data
		getCodesData();
	});
	function getTranslationFile(){
		(function() {
			var url = 'res/lang/'+locale+'.json';
			$.ajax({
				'global': false,
				'url': url,
				'dataType': "json",
				'success': function (data) {
					strings = data;
					applyTranslations();
					
					//needs to create/replicate the table so the translations can occur in line confi table headers.

					createChannelTable();

				}
			});
			// return str;
		})();
	}
	function applyTranslations(){
		/*Title*/
		// $('#titleBar').html(strings.title+' '+version);
		// $('#contentTitle').html(strings.title+' '+version);
		$('#titleBar').html(strings.title+' '+versionNr); //release without version
		$('#contentTitle').html(strings.title+' '+versionNr); //release without version
		
		/*Project Definition*/
		$('#stepTitle_0').html(strings.projDef);
		$('#nav1').html(strings.projDef);
		$('#stepDesc_0').html(strings.projDef_desc);
		$('#projLabel').html(strings.project);
		$('#pname_lbl').html(strings.name);
		$('#proom_lbl').html(strings.room);
		$('#proom').attr("placeholder", strings.roomEG);
		$('#paddr_lbl').html(strings.address);
		$('#date_lbl').html(strings.date);
		$('#contactLabel').html(strings.contact);
		$('#cname_lbl').html(strings.name);
		$('#caddr_lbl').html(strings.address);
		$('#country_lbl').html(strings.country);
		$('#country_op0').html(strings.country_be);
		$('#country_op1').html(strings.country_lu);
		$('#country_op2').html(strings.country_fr);
		$('#country_op3').html(strings.country_de);
		$('#country_op4').html(strings.country_nl);
		$('#country_op5').html(strings.country_pt);
		$('#country_op6').html(strings.country_es);
		$('#country_op7').html(strings.country_se);
		$('#country_op8').html(strings.other);
		$('#phone_lbl').html(strings.phone);
		$('#phone').attr("placeholder", strings.phoneEG);
		$('#email_lbl').html(strings.mail);
		$('#email').attr("placeholder", strings.mailEG);
		
		/*Line Definition*/
		$('#stepTitle_1').html(strings.lineDef);
		$('#nav2').html(strings.lineDef);
		$('#stepDesc_1').html(strings.lineDef_desc);
		$('#installation_lbl').html(strings.installation);
		$('#installation_op0').html(strings.ceiling);
		$('#installation_op1').html(strings.wall);
		$('#installation_op2').html(strings.suspended);
		$('#susLength_lbl').html(strings.susType + ': ');
		$('#susLen_op0').html(strings.other);
		$('#susLen_op5').html(strings.other);
		$('#susLength_gr0').attr("label", strings.powerSupplyBox);
		$('#susLength_gr1').attr("label", strings.minimalistic);
		$('#color_lbl').html(strings.color);
		$('#color_op0').html(strings.color_op0);
		$('#color_op1').html(strings.color_op1);
		$('#color_op2').html(strings.color_op2);
		$('#color_op3').html(strings.other);
		$('#otherColorLabel2').html(strings.colorRemark);
		$('#ledcolor_lbl').html(strings.ledColor);
		$('#optics_lbl').html(strings.optics);
		$('#optics_gr0').attr("label", strings.diffuser);
		$('#optics_gr1').attr("label", strings.shielded);
		$('#optics_op0').html(strings.opalDiffuser);
		$('#optics_op2').html(strings.whiteShielding);
		$('#optics_op3').html(strings.blackShielding);
		$('#lightOutputLabel').html(strings.lightOutput+': ');
		$('#lightOutput_op0').html(strings.medium);
		$('#lightOutput_op1').html(strings.low);
		$('#beamLabel').html(strings.lightDistribution);
		$('#beam_op0').html(strings.medBeam);
		$('#beam_op1').html(strings.vWideBeam);
		
		//$('#susLength_gr0').html(strings.powerSupplyBox);
		

		/*Line Design*/
		$('#stepTitle_2').html(strings.lineDsgn);
		$('#nav3').html(strings.lineDsgn);
		$('#stepDesc_2').html(strings.lineDsgn_desc_diffusor);
		document.getElementById("optics").addEventListener("change", function(){
		if(getOptics().cod == "D")
		{
			$('#stepDesc_2').html(strings.lineDsgn_desc_diffusor);
		}
		else
		{
			$('#stepDesc_2').html(strings.lineDsgn_desc_shield);
		}
		}, false);

		/*Line Configuration*/
		$('#stepTitle_3').html(strings.lineConf);
		$('#nav4').html(strings.lineConf);
		$('#stepDesc_3').html(strings.lineConf_desc);

		/*Project Summary*/
		$('#stepTitle_4').html(strings.projSumm);
		$('#nav5').html(strings.projSumm);
		$('#stepDesc_4').html(strings.projSumm_desc);

		$('#pOverview_title').html(strings.projOverview);
		$('#addInfo').html(strings.addInfo);	
		$('#additionalnfo').attr("placeholder", strings.addInfoPH+'.');		
		$('#leyTitle').html(strings.ley);
		$('#components_title').html(strings.components);
		$('#tenderTitle').html(strings.tenderTitle);
		$('#printPopup').html(strings.printPopup);
		$('#submitPopup').html(strings.submitPopup);
		$('#orderPopup').html(strings.orderPopup);
		$('#autocadPopup').html(strings.autocadPopup);
		$('#installationPopup').html(strings.installationPopup);

		

		if(current == 5){
			//EXPORT DATA - RELOAD
			loadOverviewData();
    		genOverviewTable(modules); 
		}
	}
	$('#langSel').change(function() {
		locale = $('#langSel :selected').val();
		getTranslationFile();
		// applyTranslations();
	});


	$( window ).resize(function() {
		singleStepWidth = $('#wrapper').width();
		stepsHeight = $('#wrapper').height();
		setStepSizes();
		$('#nav'+current).trigger('click');

		// setUpDesignMap();
		// setUpConfigMap();
		// reCalculateDesign();

		/*Set up table*/
		var wrapheight = $('#tableWrap').height();
		$('#tableContainer_inner').height(wrapheight-10);
	});

	//Types of installation selected (2 = suspended, 1 = wall, 0 = ceiling)
	// need to remove function cleanDesign
	var prevInstallation = 2;
    $("#installation").focus(function () {
        // Store the current value on focus, before it changes
		prevInstallation = this.value;
	}).change(function() {
		switch( $('#installation').val()){
			case '0': //ceiling
				if(hasDrawing()) //if has drawing ask to delete it
					confirmChangeInstall(strings.dsgnDel_title, strings.dsgnDel_text, strings.yes, strings.cancel, prevInstallation);

				//not suspended - hide suspension length select
				$('#susLength_lbl').hide();
				$('#susLength').hide();
				$('#otherSusLen').hide();
				$('#otherSusLenLabel2').hide();
				//can select shielded
				$('#optics_op2').prop('disabled',false);
				$('#optics_op3').prop('disabled',false);
				break;
			case '1': //wall
				if(hasDrawing()) //if has drawing ask to delete it
					confirmChangeInstall(strings.dsgnDel_title, strings.dsgnDel_text, strings.yes, strings.cancel, prevInstallation);

				//not suspended - hide suspension length select
				$('#susLength_lbl').hide();
				$('#susLength').hide();
				$('#otherSusLen').hide();
				$('#otherSusLenLabel2').hide();
				//cannot select shielded
				$('#optics_op2').prop('disabled',true);
				$('#optics_op3').prop('disabled',true);
				break;
			case '2': //suspended
				if(hasDrawing()) //if has drawing ask to delete it
					confirmChangeInstall(strings.dsgnDel_title, strings.dsgnDel_text, strings.yes, strings.cancel, prevInstallation);

				//suspended - show suspension length select
				$('#susLength_lbl').show();
				$('#susLength').show();
				if($('#susLength :selected').val() == 0 || $('#susLength :selected').val() == 5){
					$('#otherSusLen').show();
					$('#otherSusLenLabel2').show();	
				}
				//can select shielded
				$('#optics_op2').prop('disabled',false);
				$('#optics_op3').prop('disabled',false);
				break;

		}
	});

	$('#susLength').change(function() {
		if($('#susLength :selected').val() == 0 || $('#susLength :selected').val() == 5){
			//show other suspension length input and label
			$('#otherSusLen').show();
			$('#otherSusLenLabel2').show();
		}
		else{
			//hide other suspension length input and label
			$('#otherSusLen').hide();
			$('#otherSusLenLabel2').hide();
		}	
	});
	$('#color').change(function() {
		if($('#color :selected').val() == 3){
			//show other color input
			$('#otherColorLabel').show();
			$('#otherColorLabel2').show();
			$('#otherColor').show();
		}
		else{
			//hide other color input
			$('#otherColorLabel').hide();
			$('#otherColorLabel2').hide();
			$('#otherColor').hide();
		}	
	});
	var prevOptics = 0;
	$('#optics').focus(function () {
		// Store the current value on focus, before it changes
		prevOptics = this.value;
	}).change(function() {
		var sel = $('#optics :selected').val();

		switch(sel){
			case '0': //diffuser
			// case 1:
				if(prevOptics == 2 || prevOptics == 3){ //if has drawing ask to delete it
					if(hasDrawing()){
						//clean and change the map type
						confirmChangeOptics(strings.dsgnDel_title, strings.dsgnDel_text, strings.yes, strings.cancel, prevOptics);						
					}
					else{
						//change only the map type
						//difuser
						opticsMode = 1;
						// minSquares = 3; //old
						minSquares = 4;
						gridSize = 30;
						gridSizeInMM = 280;
						minLenght = gridSize*minSquares;
						//setup new draw space
						cleanDesign();
						setUpDesignMap();
					}					
				}
				//gui handlers
				$('#lightOutputLabel').show();
				$('#lightOutput').show();
				$('#beamLabel').hide();
				$('#beam').hide();
				//can select wall mounted
				$('#installation_op1').prop('disabled',false);
				break;
			case '2': //white shielded
			case '3': //black shielded
				if((prevOptics == 0 || prevOptics == 1)){ //if has drawing ask to delete it
					if(hasDrawing()){
						//clean and change the map type
						confirmChangeOptics(strings.dsgnDel_title, strings.dsgnDel_text, strings.yes, strings.cancel, prevOptics);
					}
					else{
						//change only the map type
						//shielded
						opticsMode = 2;
						// minSquares = 2; //old
						minSquares = 3;
						gridSize = 40;
						gridSizeInMM = 456;
						minLenght = gridSize*minSquares;
						//setup new draw space
						cleanDesign();
						setUpDesignMap();
					}
				}
				//gui handlers
				$('#lightOutputLabel').hide();
				$('#lightOutput').hide();
				$('#beamLabel').show();
				$('#beam').show();
				//cannot select wall mounted
				$('#installation_op1').prop('disabled',true);	
				break;
		}
	});

	//// Line Design - GUI
	$('input:radio[name=mouseToggle]').change(function() {
		mouseMode = this.value;
		if (mouseMode == 0) { //draw
			//change cursor to crosshair
			$('#designContainer').css( 'cursor', 'crosshair' );			
			//remove segment selections
			if(selSegment !== null){
				selSegment = null;
				reCalculateDesign();			
				$('#delButton').addClass('btn_disabled');
			}			
		}
		else if (mouseMode == 1) {//select
			//change cursor to pointer
			$('#designContainer').css( 'cursor', 'default' );
		}
	});
	$('#undoButton').click(function(){
		if(!$(this).hasClass("btn_disabled")){
			var segGrp = drawLayer.find('.segments')[0];
			if(segGrp.children.length){
				segGrp.children.pop();
				reCalculateDesign();
				drawLayer.draw();
				segGrp = drawLayer.find('.segments')[0];
				if(segGrp.children.length==0){
					//disable button
					$(this).addClass('btn_disabled');
					$('#calcButton').addClass('btn_disabled');
				}
			}
		}
	});
	$('#calcButton').click(function(){
		reCalculateDesign();
		//disable button
		$(this).addClass('btn_disabled');
	});
	$('#delButton').click(function(){
		//delete segment
		if(selSegment != null){
			var aux = getDesignSegByID(selSegment);
			if(aux !== -1){
				if(canDelete(aux)){
					segGrp.children.splice(aux, 1);
					reCalculateDesign();
					// $('#delButton').addClass('btn_disabled');
					selSegment = null;
				}
			}
		}
		else{
			//show confirmation box
			confirmDel(strings.dsgnDel_title, strings.dsgnDel_text, strings.yes, strings.cancel,);
		}
	});
	$('#zoomFitButton').click(function(){
		//delete segment
		// if(selSegment != null){
		// 	var aux = getDesignSegByID(selSegment);
		// 	if(aux !== -1){
		// 		segGrp.children.splice(aux, 1);
		// 		reCalculateDesign();
		// 		$('#zoomFitButton').addClass('btn_disabled');
		// 	}
		// }
		zoomFit(designStage);
		zoomVars_design.origin = designStage.position();
		designStage.draw();
	});
	$(document).keyup(function(e){
		if (e.key === "Delete") {
			//delete segment
			if(selSegment != null){
				var aux = getDesignSegByID(selSegment);
				if(aux !== -1){
					segGrp.children.splice(aux, 1);
					reCalculateDesign();
					// $('#delButton').addClass('btn_disabled');
					selSegment = null;
				}
			}
		}
	});



	function gdprConfirm(title, msg, $true, $false) { /*change*/
		var $content =  "<div class='dialog-ovelay'>" +
						"<div class='dialog'><header>" +
							" <h3> " + title + " </h3> "+
						"</header>" +
						"<div class='dialog-msg'>" +
							" <p> " + msg + " </p> " +
						"</div>" +
						"<footer>" +
							"<div class='controls'>" +
								" <button class='button button-default cancelAction'>" + $false + "</button> " +
								" <button class='button button-danger doAction'>" + $true + "</button> " +							
							"</div>" +
						"</footer>" +
					"</div>" +
				"</div>";
		$('body').prepend($content);
		$('.doAction').click(function () {
			console.log('submited! try to send mail...');
			sendMail();
			$(this).parents('.dialog-ovelay').fadeOut(500, function () {
				$(this).remove();
			});
		});
		$('.cancelAction').click(function () {
			$(this).parents('.dialog-ovelay').fadeOut(500, function () {
				$(this).remove();
			});
		});
	}

	$('#additionalnfo').blur(function() {
		//load text area content to projectDef, when the input loses focus
		projectDef.extra = $(this).val();
	});

	async function sendMail(){
		var auxpdf = await genProjectSummary();
		pdf = btoa(auxpdf.output()); 

		$.ajax({
			url: 'php/ley.php',
			data: {
				action:"sendMail", 
				// toMail:getToMail(projectDef.contact.country),
				// ccMail:projectDef.contact.email,
				toMail:projectDef.contact.email,
				subject:strings.mail_subject,
				body:strings.mail_body,
				attachMail:pdf
			},
			type: 'post',
			cache: false,
			dataType: 'json',
			success: function (data)
			{
				console.log(data);
			}
		});
	}
	/* SUBMIT PANEL */
	//print
	$('#printButton').click(async function(){
		pdf = await genProjectSummary();
		pdf.save('Ley-'+projectDef.project.name+'-'+projectDef.project.room+'-Datasheet.pdf')

	});


	//mail
	$('#submitButton').click(function(){

		gdprConfirm(strings.gdpr_title,strings.gdpr_text,strings.yes,strings.cancel);

	});

	$('#installButton').click(function(){
		var pdf = genInstallationSummary();

		pdf.save('Ley-'+projectDef.project.name+'-'+projectDef.project.room+'-Installation.pdf')
	});
	
	
	document.getElementById("cadButton").addEventListener("click", function(){
		// Generate download of 'Ley'----- '-2D-model.scr'  file with some content
		
		var auxNameProject = projectDef.project.name;
		var auxFinalName = auxNameProject.replace(/[ ,]+/g, "_");
		var auxLineNumberProject = projectDef.project.room;
		var auxFinalLineNumber = auxLineNumberProject.replace(/[ ,]+/g, "_");



		var	filename = 'Ley-'+ auxFinalName +'-'+ auxFinalLineNumber +'-2D-model.scr';

		var text = "PICKFIRST 1" + "\r\n" + "OSNAPCOORD 1" + "\r\n" + "-BEDIT " + checkIfProjectName() + "\r\n" + "-STYLE Attributes" + "\r\n" + "txt.shx" + "\r\n" + "180" + "\r\n" +
		"1" + "\r\n" + "0" + "\r\n" + "No" + "\r\n" + "No" + "\r\n" + "No" + "\r\n" + "-ATTDEF p" + "\r\n" +  "\r\n" + "SYMBOOL" + "\r\n" + "\r\n" + checkIfProjectName() + "\r\n" + 
		"S Attributes" + "\r\n" +  StartPoint() + "\r\n" +  RotationAngleFirstSegment(modules[0]) + "\r\n" + "-ATTDEF p" + "\r\n" + "\r\n" + "INFO" + "\r\n" + "\r\n" + "\r\n" + "S Attributes" + "\r\n" + 
		LastPoint() + "\r\n" + RotationAngleFirstSegment(modules[0]) + "\r\n" +  EveryAutoCadSegment() + "MOVE ALL" + "\r\n" + "\r\n" +"d" + "\r\n" + MoveAll() + "\r\n" + "BSAVE" + "\r\n" + "BCLOSE" +
		"\r\n" + "-INSERT " + checkIfProjectName() +"\r\n";
		download(filename, text);
	}, false);




	function download(filename, text) {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', filename);

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);
	}

	//check if the project has name, if not print "Ley"
	function checkIfProjectName()
	{
		if(projectDef.project.room == "")
		{
			return "Ley";
		}
		else
		{
			var auxLineNumberProject = projectDef.project.room;
			var auxFinalLineNumber = auxLineNumberProject.replace(/[ ,]+/g, "_");
			return auxFinalLineNumber;
		}
	}

	//warning msg about the change of the type of installation
	function confirmChangeInstall(title, msg, $true, $false, previous) { /*change*/
		var $content =  "<div class='dialog-ovelay'>" +
						"<div class='dialog'><header>" +
							" <h3> " + title + " </h3> "+
						"</header>" +
						"<div class='dialog-msg'>" +
							" <p> " + msg + " </p> " +
						"</div>" +
						"<footer>" +
	
						"<div class='controls'>" +
								" <button class='button button-default cancelAction'>" + $false + "</button> " +
								" <button class='button button-danger doAction'>" + $true + "</button> " +							
							"</div>" +
						"</footer>" +
					"</div>" +
				"</div>";
		$('body').prepend($content);
		$('.cancelAction').click(function () {
			//go to previous installation
			$("#installation").val(previous);
			//handle gui
			switch( $('#installation').val()){
				case '0': //ceiling
					//not suspended - hide suspension length select
					$('#susLength_lbl').hide();
					$('#susLength').hide();
					$('#otherSusLen').hide();
					$('#otherSusLenLabel2').hide();
					//can select shielded
					$('#optics_op2').prop('disabled',false);
					$('#optics_op3').prop('disabled',false);
					break;
				case '1': //wall
					//not suspended - hide suspension length select
					$('#susLength_lbl').hide();
					$('#susLength').hide();
					$('#otherSusLen').hide();
					$('#otherSusLenLabel2').hide();
					//cannot select shielded
					$('#optics_op2').prop('disabled',true);
					$('#optics_op3').prop('disabled',true);
					break;
				case '2': //suspended
					//suspended - show suspension length select
					$('#susLength_lbl').show();
					$('#susLength').show();
					if($('#susLength :selected').val() == 0 || $('#susLength :selected').val() == 5){
						$('#otherSusLen').show();
						$('#otherSusLenLabel2').show();	
					}
					//can select shielded
					$('#optics_op2').prop('disabled',false);
					$('#optics_op3').prop('disabled',false);
					break;	
			}
			$(this).parents('.dialog-ovelay').fadeOut(500, function () {				
				$(this).remove();				
			});
		});
		$('.doAction').click(function () {
			//delete drawing
			cleanDesign();
			reCalculateDesign();
			setUpDesignMap();
			$(this).parents('.dialog-ovelay').fadeOut(500, function () {
				$(this).remove();		
			});
		});	
	}
	//warning msg about the change of the type of optics
	function confirmChangeOptics(title, msg, $true, $false, previous) { /*change*/
		var $content =  "<div class='dialog-ovelay'>" +
						"<div class='dialog'><header>" +
							" <h3> " + title + " </h3> "+
						"</header>" +
						"<div class='dialog-msg'>" +
							" <p> " + msg + " </p> " +
						"</div>" +
						"<footer>" +
	
						"<div class='controls'>" +
								" <button class='button button-default cancelAction'>" + $false + "</button> " +
								" <button class='button button-danger doAction'>" + $true + "</button> " +							
							"</div>" +
						"</footer>" +
					"</div>" +
				"</div>";
		$('body').prepend($content);
		$('.cancelAction').click(function () {
			//go to previous installation
			$("#optics").val(previous);
			//handle gui
			switch( $('#optics').val()){
				case '0': //diffuser
					//gui handlers
					$('#lightOutputLabel').show();
					$('#lightOutput').show();
					$('#beamLabel').hide();
					$('#beam').hide();
					//can select wall mounted
					$('#installation_op1').prop('disabled',false);
					break;
				case '2': //white shielded
				case '3': //black shielded
					//gui handlers
					$('#lightOutputLabel').hide();
					$('#lightOutput').hide();
					$('#beamLabel').show();
					$('#beam').show();
					//cannot select wall mounted
					$('#installation_op1').prop('disabled',true);	
					break;	
			}
			$(this).parents('.dialog-ovelay').fadeOut(500, function () {				
				$(this).remove();				
			});
		});
		$('.doAction').click(function () {
			switch( $('#optics').val()){
				case '0': //diffuser
					opticsMode = 1;
					// minSquares = 3; //old
					minSquares = 4;
					gridSize = 30;
					gridSizeInMM = 280;
					minLenght = gridSize*minSquares;
					break;
				case '2': //white shielded
				case '3': //black shielded
					opticsMode = 2;
					// minSquares = 2; //old
					minSquares = 3;
					gridSize = 40;
					gridSizeInMM = 456;
					minLenght = gridSize*minSquares;
					break;	
			}
			//delete drawing
			cleanDesign();
			reCalculateDesign();
			setUpDesignMap();

			$(this).parents('.dialog-ovelay').fadeOut(500, function () {
				$(this).remove();		
			});
		});	
	}


});
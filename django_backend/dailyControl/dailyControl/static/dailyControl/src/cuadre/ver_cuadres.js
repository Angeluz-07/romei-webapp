		/*-------------------------------INITIAL LOAD AND HANDLERS---------------------------*/
			  	
		$( "#datepicker" ).datepicker({
				dateFormat:'yy-mm-dd',
		    changeMonth: true,
		    changeYear: true,
				maxDate:0,
		  });
			$( "#datepicker" ).datepicker("setDate","0");		


		//manualInsert is done by hitting ENTER
		//selectionCopy is copy cells' contents in columns
		//improve headers.
		$('#mytable').jexcel({ 
				colHeaders:['Ingresa','Había','Mercadería','-','Queda','Vendido','$','Precio'],
				minDimensions:[8,8],				
				colWidths: [ 80, 80,150,80,80,80,80,80],
				contextMenu:function(){},
				rowDrag:false,
				columnSorting:false,
				allowInsertRow:false,
				allowManualInsertRow:false,	
				allowDeleteRow:false,
				allowInsertColumn:false,
				allowManualInsertColumn:false,
				allowDeleteColumn:false,
				editable:false
		});														

		var url='http://127.0.0.1:5000/cuadres/';
		
		//here I don't consider previous date. Just date that cuadre belongs to.
		$('#button_load').click(function(){		
			let today=parseDate($( "#datepicker" ).datepicker("getDate"));//parse date from datepicker		
			let url_=url+today;
			let freshTable;
			getData(url_).done(function(data){				
					freshTable=data.ss_cuadre;//load whole spreadsheet
					freshTable.push(genLastRow(freshTable.length));//push row with sum_v function
					alert("El cuadre del día seleccionado se cargo éxito.");
			}).fail(function(error){
				if("NOT FOUND"==error.statusText){
					alert("Error:\n\t\tNo existe cuadre del día seleccionado.");
				}else {
					alert("Error:\n\t\tno apirest.");	//net error				
				}
				freshTable=Array(8).fill(Array(8).fill(''));//empty the table
			}).always(function(){						
				$('#mytable').jexcel('setData',freshTable);
			});
		});		
		
		//set css and readonly property in specific columns
		$('#mytable').jexcel('updateSettings',{ 
				cells: function(cell,col,row){					
					if(col==1){
						$(cell).css('background-color','#fffec8');
					}
					let l=8;//l must be quantity of prendas				
					if(col==2||col==3||col==5||col==6||col==7||row==l){
						$(cell).css('background-color','#F1F5F8');					
						$(cell).css('color','black');					
						$(cell).addClass('readonly');		
					}					
				}				
		});	

		/*-------------------------------UTILITIES TO CUADRAR VIEW---------------------------*/
				

		function urlLastCuadre(date){
			return '?where={"date_":{"$lt":"'+date+'"}}&sort=[("date_",-1)]&max_results=1';
		}

		//set the column Habia taken from apirestTable
		function setColumnHabia(freshTable,apirestTable) {				
			for (let i = 0 ; i < freshTable.length ; i++){
				freshTable[i][1]=apirestTable[i][4];
			}
		}

		/*-------------------------------INITIAL LOAD AND HANDLERS---------------------------*/
			 
		
		//in cuadrar.html just can edit until -30 days previously
		$( "#datepicker" ).datepicker({
				dateFormat:'yy-mm-dd',
		    changeMonth: true,
		    changeYear: true,
				minDate:-30,
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
		});											
			

		var url='http://127.0.0.1:5000/cuadres/';

		$('#button_load').click(function(){		
			let today=parseDate($( "#datepicker" ).datepicker("getDate"));//parse date from daytepicker
			let url_=url+urlLastCuadre(today);
			let data_;
			let freshTable,apirestTable;
			let lastDay;
			getData(url_).done(function(data){					
				data_=data._items;//as we're filtering we must get first the array of _items	
				//if not empty, we can get the first of that array which is the desired item resource
				if(data_.length>0){
					freshTable=getDefaultData();//get default table
					apirestTable=data_[0].ss_cuadre;//get apirest table
					setColumnHabia(freshTable,apirestTable);//place quantity of columhabia that left in last cuadre
					freshTable.push(genLastRow(freshTable.length));//push row with sum_v function	

					lastDay=data_[0].date_;//get previous date of date found
				$('#lastDay_cuadre').text("Los datos en amarillo corresponden a la mercadería que quedó el día : "+lastDay);
					alert("Los datos para realizar el cuadre del día seleccionado se cargaron éxito.");
				}			
				else{
					//no previous data of selected date
					alert("No hay datos guardados anteriores al día seleccionado.\nSe cargarán valores por defecto.");
					freshTable = getDefaultData();
					freshTable.push(genLastRow(freshTable.length));

					$('#lastDay_cuadre').text("");
				}
			}).fail(function(error){				
				alert("Error:\n\t\tno apirest.");	//net error		
				freshTable=getDefaultData();
				freshTable.push(genLastRow(freshTable.length));
	
				$('#lastDay_cuadre').text("");
			}).always(function(){						
				$('#mytable').jexcel('setData',freshTable);
			});
		});		
		$('#button_load').trigger("click");

		
		
		$('#button_save').on('click', function () {			
			let today=parseDate($( "#datepicker" ).datepicker("getDate"));
			let data_={};
			let data = $('#mytable').jexcel('getData');//get data from table
			data.pop();//remove last row. row with sum_v function	
			data_.ss_cuadre=data;//set spreadsheet
			data_.date_=today;//sate date from datepicker

			let headers_post={};		
			postData(url,data_,headers_post).done(function(){
				alert("Los datos del cuadre se guardaron con éxito.");
			}).fail(function(error){
				if("UNPROCESSABLE ENTITY"==error.statusText){
					alert("Error:\n\t\tEl cuadre de este dia ya se realizó.");
				}else {
					alert("Error:\n\t\tno apirest.");	//net error		
				}								
			});						
		});
	
		//set this to admins only
		$('#button_update').on('click', function () {
			let today=parseDate($( "#datepicker" ).datepicker("getDate"));
			let data_={};
			let data = $('#mytable').jexcel('getData');//get data from table
			data.pop();//remove last row. row with sum_v function
			data_.ss_cuadre=data;//set spreadsheet

			headers_update={'X-HTTP-Method-Override':'PATCH'};			
			postData(url+today,data_,headers_update).done(function(){
				alert("Los datos del cuadre se sobreescribieron con éxito.");//remind error of edit in cascade			
			}).fail(function(error){			
				alert("Error:\n\t\tno apirest.");	//net error
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

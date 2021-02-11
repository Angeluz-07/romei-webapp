		//parse javascript date object and parse it as string yyyy-mm-dd
			function parseDate(date){
				let dateString = (date.getFullYear() + '-'
				+ ('0' + (date.getMonth() + 1)).slice(-2)
				+ '-' + ('0' + (date.getDate())).slice(-2));
				return dateString;
			}

			/*---------------------FUNCTIONS TO BUILD TABLE-----------------*/
			/*
				take params like:
					let l=5;
					let fname='ADD_';
					let cols=['B','D'];
				return like:
					["=ADD_(B1,D1)", 
					 "=ADD_(B2,D2)", 
					 "=ADD_(B3,D3)", 
					 "=ADD_(B4,D4)", 
					 "=ADD_(B5,D5)"]
			*/		
			function makeColum_setFunction(l,fname,cols){
				let newCol=Array(l).fill('');
				for (let i=0;i<newCol.length;i++){
						let cell_a=cols[0]+(i+1);
						let cell_b=cols[1]+(i+1);
						newCol[i]=''.concat('=',fname,'(',cell_a,',',cell_b,')');
				}
				return newCol;
			}

			//receives length of spreadsheet
			//depends on that length and function sum_v
			function genLastRow(l){
				let f='=sum_v(G1:G'.concat(l,')');
				let arr=['','','','','','Total:',f,''];
				return arr;		
			}
			
			//return the transposed 2d array from the array received as input.
			//creates a new matrix, be aware on memory.
			function transpose(matrix) {
				const rows = matrix.length, cols = matrix[0].length;
				const grid = [];
				for (let j = 0; j < cols; j++) {
					grid[j] = Array(rows);
				}
				for (let i = 0; i < rows; i++) {
					for (let j = 0; j < cols; j++) {
						grid[j][i] = matrix[i][j];
					}
				}
				return grid;
			}

		/*-------------------FUNCTIONS TO AUTO COMPUTE VALUES ON TABLE-------------------*/

		//check typeOfInput function for info about accepted values		
		//the table render empties as 0's, when are retrieved with cell.v
		//there's need to parse numeric values as strings due to split done in typeOfInput function
		//improve the parsing of number into strings.
		function SUBSTRACT_(cell_hay,cell_queda){
				let k1=typeOfInput(cell_hay.v+'');			
				let k2=typeOfInput(cell_queda.v+'');
				if(-1==k1||-1==k2){
					return "error";
				}
				let hay=parseDozensToNumber(cell_hay.v+'',k1);
				let queda=parseDozensToNumber(cell_queda.v+'',k2);				
				let vendido=hay-queda;				
				//console.log("k1"+k1+","+"k2"+","+k2);
				if (4==k1 || 4==k2){				
					return vendido;
				}else{									
					return parseNumberToDozens(vendido);
				}
															
		}

		//check typeOfInput function for info about accepted values		
		//the table render empties as 0's, when are retrieved with cell.v
		//there's need to parse numeric values as strings due to split done in typeOfInput function
		//improve the parsing of number into strings.
		function ADD_(cell_ingresa,cell_habia){		
			let k1=typeOfInput(cell_ingresa.v+'');			
			let k2=typeOfInput(cell_habia.v+'');
			if(-1==k1||-1==k2){
				return "error";
			}
			let ingresa=parseDozensToNumber(cell_ingresa.v+'',k1);			
			let habia=parseDozensToNumber(cell_habia.v+'',k2);		
			let hay=ingresa+habia;
			
			//console.log("k1="+k1+" , "+"k2="+k2);
			//console.log(hay);
			if (4==k1 || 4==k2){				
				return hay;
			}else{				
				return parseNumberToDozens(hay);
			}
			
		}

		//from cell_vendido expects #d#, string
		//from cell_precio expects number, integer	
		function COMPUTE_SOLD(cell_vendido,cell_precio){
			let k1=typeOfInput(cell_vendido.v+'');	
			if(-1==k1){
				return "error";
			}
			let vendido=parseDozensToNumber(cell_vendido.v+'',k1);
			let money=vendido*cell_precio.v;
			return money;
		}
		
		//for now global var, it works to save vendido total
		var ventaTotalTeorico;
		function sum_v(v){
				let sum=v.reduce((a,b)=>Number(a)+Number(b),0);
				ventaTotalTeorico=sum;
				//console.log(isNaN(ventaTotalTeorico) ? "error" : ventaTotalTeorico);
				return isNaN(ventaTotalTeorico) ? "error" : ventaTotalTeorico;
		}	


		/*------------------FUNCTIONS TO PARSE VALUES FROM, AND TO TABLE-------------------*/		
		
			/*
				take string input and return an integer wich represents its type.
				1 -> 'adb' ; a>0 && b>0 && b<12
				2 -> 'ad' ; a >0
				3 -> b>=0 && b<12
				4 -> b>=0
				-1 -> whichever other input
				note: can be improved by specific regex
			*/
			function typeOfInput(input){
				let patt1=/^\d+d\d+$/;//#d#
				let patt2=/^\d+d$/;//#d
				let patt3=/^\d+$/;//#     
				
				let l=input.split("d");
				// #d# -> adb ; #d -> ad ; # -> b
				let a,b;

				//#d# -> adb
				if(patt1.test(input)){      
				  a=parseInt(l[0],10);
				  b=parseInt(l[1],10);
				  if (a>0 && b>0 && b<12){
					return 1;
				  }else{        
					return -1;//console.log("error on units");
				  }           
				//#d -> ad
				}else if(patt2.test(input)){   
				  a=parseInt(l[0],10);
				  if (a>0){
					return 2;
				  }else{
					return -1;//console.log("error on units"); 
				  }
				//# -> b			
				}else if(patt3.test(input)){ 
				  b=parseInt(l[0],10);
				  if (b>=0 && b<12 ){
					return 3;
				  }else if(b>=0){
					return 4;
				  }else{        
					return -1; //console.log("error on units");
				  }
				}else{
				  return -1; //console.log("error");
				}
			}
			
			/*				
				Takes STRING like 2d3,2d or 2 . Return INT of the total computed value
				Proper k must be provided to treat dozens input properly.
				To get k, use typeOfInput function described above.
			*/
			function parseDozensToNumber(dozens,k){
			  let dozenPart,unitsPart;
			  // #d# -> adb ; #d -> ad ; # -> b
			  let a,b; 
			  let l=dozens.split("d");
			  switch(k){
				//#d# -> adb    
				case 1:
				  a=parseInt(l[0],10);
				  b=parseInt(l[1],10);
				  dozenPart=a*12;
				  unitsPart=b;      
				  return (dozenPart+unitsPart);
				//#d -> ad
				case 2:
				  a=parseInt(l[0],10);
				  dozenPart=a*12;
				  unitsPart=0;      
				  return (dozenPart+unitsPart);
				//# -> 0<=b<12 -> case 3
				//# -> 0<=b -> case 4
				case 3:case 4:
				  b=parseInt(l[0],10);
				  dozenPart=0;
				  unitsPart=b;      
				  return (dozenPart+unitsPart); 				  
				default:
				  return "error_";//to internal maintenance
			  } 
			}			
			

			//takes INT n like an integer number, return STRING like 2d3
			//improve output on lower than 1d, cause it returns like 0d3
			function parseNumberToDozens(n){
				if(n<12&&n>=0){
					return n+'';
				}
				//if passes, at least has 1 dozen
				let dozenPart=Math.trunc(n/12);
				let unitsPart=n%12;
				if(0==unitsPart){
					return dozenPart+'d';
				}else{
					return dozenPart+'d'+unitsPart;
				}
			}						

		/*------------------------------WRAPPING AJAX CALLS---------------------------*/
		
		function getData(url){			
			let request= $.ajax({
											url: url,
											type: "GET",
											dataType: "json",					
										});
			return request;
		}
						
		function postData(url,data,headers){
			let request=$.ajax({
										url: url,
										type: "POST",			
										contentType: "application/json",
										headers:headers,
										data: JSON.stringify(data),				
									});
			return request;
		}
	
		/*-----------------------------------DEFAULT DATA----------------------------------*/

		//handle here, about add or quit products
		function getDefaultData(){					
					let l=8; //the length of mercaderia					
																			
					let col_ingresa=Array(l).fill('');//empty
					let col_habia=Array(l).fill('');//empty
					let col_mercaderia=['Pant. Mujer','Extra','Boxer','2x5','x1','Short','Pant. hombre','Vermuda'];
					let col_hay=makeColum_setFunction(l,'ADD_',['A','B']);//set ADD_
					let col_queda=Array(l).fill('');//empty
					let col_vendido=makeColum_setFunction(l,'SUBSTRACT_',['D','E']);//set SUBSTRACT_
					let col_money=makeColum_setFunction(l,'COMPUTE_SOLD',['F','H']);//set COMPUTE_SOLD					
					let col_precio=['10','13','1.666666667','2.5','1','5','10','10'];

					//we use the following order of columns in a  matrix, to latter transpose it.					
					/*
						['A:Ingresa',
						 'B:Habia',
						 'C:Mercaderia',
						 'D:Hay',
						 'E:Queda',
						 'F:Vendido',
						 'G:$-Money',
						 'H:Precio']
						*/							
				  let m=[
							col_ingresa,
							col_habia,
							col_mercaderia,
							col_hay,
							col_queda,
							col_vendido,
							col_money,
							col_precio
					];
					
					let freshTable=transpose(m);
					return freshTable;
		}	

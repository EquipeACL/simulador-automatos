var graph = new joint.dia.Graph;
var objetosEstados = [];
	var paper = new joint.dia.Paper({
	    el: $('#diagramContainer'),
	    width: $('#centro').width()+30,
	    height: $('#centro').height(),
	    gridSize: 1,
	    model: graph
	});
	var inicio = new joint.shapes.fsa.StartState({ position: { x: 10, y: 10 } });
	var S0  = state(150, 150, 'S0');
	objetosEstados.push(S0);
	          		
	graph.addCell(inicio);
	graph.addCell(S0);
	
	linkCOMECO(inicio, S0,  'COMEÇO');
	

$( init );
function init() {

	
	$( "#menuEstadoFinal" ).dialog({
	width:400,
    autoOpen: false,
    modal:true,
	resizable: false,
	open: function(event, ui) {
        $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
    },
	buttons: {
        "Adicionar": function () {
           var estado = document.getElementById("selecinarEstadosFinal").value;
           if(estado == "" ){
           		alert('Selecione um Estado válido');
           }           
           else{
           		
           		aut.defineFinal(estado);
           		estado = "estado" + estado;
           		graph.getCell(estado).attr('circle/fill','#A9A9A9');
           		           		
           		

           }
           $( "#menuEstadoFinal" ).dialog( "close" );
           selecionaEstadoFinal();
        }
        ,
        "Fechar": function () {
           $( "#menuEstadoFinal" ).dialog( "close" );
        }
    }
  
  });

  $( "#menuDelete" ).dialog({
	width:330,
    autoOpen: false,
    modal:true,
	resizable:false,
	open: function(event, ui) {
        $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
    },
	buttons: {
        "Deletar": function () {
           var estado = document.getElementById("estadoSelecionado").value;
           // //remove todas as transiçoes que chegam no estado selecionado!
           // var estadoSelect = new Estado();
           // for(indice in aut.estados){
           // 		if(aut.estados[indice].nomeEstado == estado){
           // 			estadoSelect = aut.estados[indice];
           // 		}
           // 		for(tran in aut.estados[indice].vetTransicao){
           // 			var tempT = "#line"+aut.estados[indice].nomeEstado+estado+aut.estados[indice].vetTransicao[tran];
           // 			var tempL = "#"+aut.estados[indice].nomeEstado+estado+aut.estados[indice].vetTransicao[tran];
           // 			$(tempT).remove();
           // 			$(tempL).remove();
           			
           // 		}	
           // 	}
           // 	//remove todas as transições que saem do estado selecionado!
           // 	for(tran in estadoSelect.vetTransicao){
           // 		for(indice in aut.estados){
           // 			var tempT = "#line"+estado+aut.estados[indice].nomeEstado+estadoSelect.vetTransicao[tran];
           // 			var tempL = "#"+estado+aut.estados[indice].nomeEstado+estadoSelect.vetTransicao[tran];
           // 			$(tempT).remove();
           // 			$(tempL).remove();
           // 		}
           // 	}
           if(estado == "S0"){
           	    alert('S0 não pode ser deletado');
           }
           else if(estado == ""){
           		alert('Digite um Estado válido');
           }           
           else{
	           	deletarEstado("estado"+estado);
				$( "#menuDelete" ).dialog( "close" );           
           }
        }
        ,
        "Cancelar": function () {
           $( "#menuDelete" ).dialog( "close" );
        }
    }
  
  });
  
  $("#dialogDelete").dialog({
  	autoOpen:false,
  	modal:true,
	resizable:false,
	closeOnEscape: false,
    open: function(event, ui) {
        $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
    },
  	buttons:{
  		"Fechar":function(){
  			var id = $("#dialogDelete").data("id");
  			aut.deleteTransicao(id);
  			
  			id = "#"+id;
  			var letra = "#"+id.substring(5);
  			$(id).remove(); 
  			$(letra).remove(); 
  			$( "#dialogDelete" ).dialog( "close" );
  			
  		}	
  	}
  });

  $( "#menuTransicao" ).dialog({
	width:420,
    autoOpen: false,
    modal:true,
	resizable:false,
	open: function(event, ui) {
        $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
    },
	buttons: {
        "Adicionar": function () {
      		var origem = document.getElementById("estadosOrigem").value;
      		var simbolo = document.getElementById("transicaoAdicionada").value;
      		var destino = document.getElementById("estadosDestino").value;
      		
      		if(simbolo !=" " && simbolo!= "" )	{
      			aut.addTransicao(origem,simbolo,destino);	
				$( "#menuTransicao" ).dialog( "close" );
      		}
      		else{
      			alert('Insira um simbolo válido, por favor. Para que possamos adicionar a transição ao nosso autômato. Agradecemos a compreensão. Volte sempre!!');
      		}
	    }
      	

        ,
        "Cancelar": function () {
           $( "#menuTransicao" ).dialog( "close" );
        }
    }
  });
}
var curva = -1;
var Automato = function(){

	this.estados=[],
	this.addEstado=function(novoEstado){
		this.estados.push(novoEstado);
	},
	this.delEstado=function(estado){
		estado = estado.substring(6);
		for(indice in this.estados){
				if(this.estados[indice].nomeEstado == estado){
					this.estados.splice(indice,1);
				}
		}
	},
	this.transicoes=function(){
		for(estado in this.estados){
			this.estados[estado].imprimirTrans();
		}
	},
	this.validaCadeia=function(cadeia){
		var aux = this.estados[0];
		for(indice in cadeia){
			if(aux !== undefined){
				aux = aux.transiciona(cadeia.charAt(indice));
			
			}	
			
		}
		return (aux===undefined)?false:aux.estFinal;
	},
	this.defineFinal = function(nome){
		for(indice in this.estados){
			if(this.estados[indice].nomeEstado == nome){
					this.estados[indice].setFinal(!this.estados[indice].estFinal);
			}
		}	
	
	},
	this.mostraEstadosFinal = function(){
		for(indice in this.estados){
			if(this.estados[indice].estFinal == true){
				console.log(this.estados[indice].nomeEstado +" é um estado final!" );
			}
		}	
	
	},
	this.deleteTransicao = function(id){
		var origem = id.substring(0,2);
		var destino = id.substring(2,4);
		var simbolo = id.substring(4);
		for(indice in this.estados){
			if(this.estados[indice].nomeEstado == origem){

				for(indiceDois in this.estados[indice].vetTransicao){
					
					if(this.estados[indice].vetTransicao[indiceDois] ==simbolo && this.estados[indice].vetEstados[indiceDois].nomeEstado ==destino){
						this.estados[indice].vetTransicao[indiceDois] = "Deletado";
						//this.estados[indice].vetEstado[indiceDois] = {nome:"Deletado"};
					}
				}
			}

		 }
		
	},
	this.addTransicao = function(strOrigem,simbolo,strDestino){
		var origem = new Estado("");
		var destino = new Estado("");
		for(indice in this.estados){
			if(this.estados[indice].nomeEstado == strOrigem ){
					origem = this.estados[indice];
			}
			if(this.estados[indice].nomeEstado == strDestino ){
					destino = this.estados[indice];
			}
		}
		origem.addTransicao(simbolo,destino);
		strOrigemAux = "estado"+strOrigem;
		strDestinoAux = "estado"+strDestino;

		inserirTransicao(strOrigemAux,strDestinoAux,simbolo);

	}
};//fim do aut


//Estrutura do Estado
var Estado = function(nome){
	this.nomeEstado=nome,
	this.vetTransicao=[],
	this.vetEstados=[],
	this.estFinal=false,
	this.imprimirTrans=function(){
		console.log(this.nomeEstado);
		for(indice=0;indice<this.vetTransicao.length;indice++){
			console.log(this.vetTransicao[indice]+" transiona para "+this.vetEstados[indice].nomeEstado);
		}
	},
	this.transiciona=function(letra){
		for(estado in this.vetTransicao){
			if(this.vetTransicao[estado]==letra){
				return this.vetEstados[estado];
			}
		}
	},
	this.setFinal=function(valor){
		this.estFinal = valor;
	},
	this.addTransicao = function(simbolo,estadoDestino){
		this.vetTransicao.push(simbolo);
		this.vetEstados.push(estadoDestino);
	}	
	
}
var aut = new Automato();
var est0 = new Estado("S0");
aut.addEstado(est0);
var contador = 1;

function inserirEstado(){	
	var estado  = state(200, 200, 'S'+contador);
	objetosEstados.push(estado);
	
	var novo = new Estado("S"+contador);
	aut.addEstado(novo);	
	contador += 1 ;
	
}

function deletarEstado(estado){
	graph.getCell(estado).remove();
	aut.delEstado(estado);
}
function selecionaEstadoFinal(){
	document.getElementById("selecinarEstadosFinal").innerHTML = '';
	document.getElementById("selecinarEstadosFinal").innerHTML += '<option value="">Selecione um estado!</option>';
	for(indice in aut.estados){
		if(aut.estados[indice].estFinal == false){
			document.getElementById("selecinarEstadosFinal").innerHTML += '<option>'+aut.estados[indice].nomeEstado+'</option>';
		}

	}
	document.getElementById("saoFinais").innerHTML  = '<th>Estados finais</th><th>Ação</th>';
	for(indice in aut.estados){
		if(aut.estados[indice].estFinal == true){
			document.getElementById("saoFinais").innerHTML += '<tr><td>'+aut.estados[indice].nomeEstado+'</td><td><a id="remover'+aut.estados[indice].nomeEstado+'" class="btn btn-danger btn-xs" onclick="removerFinal(this)" title="Clique para o estado deixar de ser final...">Remover</a></td></tr>';
		}
	}	
	$("#menuEstadoFinal").dialog("open");

}
removerFinal = function(comp){
	var estado = comp.id.substring(7);
	aut.defineFinal(estado);
	estado = "estado"+estado;
	graph.getCell(estado).attr('circle/fill','#FFFFFF');
	$("#menuEstadoFinal").dialog("close");
	selecionaEstadoFinal();
}


function selecionaEstado(){
	document.getElementById("estadoSelecionado").innerHTML = '';
	document.getElementById("estadoSelecionado").innerHTML += '<option value="">Selecione um estado!</option>';
	for(indice in aut.estados){
		document.getElementById("estadoSelecionado").innerHTML += '<option>'+aut.estados[indice].nomeEstado+'</option>';
	}
	$("#menuDelete").dialog("open");

}

function selecionaTransicao(){
	document.getElementById("estadosOrigem").innerHTML = '';
	document.getElementById("estadosDestino").innerHTML = '';
	document.getElementById("estadosOrigem").innerHTML += '<option>Origem</option>';
	document.getElementById("estadosDestino").innerHTML += '<option>Destino</option>';
	for(indice in aut.estados){
	document.getElementById("estadosOrigem").innerHTML += '<option>'+aut.estados[indice].nomeEstado+'</option>';
	document.getElementById("estadosDestino").innerHTML += '<option>'+aut.estados[indice].nomeEstado+'</option>';
	}
	$("#menuTransicao").dialog("open");

}

function valida(cadeia){
	var nome = cadeia.value;
	if(aut.validaCadeia(nome)){
		document.getElementById("resposta").value = "Cadeia aceita!";
		document.getElementById("resposta").style.background = "green";
		$("#textHistorico").val($("#textHistorico").val()+nome+" - aceita!"+"\n");
	}	
	else{
		document.getElementById("resposta").value = "Cadeia não aceita!";
		document.getElementById("resposta").style.background = "red";
		$("#textHistorico").val($("#textHistorico").val()+nome+" - não aceita!"+"\n");
	}
}

function clicouCheck(componente){
	aut.defineFinal(componente.id);

}

function dialogDelete(objeto){
	var id = objeto.id;
	$("#dialogDelete").data("id",id).dialog("open");
}

limparHistorico = function(){
	$("#textHistorico").val("");	
	$("#resposta").val("");
	$("#resposta").css('background','white');

}

inserirTransicao =function(id_origem,id_destino,simbolo){
   var origem, destino;
   for(indice in objetosEstados){
    	if(objetosEstados[indice].id == id_origem){
    		origem = indice;
    	}
    	if(objetosEstados[indice].id == id_destino){
    		destino = indice;
    	}
   }
   if(id_origem != id_destino){
   	link(objetosEstados[origem], objetosEstados[destino],  simbolo);
   }else{
   	var x1 , y1, x2, y2;
   	x1 =objetosEstados[origem].attributes.position.x + 25;
   	y1 =objetosEstados[origem].attributes.position.y - 10;
   	x2 =objetosEstados[origem].attributes.position.x - 10;
   	y2 =objetosEstados[origem].attributes.position.y + 5;
   	link(objetosEstados[origem], objetosEstados[destino],  simbolo, [{x:x1,y:y1},{x:x2,y:y2}]);
   }
  	
    
   
};




function state(x, y, label) {
    var temp = "estado"+label;
    var cell = new joint.shapes.fsa.State({
    	id:temp,
        position: { x: x, y: y },
        size: { width: 60, height: 60 },
        attrs: { text : { text: label }}
    });
    graph.addCell(cell);
    return cell;
};

function link(source, target, label, vertices) {
    var temp = source.id.substring(6)+target.id.substring(6)+label;
    var cell = new joint.shapes.fsa.Arrow({
    	id:temp,
        source: { id: source.id },
        target: { id: target.id },
        labels: [{ position: .5, attrs: { text: { text: label || '', 'font-weight': 'bold' } } }],
        vertices: vertices || []
    });
    graph.addCell(cell);
    return cell;
}

//adicionando o seta do COMEÇO
function linkCOMECO(source, target, label, vertices) {
    
    var cell = new joint.shapes.fsa.ArrowINICIAL({
        source: { id: source.id },
        target: { id: target.id },
        labels: [{ position: .5, attrs: { text: { text: label || '', 'font-weight': 'bold' } } }],
        vertices: vertices || []
    });
    graph.addCell(cell);
    return cell;
}
	
//ajustar a area de desenho de acordo com o tamanho da div
$(window).resize(function() {
    paper.setDimensions($('#centro').width()+30, $('#centro').height());
});
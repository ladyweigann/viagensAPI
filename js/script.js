var btnPesquisar = document.getElementById("btnPesquisar")
var btnVoltar = document.getElementById("btnVoltar")
var lugarOrigem 
var lugarDestino 
var siglaLugarOrigem
var siglaLugarDestino
var companhiaAerea
var dataIda

btnPesquisar.onclick = function(event) {
    //limpando campos de pesquisa anteriores
    document.getElementById("idTdPreco").innerHTML = ""
    document.getElementById("idTdCompanhia").innerHTML = ""
    document.getElementById("idTdOrigem").innerHTML = ""
    document.getElementById("idTdDestino").innerHTML = ""
    document.getElementById("idTdEscalas").innerHTML = ""

    //alternando entre janelas de exibição
    document.getElementById("idTelaPesquisa").classList.add("esconder")
    document.getElementById("idDivOut").classList.remove("esconder")
    document.getElementById("idOut").innerHTML = "Pesquisando..."
    lugarOrigem = document.getElementById("idOrigem").value
    lugarDestino = document.getElementById("idDestino").value
    dataIda = document.getElementById("idDate").value
    if(lugarOrigem != "" && lugarDestino != "" && dataIda != ""){
        buscarLugares(lugarOrigem, lugarDestino, dataIda)
    }
    else{
        alert("Por favor, preencha todos os campos")
    }
}


function buscarLugares(lugarOrigem, lugarDestino, dataIda) {
    
    fetch("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/UK/GBP/en-GB/?query=" + lugarOrigem, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
            "x-rapidapi-key": "1d878e08f2mshc11e6d9940067f0p1074b2jsne392736ca38e"
        }
    })
    .then(response => {
        return response.json()
    })
    .then(function (dado) {
        console.log(dado.Places[0].PlaceId);
        siglaLugarOrigem = dado.Places[0].PlaceId
        fetch("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/UK/GBP/en-GB/?query=" + lugarDestino, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
            "x-rapidapi-key": "1d878e08f2mshc11e6d9940067f0p1074b2jsne392736ca38e"
        }
    })
    .then(response => {
        return response.json()
    })
    .then(function (dado) {
        console.log(dado);
        console.log(dado.Places[0].PlaceId);
        siglaLugarDestino = dado.Places[0].PlaceId
        fetch("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/BR/BRL/pt-BR/" + siglaLugarOrigem + "/" + siglaLugarDestino + "/" + dataIda, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
            "x-rapidapi-key": "1d878e08f2mshc11e6d9940067f0p1074b2jsne392736ca38e"
        }
    })
    .then(response => {
        return response.json()
    })
    .then(function(dado) {
        console.log(dado);
        let valores = dado.Quotes
        console.log(valores)
        
        
        // criando um laço para pegar o nome do lugar pelo código

        for (let index = 0; index < dado.Places.length; index++) {
            if(valores[0].OutboundLeg.OriginId == dado.Places[index].PlaceId){
                console.log(dado.Places[index].CityName + dado.Places[index].CountryName)  
                var cidadeOrigem = dado.Places[index].CityName + "/" + dado.Places[index].CountryName


            }else if(valores[0].OutboundLeg.DestinationId == dado.Places[index].PlaceId){
                console.log(dado.Places[index].CityName + dado.Places[index].CountryName)
                var cidadeDestino = dado.Places[index].CityName + "/" + dado.Places[index].CountryName
            }
        }

        // verificando se o voo tem escalas
        var vooDireto
        if(valores[0].Direct == false) {
             vooDireto = "Sim"
        }else{
            vooDireto = "Não"
        }

        //mostrando as informações na tela, pela tabela 
        document.getElementById("idOut").innerHTML = "Resultado para a data: " + valores[0].OutboundLeg.DepartureDate
        document.getElementById("idTdPreco").innerHTML = "R$" + valores[0].MinPrice + ",00"
        document.getElementById("idTdCompanhia").innerHTML = dado.Carriers[0].Name
        document.getElementById("idTdOrigem").innerHTML = cidadeOrigem
        document.getElementById("idTdDestino").innerHTML = cidadeDestino
        document.getElementById("idTdEscalas").innerHTML = vooDireto
        
    })
    })
})
.catch(err => {
    document.getElementById("idOut").innerHTML = "<p>Ops, não encontramos vôos para os parâmentros selecionados. Tente outra data!</p>"
})

}

    btnVoltar.onclick = function(){
        document.getElementById("idDivOut").classList.add("esconder")
        document.getElementById("idTelaPesquisa").classList.remove("esconder")
        document.getElementById("idFormulario").reset()

    }
const chave = 'tarkovsky'
var espacos


function showPalavra() {//Função principal que é chamada quando se clica no botão

    const displayCriptografada = document.getElementById('criptografada')

    document.getElementById('decriptografada').style.display = "none" //Esconde o elemento que mostra a palavra decriptografada

    var palavra = document.getElementById('palavra').value.toString().toLowerCase() //Formata a string recebida para garantir que todos os caracteres sejam minusculos
    espacos = findSpaces(palavra) // Acha quantos espaços em branco a mensagem possue e em que posição da string eles estão
    palavra = (palavra.split(" ")).join("") //Remove os espaços em branco
    const criptografada = cripMenssagem(palavra) //Criptografa a mensagem

    displayCriptografada.innerText = devolveEspaços(criptografada,espacos) // Devolve os espaços à e mostra a palavra criptografada

    posta( "https://desafio9.onrender.com/decrypt_message", criptografada) // Faz a requisição http

}

function criptografar(palavra) {

    var indexSync = 0
    var output = []

    for (let index = 0; index < palavra.length; index++) { //Olha cada char de uma PALAVRA e criptografa cada um aplicando a formula aos valores ASCII dos char's e guarda cada um em uma lista

        if (indexSync>= chave.length) {
            indexSync = 0
        }

        const char = palavra.charCodeAt(index)
        const chaveChar = chave.charCodeAt(indexSync)
        const posChar = Math.abs(97 - char)
        const posChave = Math.abs(97 - chaveChar)
        var defasa = (posChar + posChave) % 26

        const criptografado = String.fromCharCode(defasa + 97)

        output[index] = criptografado
        indexSync++
    }
    return output.join("") // Junta os caracteres em uma unica string
}

function cripMenssagem(menssagem) { // Aplica a função "criptografar" em todas as palavras de uma mensagem
    var palavras = menssagem.split(" ")
    var output = []
    for (let index = 0; index < palavras.length; index++) {
        output[index] = criptografar(palavras[index])
    }
    return output.join(" ")
}

function posta(url, menssagem) {
    var piririm = new XMLHttpRequest();
    piririm.open("POST", url, true);
    piririm.setRequestHeader("Content-type", "application/json");
    document.getElementById('loading').style.display = "block" // Mostra o simbolo de carregamento
    piririm.onreadystatechange = function() {
        if (piririm.readyState == 4 && piririm.status == 200) { //Ativa quando o request é atendido com status 200
            document.getElementById('loading').style.display = "none" // Esconde o simbolo de carregamento
            var response = JSON.parse(piririm.responseText);
            console.log("O que eu recebi: ",response); 

            var resposta = response.decrypted_message;
            console.log("resposta   ",resposta)
            document.getElementById('decriptografada').innerText = devolveEspaços(resposta, espacos) //Devolve os espaços e mostra a palavra decriptografada na tela
            document.getElementById('decriptografada').style.display = "block"
        }
    };

    console.log("O que eu tô enviando: ",prepMenssagem(menssagem))
    piririm.send(prepMenssagem(menssagem));
}


function prepMenssagem(menssagem) { //Transforma a string em json preparando a mensagem para ser usada no request
    json = {
        "encrypted_message": menssagem,
        "keyword": chave
    }
    return JSON.stringify(json)       
}

function findSpaces(text) { //Dada uma string 'text' retorna uma lista com o index de todos os espaços vazios dessa string
    var posList = []
    var txtArray = [...text]
    while (txtArray.findIndex(isWhite) != -1) {
        var ind = txtArray.findIndex(isWhite)
        posList.push(ind)
        txtArray.splice(ind, 1)
    }
    return posList
}

function isWhite(c){ //Função booleana que checa se um character C é ou não um espaço vazio (usando expressão regular /\s/)
    if ((/\s/).test(c)) {
        return true
    }else{
        return false
    }
}

function devolveEspaços(msg, lista) {
    var arr = [...msg]

    for (let i = 0; i < lista.length; i++) {
        const alvo = lista[i]
        arr.splice(alvo+i, 0, ' ')
    }

    return arr.join("")
}
const chave = 'tarkovsky'
var espacos


function showPalavra() {
    const displayCriptografada = document.getElementById('criptografada')

    document.getElementById('decriptografada').style.display = "none"

    var palavra = document.getElementById('palavra').value.toString().toLowerCase()
    espacos = findSpaces(palavra)
    palavra = (palavra.split(" ")).join("")
    const criptografada = cripMenssagem(palavra)

    displayCriptografada.innerText = devolveEspaços(criptografada,espacos)

    posta( "https://desafio9.onrender.com/decrypt_message", criptografada)

}

function criptografar(palavra) {

    var indexSync = 0
    var output = []

    for (let index = 0; index < palavra.length; index++) {

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
    return output.join("")
}

function cripMenssagem(menssagem) {
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
    document.getElementById('loading').style.display = "block"
    piririm.onreadystatechange = function() {
        if (piririm.readyState == 4 && piririm.status == 200) {
            document.getElementById('loading').style.display = "none"
            var response = JSON.parse(piririm.responseText); 
            console.log("O que eu recebi: ",response); 

            var resposta = response.decrypted_message;
            console.log("resposta   ",resposta)
            document.getElementById('decriptografada').innerText = devolveEspaços(resposta, espacos)
            document.getElementById('decriptografada').style.display = "block"
        }
    };

    console.log("O que eu tô enviando: ",prepMenssagem(menssagem))
    piririm.send(prepMenssagem(menssagem));
}


function prepMenssagem(menssagem) {
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

function devolveEspaços(msg, lista) { //Lista é uma lista 
    var arr = [...msg]

    for (let i = 0; i < lista.length; i++) {
        const alvo = lista[i]
        arr.splice(alvo+i, 0, ' ')
    }

    return arr.join("")
}
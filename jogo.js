const palavras = [
    "gato",
    "cor",
    "prato",
    "luz",
    "folha",
    "carro",
    "cinza",
    "dente",
    "nuvem",
    "vento",
    "peixe",
    "festa",
    "verde",
    "vidro",
    "porta",
    "campo",
    "papel",
    "copo",
    "praia",
    "leite"
];

const dicas = [
    "Animal que mia",
    "Algo que define a aparência das coisas",
    "Objeto usado para servir comida",
    "Oposto de escuridão",
    "Parte verde de uma planta",
    "Veículo de quatro rodas",
    "Uma cor entre o branco e o preto",
    "Parte da boca usada para mastigar",
    "Forma branca no céu",
    "Movimento de ar",
    "Animal que vive na água",
    "Comemoração com amigos",
    "Cor da grama",
    "Material transparente e frágil",
    "Entrada de uma casa",
    "Área aberta com grama",
    "Material usado para escrever",
    "Objeto usado para beber",
    "Lugar com areia e mar",
    "Bebida branca vinda da vaca"
];


let palavraSorteada = ""; 
let letrasEmbaralhadas = [];
const audioContext = new AudioContext();
var pontuacao = 0;


document.getElementById("pontuacao").innerHTML = pontuacao;


const letterContainer = document.getElementById('letter-container');
const message = document.getElementById('message');
const checkButton = document.getElementById('checkButton');




function embaralharPalavra(palavraOriginal) {
    let arrayLetrasEmbaralhadas = [];

    function embaralhar() {
        const arrayLetrasOrdenadas = palavraOriginal.split(''); 
        arrayLetrasEmbaralhadas = [];

        while (arrayLetrasOrdenadas.length > 0) {
            const randomIndex = Math.floor(Math.random() * arrayLetrasOrdenadas.length); 
            arrayLetrasEmbaralhadas.push(arrayLetrasOrdenadas.splice(randomIndex, 1)[0]); 
        }
    }

    do {
        embaralhar();
    } while (arrayLetrasEmbaralhadas.join('') === palavraOriginal); 
    return arrayLetrasEmbaralhadas; 
}



function calculateScore(){
    this.pontuacao ++;
    document.getElementById("pontuacao").innerHTML = pontuacao;
}



function playAudio(audioBuffer) {
    const audioSource = audioContext.createBufferSource();
    audioSource.buffer = audioBuffer;
    audioSource.loop = false;
    audioSource.volume = 1;
    audioSource.connect(audioContext.destination);
    audioSource.start();
}


function iniciarJogo() {
    message.textContent = '';
    letterContainer.innerHTML = ''; 
    palavraSorteada = palavras[Math.floor(Math.random() * palavras.length)]; 
    index = palavras.indexOf(palavraSorteada);
    dica = dicas[index]

    document.getElementById("dica").innerHTML = dica;
    letrasEmbaralhadas = embaralharPalavra(palavraSorteada); 

    letrasEmbaralhadas.forEach(letter => {
        const letterElement = document.createElement('div');
        letterElement.textContent = letter;
        letterElement.classList.add('letter');
        letterElement.setAttribute('draggable', 'true');
        letterElement.addEventListener('dragstart', handleDragStart);
        letterElement.addEventListener('dragover', handleDragOver);
        letterElement.addEventListener('drop', handleDrop);
        letterContainer.appendChild(letterElement);
    });
}


let draggedElement = null;

function handleDragStart(event) {
    draggedElement = event.target;
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();
    if (event.target.classList.contains('letter')) {
        
        let temp = draggedElement.textContent;
        draggedElement.textContent = event.target.textContent;
        event.target.textContent = temp;
    }
}


function verificarPalavra() {
    const palavraRespondida = Array.from(letterContainer.children).map(letter => letter.textContent).join('');
    
    if (palavraRespondida === palavraSorteada) {
        message.textContent = "Parabéns, você acertou!";
        console.log(pontuacao);
        message.style.color = "#1C7C54"; 
        calculateScore();
        fetch('correto.mp3')
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
            playAudio(audioBuffer);
        })
        .catch(error => {
            console.error('Error loading audio:', error);
        });

    } else {
        message.textContent = "Resposta: "+palavraSorteada;
        message.style.color = "#D9534F";
        fetch('errado.mp3')
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
            playAudio(audioBuffer);
           
        })
        .catch(error => {
            console.error('Error loading audio:', error);
        });

        
    }
    setTimeout(iniciarJogo, 2000); 
}



iniciarJogo();


checkButton.addEventListener('click', verificarPalavra);

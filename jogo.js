//Moonlander. Um jogo de alunissagem.
//Pedro Gomes (pedroGomes231)
//28/03/2025
//Versão 0.1.0


/** @type {HTMLCanvasElement} */

//seção de Modelagem de dados

let canvas = document.querySelector("#jogo");
let contexto = canvas.getContext("2d");


let lancamentoPelaEsquerda = (Math.round(Math.random()) == 0)

let moduloLunar = {
    posicao: {
        x: lancamentoPelaEsquerda?100:700,
        y: 100
    },
    angulo: lancamentoPelaEsquerda ? -Math.PI/2: Math.PI/2,
    largura: 20,
    altura: 20,
    cor: "lightgray",
    motorLigado: false,
    velocidade: {
        x: lancamentoPelaEsquerda ? 2 : -2,
        y: 0
    },
    combustivel : 100,
    rotacaoAntiHorario: false,
    rotacaoHorario: false,
};

let estrelas = [];

for(let i = 0; i < 700; i++){
    estrelas[i] = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        raio: Math.sqrt(2 * Math.random()),
        brilho: 1.0,
        apagando: true,
        cintilacao: 0.05*Math.random(),
    }
}




//seção de visualização
function desenharModuloLunar(){
    contexto.save();
    contexto.beginPath();
    contexto.translate(moduloLunar.posicao.x, moduloLunar.posicao.y);
    contexto.rotate(moduloLunar.angulo);
    contexto.rect(moduloLunar.largura * -0.5, moduloLunar.altura * -0.5,
         moduloLunar.largura, moduloLunar.altura);
    contexto.fillStyle = moduloLunar.cor;
    contexto.fill();
    contexto.closePath();

    if(moduloLunar.motorLigado){
        desenharChama();
    }
    
    contexto.restore();
}

function desenharChama(){
    contexto.beginPath();
    contexto.moveTo(moduloLunar.largura * -0.5, moduloLunar.altura * 0.5);
    contexto.lineTo(moduloLunar.largura * 0.5, moduloLunar.altura * 0.5);
    //Determina o tamanho da chama
    contexto.lineTo(0, moduloLunar.altura * 0.5 + Math.random() * 40 );
   //2 contexto.lineTo(moduloLunar.largura * -0.5, moduloLunar.altura * 0.5);
    contexto.closePath();
    contexto.fillStyle = "orange";
    contexto.fill();
}

function mostrarVelocidade(){
    mostrarIndicador(
        mensagem = `Velocidade vertical: ${(10 * moduloLunar.velocidade.y).toFixed(2)}`,
        x = 50,
        y = 60
    )

}

function gasto(){
   if( moduloLunar.combustivel > 0) {
        moduloLunar.combustivel --;
   }else{
    moduloLunar.combustivel = 0
    moduloLunar.motorLigado = false
       
}
}
function mostrarAngulo(){
    mostrarIndicador(
        `ângulo: ${(moduloLunar.angulo * 180 / Math.PI).toFixed(0)}°`,
        x = 400,
        y = 80
    )

}


function mostrarVelocidadeHorizontal(){
    mostrarIndicador(
        mensagem = `Velocidade Horizontal: ${(10 * moduloLunar.velocidade.x).toFixed(2)}`,
        x = 50,
        y = 100
    )
}

function mostrarCombustivelPorcentagem(){
    mostrarIndicador(
        mensagem = `Mostrar combustivel: ${(moduloLunar.combustivel/100) * 100 .toFixed(0)}%`,
        x = 50,
        y = 120
    )
}
function mostrarAltitude(){
    mostrarIndicador(
        mensagem = `Altitude: ${(canvas.height - moduloLunar.posicao.y).toFixed(0)}`,

        x = 400,
        y = 120
    )
}
 
function desenharEstrelas(){
    contexto.save();
    for(let i = 0; i < estrelas.length; i++){
        let estrela = estrelas[i];
    contexto.beginPath();
    contexto.arc(estrela.x, estrela.y, estrela.raio, 0, 2*Math.PI);
    contexto.closePath();
    contexto.fillStyle = `rgba(255, 255, 255, ${estrela.brilho})`;
    contexto.fill();
    if(estrela.apagando){
        estrela.brilho -= estrela.cintilacao;
        if(estrela.brilho < 0.1){
            estrela.apagando = false;
        }
    } else{
        estrela.brilho += estrela.cintilacao;
        if(estrela.brilho >= 0.95){
            estrela.apagando = true;
        }
    }
        
    }
    

    }
    contexto.restore();


function desenhar(){
    //limpar a tela
    contexto.clearRect(0, 0, canvas.width, canvas.height);
    //Esta função atualiza a posição do modulo lunar em função da gravidade
    atracaoGravitacional();
     mostrarVelocidade();
     desenharEstrelas();
    desenharModuloLunar();
    mostrarAngulo();
    mostrarVelocidadeHorizontal();
    mostrarCombustivelPorcentagem();
    mostrarAltitude();
    
    
    
    //esta função repete a execução da função desenhar a cada quadro.
    if(moduloLunar.posicao.y >= (canvas.height - 0.5 * moduloLunar.altura)){
       if(moduloLunar.velocidade.y >= 0.5  ||
        Math.abs(moduloLunar.velocidade.x) >= 0.5 ||
        5 < Math.abs(moduloLunar.angulo)
       )
       {
            return mostrarResultado("Voce morreu!", cor ="red");
             
       }else{
        return mostrarResultado('Você conseguiu!', cor = 'green')
       }

    }
    requestAnimationFrame(desenhar);
}

    function mostrarResultado(mensagem, cor){
        contexto.font = 'bold 40px Calibri';
        contexto.textAlign = 'center';
        contexto.textBaseline = 'middle';
        contexto.fillStyle = cor;
        contexto.fillText(mensagem, canvas.width/2, canvas.height/2);
    }
    
    function mostrarIndicador(mensagem, x, y ){
        contexto.font = "bold 18px Arial";
        contexto.textAling = "center";
        contexto.textBaseline = "middle";
        contexto.fillStyle = "lightgray";
        contexto.fillText(mensagem, x, y);
    }

//seção de controle
//Pressionando a seta para cima para ligar o motor
document.addEventListener("keydown", teclaPressionada);
function teclaPressionada(evento){
   if(evento.keyCode == 38){
        moduloLunar.motorLigado = true;
        gasto();
    }else if(evento.keyCode == 37){
       moduloLunar.rotacaoAntiHorario = true;

    }else if(evento.keyCode == 39){
       moduloLunar.rotacaoHorario = true;

    }
}
//Soltando a seta para cima para desligar o motor
document.addEventListener("keyup", teclaSolta);
function teclaSolta(evento){
    if(evento.keyCode == 38){
        moduloLunar.motorLigado = false;
    }else if(evento.keyCode == 37){
        moduloLunar.rotacaoAntiHorario = false;

    }else if(evento.keyCode == 39){
       moduloLunar.rotacaoHorario = false;
    }
}

let gravidade = 0.03;
function atracaoGravitacional(){
    moduloLunar.posicao.x += moduloLunar.velocidade.x;
    moduloLunar.posicao.y += moduloLunar.velocidade.y;
    if(moduloLunar.rotacaoAntiHorario){
        moduloLunar.angulo += Math.PI/180;
    }else if (moduloLunar.rotacaoHorario){
        moduloLunar.angulo -= Math.PI/180;
        
    }

    if(moduloLunar.motorLigado){
        moduloLunar.velocidade.y -= 0.2 * Math.cos(moduloLunar.angulo);
        moduloLunar.velocidade.x += 0.2 * Math.sin(moduloLunar.angulo);
    }

    moduloLunar.velocidade.y += gravidade;
    if(moduloLunar.posicao.y < 10){
        moduloLunar.posicao.y = 10;
        moduloLunar.velocidade.y = 0;
       
    }
    if(moduloLunar.posicao.y > 590){
        moduloLunar.posicao.y = 590;
        moduloLunar.velocidade.y = 0;
    }

}
  
        
    

desenhar();
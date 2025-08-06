const synaptic = require('synaptic');
const readline = require('readline');
const { Layer, Network, Trainer } = synaptic;

// Definindo as camadas
const inputLayer = new Layer(3);  // idade, gosta de doce?, dormiu bem?
const hiddenLayer = new Layer(4);
const outputLayer = new Layer(1);

// Conectando as camadas
inputLayer.project(hiddenLayer);
hiddenLayer.project(outputLayer);

// Criando a rede
const network = new Network({
  input: inputLayer,
  hidden: [hiddenLayer],
  output: outputLayer
});

// Treinamento da rede (0 = chá, 1 = café)
const trainer = new Trainer(network);
trainer.train([
  { input: [0.2, 1, 0], output: [0] }, // jovem, gosta de doce, mal dormiu → chá
  { input: [0.9, 0, 1], output: [1] }, // idoso, não gosta de doce, bem dormido → café
  { input: [0.5, 1, 1], output: [1] }, // meia idade, doce, dormiu → café
  { input: [0.3, 0, 0], output: [0] }, // jovem, sem doce, cansado → chá
], {
  iterations: 5000,
  log: false
});

// Função para converter respostas "sim/não" em números binários
function simOuNao(resposta) {
  resposta = resposta.trim().toLowerCase();
  return resposta === 'sim' ? 1 : 0;
}

// Interface para entrada de dados
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Coleta das respostas do usuário
rl.question('Qual a sua idade? (número em anos): ', (idade) => {
  const idadeNormalizada = parseFloat(idade) / 100;

  rl.question('Você gosta de coisas doces? (sim/não): ', (gostaDoce) => {
    rl.question('Você dormiu bem esta noite? (sim/não): ', (dormiuBem) => {
      const entrada = [
        idadeNormalizada,
        simOuNao(gostaDoce),
        simOuNao(dormiuBem)
      ];

      const resultado = network.activate(entrada)[0];
      const previsao = resultado >= 0.5 ? '☕ Café' : '🍵 Chá';

      console.log('\n🔎 Resultado da IA:');
      console.log(`Probabilidade de café: ${(resultado * 100).toFixed(1)}%`);
      console.log(`Sugestão: ${previsao}`);

      rl.close();
    });
  });
});

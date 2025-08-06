const synaptic = require('synaptic');
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

// Treinamento (0 = chá, 1 = café)
const trainer = new Trainer(network);
trainer.train([
  { input: [0.2, 1, 0], output: [0] }, // jovem, gosta de doce, mal dormiu → chá
  { input: [0.9, 0, 1], output: [1] }, // idoso, não gosta de doce, bem dormido → café
  { input: [0.5, 1, 1], output: [1] }, // meia idade, doce, dormiu → café
  { input: [0.3, 0, 0], output: [0] }, // jovem, sem doce, cansado → chá
], {
  iterations: 5000,
  log: true
});

// Teste
const resultado = network.activate([0.6, 0, 1]); // meia idade, não gosta de doce, dormiu bem
console.log("Probabilidade de café (1) ou chá (0):", resultado[0].toFixed(2));

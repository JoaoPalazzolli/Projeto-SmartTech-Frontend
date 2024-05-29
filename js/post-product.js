import { refreshToken } from "./refresh.js";

const btn = document.getElementById('salvarProduto');
const nomeProduto = document.getElementById('produto');
const descricao = document.getElementById('descricao');
const quantidade = document.getElementById('quantidade');
const dataValidade = document.getElementById('date');
const tipo = document.getElementById('selecttype');
const lembrete = document.getElementById('selectime');

const dados = JSON.parse(localStorage.getItem('local'));

const serverURL = 'http://localhost:8080/api/v1/product';

btn.addEventListener('click', () => {
  fetch(serverURL,
    {
      headers: {
        "Accept": "*/*",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + dados.accessToken
      },
      method: "POST",
      body: JSON.stringify({
        nomeProduto: nomeProduto.value,
        descricao: descricao.value,
        quantidade: quantidade.value,
        dataValidade: dataValidade.value,
        timerLembrete: lembrete.value,
        tipo: tipo.value
      })
    })
    .then(function (res) {
      console.log(res)
      if (res.status >= 200 && res.status <= 299) {
        window.location.href = 'index.html'
      }
      if (res.status == 403) {
        refreshToken();
      }
    })
    .catch(function (res) { console.log(res) })
});
// Define o ID do usuário logado
const userId = 1; // Defina o ID do usuário logado aqui

// Salva o ID do usuário logado no localStorage
localStorage.setItem("userId", userId);

// Recupera o ID do usuário logado do localStorage
const loggedUserId = localStorage.getItem("userId");

console.log("ID do usuário logado:", loggedUserId);

// Função para salvar os dados no localStorage
function salvarDadosLocalStorage(data) {
  localStorage.setItem("amigosData", JSON.stringify(data));
}

// Função para carregar os dados do localStorage
function carregarDadosLocalStorage() {
  const data = localStorage.getItem("amigosData");
  return data
    ? JSON.parse(data)
    : { amigos: [], usuarios: [], solicitacoesAmizade: [] };
}

// Função para inicializar os dados
function inicializarDados() {
  const data = carregarDadosLocalStorage();
  if (data.usuarios.length === 0) {
    fetch("./db.json")
      .then((response) => response.json())
      .then((dbData) => {
        data.amigos = dbData.amigos;
        data.usuarios = dbData.usuarios;
        data.solicitacoesAmizade = dbData.solicitacoesAmizade;
        salvarDadosLocalStorage(data);
        carregarSolicitacoes(data);
      })
      .catch((error) =>
        console.error("Erro ao carregar a base de dados:", error)
      );
  } else {
    carregarSolicitacoes(data);
  }
}

// Função para carregar as solicitações de amizade
function carregarSolicitacoes(data) {
  const pedidosRecebidos = document.getElementById("pedidos-recebidos");
  const pedidosEnviados = document.getElementById("pedidos-enviados");

  pedidosRecebidos.innerHTML = "";
  pedidosEnviados.innerHTML = "";

  data.solicitacoesAmizade.forEach((solicitacao) => {
    const user = data.usuarios.find((user) => user.id === solicitacao.de);
    const li = document.createElement("li");

    const imgAvatar = document.createElement("img");
    imgAvatar.src = user.avatar;
    imgAvatar.alt = user.username;
    imgAvatar.classList.add("solicitacao-avatar");

    const spanUsername = document.createElement("span");
    spanUsername.textContent = user.username;

    if (solicitacao.para === 1) {
      const btnAceitar = document.createElement("button");
      btnAceitar.textContent = "Aceitar";
      btnAceitar.classList.add("btn-aceitar");
      btnAceitar.addEventListener("click", () => {
        data.amigos.push(user);
        data.solicitacoesAmizade = data.solicitacoesAmizade.filter(
          (s) => s.id !== solicitacao.id
        );
        salvarDadosLocalStorage(data);
        carregarSolicitacoes(data);
      });

      const btnRemover = document.createElement("button");
      btnRemover.textContent = "Remover";
      btnRemover.classList.add("btn-remover");
      btnRemover.addEventListener("click", () => {
        data.solicitacoesAmizade = data.solicitacoesAmizade.filter(
          (s) => s.id !== solicitacao.id
        );
        salvarDadosLocalStorage(data);
        carregarSolicitacoes(data);
      });

      li.appendChild(imgAvatar);
      li.appendChild(spanUsername);
      li.appendChild(btnAceitar);
      li.appendChild(btnRemover);
      pedidosRecebidos.appendChild(li);
    } 
    if (solicitacao.de === 1) {
      const btnRemover = document.createElement("button");
      btnRemover.textContent = "REMOVER";
      btnRemover.classList.add("btn-remover");
      btnRemover.addEventListener("click", () => {
        data.solicitacoesAmizade = data.solicitacoesAmizade.filter(
          (s) => s.id !== solicitacao.id
        );
        salvarDadosLocalStorage(data);
        carregarSolicitacoes(data);
      });

      li.appendChild(imgAvatar);
      li.appendChild(spanUsername);
      li.appendChild(btnRemover);
      pedidosEnviados.appendChild(li);
    }
  });
}

document.addEventListener("DOMContentLoaded", inicializarDados);

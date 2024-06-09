// Define o ID do usuário logado
const userId = 1; // Defina o ID do usuário logado aqui

// Salva o ID do usuário logado no localStorage
localStorage.setItem("userId", userId);

// Recupera o ID do usuário logado do localStorage
const loggedUserId = parseInt(localStorage.getItem("userId"));

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

// Função para carregar as solicitações enviadas
function carregarSolicitacoesEnviadas(data) {
  const pedidosEnviados = document.getElementById("pedidos-enviados");
  pedidosEnviados.innerHTML = "";

  const solicitacoesEnviadas = data.solicitacoesAmizade.filter(
    (solicitacao) => solicitacao.de === loggedUserId
  );
  solicitacoesEnviadas.forEach((solicitacao) => {
    const user = data.usuarios.find((user) => user.id === solicitacao.para);

    if (user) {
      const li = document.createElement("li");
      const imgAvatar = document.createElement("img");
      imgAvatar.src = user.avatar;
      imgAvatar.alt = user.username;
      imgAvatar.classList.add("avatar");
      const spanUsername = document.createElement("span");
      spanUsername.textContent = user.username;

      const divRemoverEnviados = document.createElement("div");
      divRemoverEnviados.classList.add("btn-remover-enviados-container");

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

      divRemoverEnviados.appendChild(btnRemover);

      li.appendChild(imgAvatar);
      li.appendChild(spanUsername);
      li.appendChild(divRemoverEnviados);
      pedidosEnviados.appendChild(li);
    }
  });
}

// Função para carregar as solicitações recebidas
function carregarSolicitacoesRecebidas(data) {
  const pedidosRecebidos = document.getElementById("pedidos-recebidos");
  pedidosRecebidos.innerHTML = "";

  const solicitacoesRecebidas = data.solicitacoesAmizade.filter(
    (solicitacao) => solicitacao.para === loggedUserId
  );
  solicitacoesRecebidas.forEach((solicitacao) => {
    const user = data.usuarios.find((user) => user.id === solicitacao.de);

    if (user) {
      const li = document.createElement("li");
      const imgAvatar = document.createElement("img");
      imgAvatar.src = user.avatar;
      imgAvatar.alt = user.username;
      imgAvatar.classList.add("avatar");
      const spanUsername = document.createElement("span");
      spanUsername.textContent = user.username;

      const divAceitar = document.createElement("div");
      divAceitar.classList.add("btn-aceitar-container");

      const btnAceitar = document.createElement("button");
      btnAceitar.textContent = "ACEITAR";
      btnAceitar.classList.add("btn-aceitar");
      btnAceitar.addEventListener("click", () => {
        const novoAmigo = {
          id:
            data.amigos.length > 0
              ? data.amigos[data.amigos.length - 1].id + 1
              : 1,
          username: user.username,
          avatar: user.avatar,
          status: "offline",
          jogo: "",
          sala: "",
        };
        data.amigos.push(novoAmigo);
        data.solicitacoesAmizade = data.solicitacoesAmizade.filter(
          (s) => s.id !== solicitacao.id
        );
        salvarDadosLocalStorage(data);
        carregarSolicitacoes(data);
      });

      divAceitar.appendChild(btnAceitar);

      const divRemoverRecebidos = document.createElement("div");
      divRemoverRecebidos.classList.add("btn-remover-recebidos-container");

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

      divRemoverRecebidos.appendChild(btnRemover);

      li.appendChild(imgAvatar);
      li.appendChild(spanUsername);
      li.appendChild(divAceitar);
      li.appendChild(divRemoverRecebidos);
      pedidosRecebidos.appendChild(li);
    }
  });
}

// Função para carregar todas as solicitações
function carregarSolicitacoes(data) {
  carregarSolicitacoesEnviadas(data);
  carregarSolicitacoesRecebidas(data);
}

// Função para enviar solicitação de amizade
function enviarSolicitacaoAmizade(destinatarioId) {
  const data = carregarDadosLocalStorage();

  const novaSolicitacao = {
    id: data.solicitacoesAmizade.length + 1, // ID da nova solicitação
    de: loggedUserId, // ID do usuário logado
    para: destinatarioId, // ID do destinatário
    status: "pendente",
  };

  data.solicitacoesAmizade.push(novaSolicitacao);
  salvarDadosLocalStorage(data);
  carregarSolicitacoes(data);
}

document.addEventListener("DOMContentLoaded", inicializarDados);

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
        carregarUsuariosParaPesquisa(data);
      })
      .catch((error) =>
        console.error("Erro ao carregar a base de dados:", error)
      );
  } else {
    carregarUsuariosParaPesquisa(data);
  }
}

// Função para carregar usuários na barra de pesquisa
function carregarUsuariosParaPesquisa(data) {
  const searchBar = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");

  searchBar.addEventListener("input", function () {
    const term = searchBar.value.toLowerCase();
    searchResults.innerHTML = "";

    const filteredUsers = data.usuarios.filter((user) =>
      user.username.toLowerCase().includes(term)
    );

    filteredUsers.forEach((user) => {
      const li = document.createElement("li");

      // Adiciona a imagem do usuário
      const imgAvatar = document.createElement("img");
      imgAvatar.src = user.avatar;
      imgAvatar.alt = user.username;
      li.appendChild(imgAvatar);

      // Adiciona o nome do usuário
      const span = document.createElement("span");
      span.textContent = user.username;

      const button = document.createElement("button");
      button.textContent = "ENVIAR PEDIDO DE AMIZADE";
      button.classList.add("btn-add-friend");
      button.setAttribute("data-id", user.id);
      li.appendChild(span);
      li.appendChild(button);
      searchResults.appendChild(li);
    });
  });

  // Adiciona o evento de click para adicionar amigos
  searchResults.addEventListener("click", function (event) {
    if (event.target.classList.contains("btn-add-friend")) {
      const userId = parseInt(event.target.getAttribute("data-id"));
      const user = data.usuarios.find((user) => user.id === userId);

      if (user) {
        data.amigos.push(user);
        salvarDadosLocalStorage(data);
        alert(`Solicitação de amizade enviada para ${user.username}`);
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", inicializarDados);

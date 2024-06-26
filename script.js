// Captura o elemento <select> e o <span> para mostrar o status selecionado
const statusSelect = document.getElementById("status-select");
const selectedStatus = document.getElementById("selected-status");

// Adiciona um evento de mudança ao elemento <select>
statusSelect.addEventListener("change", function () {
  // Atualiza o texto do <span> com o status selecionado
  selectedStatus.textContent = statusSelect.value;

  // Remove todas as classes de cor anteriores
  selectedStatus.classList.remove("online", "ausente", "offline");

  // Adiciona a classe de cor correspondente com base no valor selecionado
  if (statusSelect.value === "online") {
    selectedStatus.classList.add("online");
  } else if (statusSelect.value === "ausente") {
    selectedStatus.classList.add("ausente");
  } else if (statusSelect.value === "offline") {
    selectedStatus.classList.add("offline");
  }
});

// Função para salvar os dados no localStorage
function salvarDadosLocalStorage(data) {
  localStorage.setItem("amigosData", JSON.stringify(data));
}

// Função para carregar os dados do localStorage
function carregarDadosLocalStorage() {
  const data = localStorage.getItem("amigosData");
  return data ? JSON.parse(data) : { amigos: [] };
}

// Função para carregar dados do JSON e armazenar no localStorage se estiver vazio
function inicializarDados() {
  const data = carregarDadosLocalStorage();
  if (data.amigos.length === 0) {
    fetch("./db.json")
      .then((response) => response.json())
      .then((data) => {
        salvarDadosLocalStorage(data);
        carregarAmigos(data);
      })
      .catch((error) =>
        console.error("Erro ao carregar a base de dados:", error)
      );
  } else {
    carregarAmigos(data);
  }
}

// Função para carregar amigos e atualizar a interface
function carregarAmigos(data) {
  // Referência ao elemento onde queremos adicionar os amigos
  const listaAmigos = document.getElementById("lista-amigos");
  // Referências às seções de amigos online e offline
  const amigosOnline = document.getElementById("amigos-online");
  const amigosOffline = document.getElementById("amigos-offline");

  // Função para atualizar os contadores
  function atualizarContadores() {
    const contadorOnline = document.getElementById("contador-online");
    const contadorOffline = document.getElementById("contador-offline");

    // Atualiza o contador de amigos online
    contadorOnline.textContent =
      "(" + amigosOnline.querySelectorAll(".amigo").length + ")";

    // Atualiza o contador de amigos offline
    contadorOffline.textContent =
      "(" + amigosOffline.querySelectorAll(".amigo").length + ")";
  }

  // Função para criar um elemento de amigo
  function criarElementoAmigo(amigo) {
    // Cria um elemento <div> para representar o amigo
    const divAmigo = document.createElement("div");
    divAmigo.classList.add("amigo");
    divAmigo.dataset.id = amigo.id; // Adiciona o ID do amigo como atributo de dados

    // Adiciona a imagem do avatar ao elemento do amigo
    const imgAvatar = document.createElement("img");
    imgAvatar.src = amigo.avatar;
    imgAvatar.alt = amigo.username;
    divAmigo.appendChild(imgAvatar);

    // Cria um elemento <div> para as informações do amigo
    const divInfo = document.createElement("div");
    divInfo.classList.add("amigo-info");

    // Adiciona o nome do amigo
    const h3Nome = document.createElement("h3");
    h3Nome.textContent = amigo.username;
    divInfo.appendChild(h3Nome);

    // Verifica se o amigo está offline antes de adicionar as informações de jogo e sala
    if (amigo.status !== "offline") {
      // Adiciona o jogo do amigo
      const pJogo = document.createElement("p");
      pJogo.textContent = "Jogando: " + amigo.jogo;
      divInfo.appendChild(pJogo);

      // Adiciona a sala do amigo
      const pSala = document.createElement("p");
      pSala.textContent = "Sala: " + amigo.sala;
      divInfo.appendChild(pSala);
    }

    // Adiciona o botão de remover amigo
    const divBtn = document.createElement("div");
    divBtn.classList.add("btn-remover-amigo-container");

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "REMOVER";
    removeBtn.classList.add("btn-remover-amigo");
    removeBtn.addEventListener("click", function () {
      // Remove o amigo da base de dados
      data.amigos = data.amigos.filter((a) => a.id !== amigo.id);
      // Atualiza a base de dados no localStorage
      salvarDadosLocalStorage(data);
      // Remove o elemento do amigo da interface
      divAmigo.remove();
      // Atualiza os contadores
      atualizarContadores();
    });

    // Adiciona o botão de entrar na sala apenas se o amigo estiver online
    if (amigo.status === "online") {
      const entrarSalaBtn = document.createElement("button");
      entrarSalaBtn.textContent = "ENTRAR NA SALA";
      entrarSalaBtn.classList.add("btn-entrar-sala");
      // Por enquanto, o botão não terá funcionalidade
      entrarSalaBtn.addEventListener("click", function () {
        // Futuramente, adicionaremos a funcionalidade aqui
        console.log(`Entrar na sala de ${amigo.username}`);
      });
      divBtn.appendChild(entrarSalaBtn);
    }

    divBtn.appendChild(removeBtn);

    // Adiciona os botões ao elemento <div>
    divAmigo.appendChild(divInfo);
    divAmigo.appendChild(divBtn);

    return divAmigo;
  }

  // Função para adicionar amigo
  function adicionarAmigo(amigo) {
    const elementoAmigo = criarElementoAmigo(amigo);
    if (amigo.status === "online") {
      amigosOnline.appendChild(elementoAmigo);
    } else {
      amigosOffline.appendChild(elementoAmigo);
    }
  }

  // Loop pelos amigos e adiciona-os à lista
  data.amigos.forEach(adicionarAmigo);

  // Barra de pesquisa
  const searchBar = document.getElementById("search-input");

  searchBar.addEventListener("input", function () {
    const term = searchBar.value.toLowerCase();
    const amigosElements = document.querySelectorAll(".amigo-info h3");

    amigosElements.forEach(function (amigoElement) {
      const amigoNome = amigoElement.textContent.toLowerCase();
      const amigoParent = amigoElement.parentElement.parentElement;

      if (amigoNome.includes(term)) {
        amigoParent.style.display = "flex";
      } else {
        amigoParent.style.display = "none";
      }
    });
  });

  // Atualiza os contadores inicialmente
  atualizarContadores();
}

// Inicializar os dados ao carregar a página
document.addEventListener("DOMContentLoaded", inicializarDados);

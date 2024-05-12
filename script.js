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

// Array de amigos
const amigos = [
  {
    id: 1,
    username: "João",
    avatar: "imgs/amigo1.png",
    status: "online",
    jogo: "Valorant",
    sala: "1",
  },
  {
    id: 2,
    username: "Rian",
    avatar: "imgs/amigo2.png",
    status: "offline",
  },
  {
    id: 3,
    username: "Luan",
    avatar: "imgs/amigo3.png",
    status: "offline",
  },
  // Adicione mais amigos conforme necessário
];

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
  contadorOnline.textContent = '(' + amigosOnline.querySelectorAll(".amigo").length + ')';

  // Atualiza o contador de amigos offline
  contadorOffline.textContent = '(' + amigosOffline.querySelectorAll(".amigo").length + ')'; 
}

// Loop pelos amigos e cria um elemento para cada um
amigos.forEach(function(amigo) {
  // Cria um elemento <div> para representar o amigo
  const divAmigo = document.createElement('div');
  divAmigo.classList.add('amigo');

  // Adiciona a imagem do avatar ao elemento do amigo
  const imgAvatar = document.createElement('img');
  imgAvatar.src = amigo.avatar;
  imgAvatar.alt = amigo.username;
  divAmigo.appendChild(imgAvatar);

  // Cria um elemento <div> para as informações do amigo
  const divInfo = document.createElement('div');
  divInfo.classList.add('amigo-info');
  
  // Adiciona o nome do amigo
  const h3Nome = document.createElement('h3');
  h3Nome.textContent = amigo.username;
  divInfo.appendChild(h3Nome);

  // Verifica se o amigo está offline antes de adicionar as informações de jogo e sala
  if (amigo.status !== "offline") {
    // Adiciona o jogo do amigo
    const pJogo = document.createElement('p');
    pJogo.textContent = "Jogo: " + amigo.jogo;
    divInfo.appendChild(pJogo);

    // Adiciona a sala do amigo
    const pSala = document.createElement('p');
    pSala.textContent = "Sala: " + amigo.sala;
    divInfo.appendChild(pSala);
  }

  // Adiciona as informações do amigo ao elemento <div>
  divAmigo.appendChild(divInfo);

  // Adiciona o elemento do amigo à seção apropriada com base no status
  if (amigo.status === "online") {
    amigosOnline.appendChild(divAmigo);
  } else {
    amigosOffline.appendChild(divAmigo);
  }

  // Atualiza os contadores
  atualizarContadores();
});
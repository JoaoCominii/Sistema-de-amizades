// Captura o elemento <select> e o <span> para mostrar o status selecionado
const statusSelect = document.getElementById('status-select');
const selectedStatus = document.getElementById('selected-status');

// Adiciona um evento de mudança ao elemento <select>
statusSelect.addEventListener('change', function() {
  // Atualiza o texto do <span> com o status selecionado
  selectedStatus.textContent = statusSelect.value;
  
  // Remove todas as classes de cor anteriores
  selectedStatus.classList.remove('online', 'ausente', 'offline');
  
  // Adiciona a classe de cor correspondente com base no valor selecionado
  if (statusSelect.value === 'online') {
    selectedStatus.classList.add('online');
  } else if (statusSelect.value === 'ausente') {
    selectedStatus.classList.add('ausente');
  } else if (statusSelect.value === 'offline') {
    selectedStatus.classList.add('offline');
  }
});

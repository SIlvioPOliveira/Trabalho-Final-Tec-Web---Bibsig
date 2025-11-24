// URLs base para os endpoints da API (Spring Boot)
// Use '/livros' se o frontend estiver sendo servido pelo Spring Boot ou houver um proxy.
// Se estiver executando o HTML em um servidor separado, mude para 'http://localhost:8080/livros'.
const API_URL = '/livros';

// Seleção de elementos do DOM
const livroForm = document.getElementById('livroForm');
const livroIdInput = document.getElementById('livroId');
const autorInput = document.getElementById('autor');
const tituloInput = document.getElementById('titulo');
const anoInput = document.getElementById('ano');
const editoraInput = document.getElementById('editora');
const paginasInput = document.getElementById('paginas');
const generoInput = document.getElementById('genero');
const disponivelInput = document.getElementById('disponivel');

const saveBtn = document.getElementById('saveBtn');
const getAllLivrosBtn = document.getElementById('getAllLivrosBtn');
const clearBtn = document.getElementById('clearBtn');
const livrosTableBody = document.querySelector('#livrosTable tbody');

// Variável para armazenar a lista de livros (útil para edição sem re-fetch)
let livrosCadastrados = [];

// --- FUNÇÃO AUXILIAR PARA LIMPAR O FORMULÁRIO ---
function clearForm() {
    livroForm.reset();
    livroIdInput.value = '';
    saveBtn.textContent = 'Salvar Livro';
    disponivelInput.placeholder = 'Digite a disponibilidade (true ou false)';
}

// Listener para o botão de Limpar
if (clearBtn) {
    clearBtn.addEventListener('click', clearForm);
}

// --- FUNÇÃO PARA POPULAR O FORMULÁRIO COM DADOS DE UM LIVRO (EDITAR) ---
function loadLivroForEdit(id) {
    const livro = livrosCadastrados.find(l => l.id === id);
    if (livro) {
        livroIdInput.value = livro.id;
        autorInput.value = livro.autor;
        tituloInput.value = livro.titulo;
        anoInput.value = livro.ano;
        editoraInput.value = livro.editora;
        paginasInput.value = livro.paginas;
        generoInput.value = livro.genero;
        // O input de texto deve receber a string 'true' ou 'false'
        disponivelInput.value = livro.disponivel.toString(); 
        saveBtn.textContent = 'Atualizar Livro';

        // Rolagem suave para o formulário
        livroForm.scrollIntoView({ behavior: 'smooth' });
    }
}

// --- FUNÇÃO PARA DELETAR UM LIVRO (DELETE /livros/delete/{id}) ---
function deleteLivro(id) {
    if (!confirm(`Tem certeza que deseja deletar o Livro com ID ${id}?`)) {
        return;
    }

    fetch(`${API_URL}/delete/${id}`, {
        method: 'DELETE',
    })
    .then(response => response.text()) // O controller retorna uma string de texto
    .then(message => {
        alert(message);
        refreshLivros(); // Recarrega a lista após a exclusão
        clearForm();
    })
    .catch(error => {
        console.error('Erro ao deletar livro:', error);
        alert('Erro ao deletar livro. Verifique o console para detalhes.');
    });
}

// --- FUNÇÃO PARA CARREGAR/ATUALIZAR A TABELA DE LIVROS (GET /livros/all) ---
function refreshLivros() {
    // Envia uma requisição GET para obter todos os livros
    fetch(`${API_URL}/all`)
    .then(response => response.json())
    .then(livros => {
        // Armazena a lista de livros
        livrosCadastrados = livros;
        
        livrosTableBody.innerHTML = '';

        if (livros.length === 0) {
             const row = document.createElement('tr');
             // Colspan ajustado para 9
             row.innerHTML = `<td colspan="9" class="empty-state"><p>Nenhum Livro cadastrado.</p></td>`;
             livrosTableBody.appendChild(row);
             return;
        }

        // Renderiza cada livro na tabela
        livros.forEach(livro => {
            const row = document.createElement('tr');
            
            // Renderização da disponibilidade com Badge
            const dispText = livro.disponivel ? 
                `<span class="badge" style="background: var(--success); color: white;">Sim</span>` : 
                `<span class="badge" style="background: var(--danger); color: white;">Não</span>`;

            row.innerHTML = `
                <td>${livro.id}</td>
                <td>${livro.autor}</td>
                <td>${livro.titulo}</td>
                <td>${livro.ano}</td>
                <td>${livro.editora}</td>
                <td>${livro.paginas}</td>
                <td>${livro.genero}</td>
                <td>${dispText}</td>
                <td class="actions">
                    <button class="btn-success btn-edit" data-id="${livro.id}">Editar</button>
                    <button class="btn-danger btn-delete" data-id="${livro.id}">Excluir</button>
                </td>
            `;

            livrosTableBody.appendChild(row);
        });

        // Adiciona listeners aos botões gerados dinamicamente
        document.querySelectorAll('.btn-edit').forEach(button => {
            // Usa parseInt para garantir que o ID seja um número
            button.addEventListener('click', (e) => loadLivroForEdit(parseInt(e.target.dataset.id)));
        });

        document.querySelectorAll('.btn-delete').forEach(button => {
            // Usa parseInt para garantir que o ID seja um número
            button.addEventListener('click', (e) => deleteLivro(parseInt(e.target.dataset.id)));
        });
    })
    .catch(error => {
        console.error('Erro ao carregar livros:', error);
        livrosTableBody.innerHTML = `<tr><td colspan="9" class="empty-state" style="color: var(--danger);">Erro ao carregar livros. Verifique se o backend Spring Boot está rodando.</td></tr>`;
    });
}

// Listener para o botão 'Carregar Livros'
getAllLivrosBtn.addEventListener('click', refreshLivros);


// --- FUNÇÃO PARA ENVIAR O FORMULÁRIO (POST /add ou PUT /update/{id}) ---
livroForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const id = livroIdInput.value;
    const isUpdate = !!id; // Se 'id' não for vazio, é uma atualização
    
    // Constrói os dados do formulário como URLSearchParams (necessário para @RequestParam)
    const formData = new URLSearchParams();
    
    // Anexa todos os campos
    formData.append('titulo', tituloInput.value);
    formData.append('autor', autorInput.value);
    formData.append('ano', anoInput.value); // Enviado como String, Spring Boot converte para Integer
    formData.append('editora', editoraInput.value);
    formData.append('paginas', paginasInput.value); // Enviado como String, Spring Boot converte para Integer
    formData.append('genero', generoInput.value);
    
    // Validação básica para 'disponivel' (deve ser 'true' ou 'false')
    const disponivelValue = disponivelInput.value.toLowerCase();
    if (disponivelValue !== 'true' && disponivelValue !== 'false') {
         alert('O campo "Disponibilidade" deve ser preenchido com "true" ou "false".');
         return;
    }
    formData.append('disponivel', disponivelValue);
    
    // Define URL e Método
    let url = isUpdate ? `${API_URL}/update/${id}` : `${API_URL}/add`;
    let method = isUpdate ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: {
            // O Content-Type é crucial para @RequestParam funcionar corretamente
            'Content-Type': 'application/x-www-form-urlencoded', 
        },
        body: formData.toString(),
    })
    .then(response => {
        if (!response.ok) {
            // Se o status HTTP não for sucesso (ex: 404, 500)
            throw new Error(`Erro na requisição. Status: ${response.status}. Mensagem: ${response.statusText}`);
        }
        return response.json(); // O controller retorna o objeto Livro salvo/atualizado
    })
    .then(data => {
        const message = isUpdate ? 
            `Livro com ID ${data.id} atualizado com sucesso!` : 
            `Livro '${data.titulo}' adicionado com sucesso!`;
            
        alert(message); 
        clearForm(); 
        refreshLivros(); // Recarrega a lista
    })
    .catch(error => {
        console.error('Erro ao salvar/atualizar livro:', error);
        alert(`Ocorreu um erro: ${error.message}. Verifique os dados e se o seu servidor Spring Boot está rodando corretamente (e se a porta está configurada).`);
    });
});
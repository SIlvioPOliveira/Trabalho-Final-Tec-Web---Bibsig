package com.bibsig;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

// para acessar via http com os arquivos Front-end fora da pasta do projeto
@CrossOrigin(origins = "*") // Permite requisições de qualquer origem [cite: 49]


@Controller	// Esta classe é um Controller
@RequestMapping(path="/livros") // URL's começarão com /livros
public class LivroController {
    
    // Injeta o Repositório que criamos para Livro
	@Autowired
	private LivroRepository livroRepository;

    // --- 1. POST /add (CRIAR/INSERIR) ---
    // Endpoint: /livros/add
    @PostMapping(path="/add") 
	public @ResponseBody Livro addNewLivro (@RequestParam String titulo, 
                                            @RequestParam String autor,
                                            @RequestParam Integer ano,
                                            @RequestParam String editora,
                                            @RequestParam Integer paginas,
                                            @RequestParam String genero,
                                            @RequestParam Boolean disponivel) {

        Livro novoLivro = new Livro();
		novoLivro.setTitulo(titulo);
        novoLivro.setAutor(autor);
        novoLivro.setAno(ano);
        novoLivro.setEditora(editora);
        novoLivro.setPaginas(paginas);
        novoLivro.setGenero(genero);
        novoLivro.setDisponivel(disponivel);

		// Salva o novo livro no banco de dados
		livroRepository.save(novoLivro);
		
        // Retorna o objeto Livro salvo (ou poderia retornar uma mensagem de sucesso)
        return novoLivro; 
	}

    // --- 2. GET /all (LER/LISTAR TODOS) ---
    // Endpoint: /livros/all [cite: 45]
    @GetMapping(path="/all")
	public @ResponseBody Iterable<Livro> getAllLivros() {
		// Retorna um JSON/XML com todos os livros
		return livroRepository.findAll();
	}
    
    // --- 3. PUT /update/{id} (ATUALIZAR) ---
    // Endpoint: /livros/update/1 [cite: 47]
    @PutMapping(path="/update/{id}")
    public @ResponseBody Livro updateLivro(@PathVariable Integer id,
                                           @RequestParam String titulo, 
                                           @RequestParam String autor,
                                           @RequestParam Integer ano,
                                           @RequestParam String editora,
                                           @RequestParam Integer paginas,
                                           @RequestParam String genero,
                                           @RequestParam Boolean disponivel) {

        // Busca o livro existente pelo ID
        Optional<Livro> livroOptional = livroRepository.findById(id);

        if (livroOptional.isPresent()) {
            Livro livro = livroOptional.get();
            
            // Atualiza os dados
            livro.setTitulo(titulo);
            livro.setAutor(autor);
            livro.setAno(ano);
            livro.setEditora(editora);
            livro.setPaginas(paginas);
            livro.setGenero(genero);
            livro.setDisponivel(disponivel);

            // Salva o livro atualizado no banco
            return livroRepository.save(livro);
        } else {
            // Lança uma exceção ou retorna um erro apropriado
            throw new RuntimeException("Livro não encontrado com o ID: " + id);
        }
    }

    // --- 4. DELETE /delete/{id} (DELETAR) ---
    // Endpoint: /livros/delete/1 [cite: 48]
    @DeleteMapping(path="/delete/{id}")
    public @ResponseBody String deleteLivro(@PathVariable Integer id) {
        
        if (livroRepository.existsById(id)) {
            livroRepository.deleteById(id);
            return "Livro com ID " + id + " deletado com sucesso.";
        } else {
            return "Erro: Livro com ID " + id + " não encontrado.";
        }
    }
}
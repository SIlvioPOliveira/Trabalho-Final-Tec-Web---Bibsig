package com.bibsig;

import org.springframework.data.repository.CrudRepository;

// Este Repositório será automaticamente implementado pelo Spring em um Bean chamado userRepository.
// O CrudRepository fornece todas as operações de CRUD.

public interface LivroRepository extends CrudRepository<Livro, Integer> {
    // Não precisa de código aqui, o Spring Data JPA cuida de tudo!
}
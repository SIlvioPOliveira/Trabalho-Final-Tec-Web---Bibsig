package com.bibsig;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity // Indica que esta classe é uma entidade JPA e deve ser mapeada para uma tabela
public class Livro {
    
    // --- Atributos conforme o tema Biblioteca ---
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    // Garante que o ID é a chave primária e é autoincrementado no banco
    private Integer id;

    private String titulo; 
    private String autor; 
    private Integer ano; 
    private String editora; 
    private Integer paginas; 
    private String genero; // <-- CORRIGIDO para 'genero'
    
    private boolean disponivel; 

    // Construtor vazio (default)
    public Livro() {
    }

    // --- Métodos Getters e Setters Corretos ---

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getAutor() {
        return autor; 
    }

    public void setAutor(String autor) {
        this.autor = autor;
    }

    public Integer getAno() {
        return ano;
    }

    public void setAno(Integer ano) {
        this.ano = ano;
    }

    public String getEditora() {
        return editora;
    }

    public void setEditora(String editora) {
        this.editora = editora;
    }

    public Integer getPaginas() {
        return paginas;
    }

    public void setPaginas(Integer paginas) {
        this.paginas = paginas;
    }

    // GETTER para 'genero'
    public String getGenero() { 
        return genero;
    }

    // SETTER para 'genero'
    public void setGenero(String genero) { 
        this.genero = genero;
    }

    public boolean isDisponivel() { 
        return disponivel;
    }

    public void setDisponivel(boolean disponivel) {
        this.disponivel = disponivel;
    }
}
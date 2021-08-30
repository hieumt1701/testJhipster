package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Book.
 */
@Entity
@Table(name = "book")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Book implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "tilte")
    private String tilte;

    @Column(name = "des")
    private String des;

    @Lob
    @Column(name = "image")
    private byte[] image;

    @Column(name = "image_content_type")
    private String imageContentType;

    @Column(name = "dob")
    private Instant dob;

    @Lob
    @Column(name = "cv")
    private byte[] cv;

    @Column(name = "cv_content_type")
    private String cvContentType;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JoinTable(
        name = "rel_book__type_book",
        joinColumns = @JoinColumn(name = "book_id"),
        inverseJoinColumns = @JoinColumn(name = "type_book_id")
    )
    @JsonIgnoreProperties(value = { "books" }, allowSetters = true)
    private Set<TypeBook> typeBooks = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "books" }, allowSetters = true)
    private Author author;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Book id(Long id) {
        this.id = id;
        return this;
    }

    public String getTilte() {
        return this.tilte;
    }

    public Book tilte(String tilte) {
        this.tilte = tilte;
        return this;
    }

    public void setTilte(String tilte) {
        this.tilte = tilte;
    }

    public String getDes() {
        return this.des;
    }

    public Book des(String des) {
        this.des = des;
        return this;
    }

    public void setDes(String des) {
        this.des = des;
    }

    public byte[] getImage() {
        return this.image;
    }

    public Book image(byte[] image) {
        this.image = image;
        return this;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageContentType() {
        return this.imageContentType;
    }

    public Book imageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
        return this;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public Instant getDob() {
        return this.dob;
    }

    public Book dob(Instant dob) {
        this.dob = dob;
        return this;
    }

    public void setDob(Instant dob) {
        this.dob = dob;
    }

    public byte[] getCv() {
        return this.cv;
    }

    public Book cv(byte[] cv) {
        this.cv = cv;
        return this;
    }

    public void setCv(byte[] cv) {
        this.cv = cv;
    }

    public String getCvContentType() {
        return this.cvContentType;
    }

    public Book cvContentType(String cvContentType) {
        this.cvContentType = cvContentType;
        return this;
    }

    public void setCvContentType(String cvContentType) {
        this.cvContentType = cvContentType;
    }

    public Set<TypeBook> getTypeBooks() {
        return this.typeBooks;
    }

    public Book typeBooks(Set<TypeBook> typeBooks) {
        this.setTypeBooks(typeBooks);
        return this;
    }

    public Book addTypeBook(TypeBook typeBook) {
        this.typeBooks.add(typeBook);
        typeBook.getBooks().add(this);
        return this;
    }

    public Book removeTypeBook(TypeBook typeBook) {
        this.typeBooks.remove(typeBook);
        typeBook.getBooks().remove(this);
        return this;
    }

    public void setTypeBooks(Set<TypeBook> typeBooks) {
        this.typeBooks = typeBooks;
    }

    public Author getAuthor() {
        return this.author;
    }

    public Book author(Author author) {
        this.setAuthor(author);
        return this;
    }

    public void setAuthor(Author author) {
        this.author = author;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Book)) {
            return false;
        }
        return id != null && id.equals(((Book) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Book{" +
            "id=" + getId() +
            ", tilte='" + getTilte() + "'" +
            ", des='" + getDes() + "'" +
            ", image='" + getImage() + "'" +
            ", imageContentType='" + getImageContentType() + "'" +
            ", dob='" + getDob() + "'" +
            ", cv='" + getCv() + "'" +
            ", cvContentType='" + getCvContentType() + "'" +
            "}";
    }
}

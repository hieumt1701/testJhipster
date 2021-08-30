package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.TypeBook;
import com.mycompany.myapp.repository.TypeBookRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.TypeBook}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TypeBookResource {

    private final Logger log = LoggerFactory.getLogger(TypeBookResource.class);

    private static final String ENTITY_NAME = "typeBook";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TypeBookRepository typeBookRepository;

    public TypeBookResource(TypeBookRepository typeBookRepository) {
        this.typeBookRepository = typeBookRepository;
    }

    /**
     * {@code POST  /type-books} : Create a new typeBook.
     *
     * @param typeBook the typeBook to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new typeBook, or with status {@code 400 (Bad Request)} if the typeBook has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/type-books")
    public ResponseEntity<TypeBook> createTypeBook(@RequestBody TypeBook typeBook) throws URISyntaxException {
        log.debug("REST request to save TypeBook : {}", typeBook);
        if (typeBook.getId() != null) {
            throw new BadRequestAlertException("A new typeBook cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TypeBook result = typeBookRepository.save(typeBook);
        return ResponseEntity
            .created(new URI("/api/type-books/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /type-books/:id} : Updates an existing typeBook.
     *
     * @param id the id of the typeBook to save.
     * @param typeBook the typeBook to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated typeBook,
     * or with status {@code 400 (Bad Request)} if the typeBook is not valid,
     * or with status {@code 500 (Internal Server Error)} if the typeBook couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/type-books/{id}")
    public ResponseEntity<TypeBook> updateTypeBook(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TypeBook typeBook
    ) throws URISyntaxException {
        log.debug("REST request to update TypeBook : {}, {}", id, typeBook);
        if (typeBook.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, typeBook.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!typeBookRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TypeBook result = typeBookRepository.save(typeBook);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, typeBook.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /type-books/:id} : Partial updates given fields of an existing typeBook, field will ignore if it is null
     *
     * @param id the id of the typeBook to save.
     * @param typeBook the typeBook to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated typeBook,
     * or with status {@code 400 (Bad Request)} if the typeBook is not valid,
     * or with status {@code 404 (Not Found)} if the typeBook is not found,
     * or with status {@code 500 (Internal Server Error)} if the typeBook couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/type-books/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<TypeBook> partialUpdateTypeBook(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TypeBook typeBook
    ) throws URISyntaxException {
        log.debug("REST request to partial update TypeBook partially : {}, {}", id, typeBook);
        if (typeBook.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, typeBook.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!typeBookRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TypeBook> result = typeBookRepository
            .findById(typeBook.getId())
            .map(
                existingTypeBook -> {
                    if (typeBook.getName() != null) {
                        existingTypeBook.setName(typeBook.getName());
                    }

                    return existingTypeBook;
                }
            )
            .map(typeBookRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, typeBook.getId().toString())
        );
    }

    /**
     * {@code GET  /type-books} : get all the typeBooks.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of typeBooks in body.
     */
    @GetMapping("/type-books")
    public List<TypeBook> getAllTypeBooks() {
        log.debug("REST request to get all TypeBooks");
        return typeBookRepository.findAll();
    }

    /**
     * {@code GET  /type-books/:id} : get the "id" typeBook.
     *
     * @param id the id of the typeBook to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the typeBook, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/type-books/{id}")
    public ResponseEntity<TypeBook> getTypeBook(@PathVariable Long id) {
        log.debug("REST request to get TypeBook : {}", id);
        Optional<TypeBook> typeBook = typeBookRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(typeBook);
    }

    /**
     * {@code DELETE  /type-books/:id} : delete the "id" typeBook.
     *
     * @param id the id of the typeBook to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/type-books/{id}")
    public ResponseEntity<Void> deleteTypeBook(@PathVariable Long id) {
        log.debug("REST request to delete TypeBook : {}", id);
        typeBookRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.TypeBook;
import com.mycompany.myapp.repository.TypeBookRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link TypeBookResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TypeBookResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/type-books";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TypeBookRepository typeBookRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTypeBookMockMvc;

    private TypeBook typeBook;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TypeBook createEntity(EntityManager em) {
        TypeBook typeBook = new TypeBook().name(DEFAULT_NAME);
        return typeBook;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TypeBook createUpdatedEntity(EntityManager em) {
        TypeBook typeBook = new TypeBook().name(UPDATED_NAME);
        return typeBook;
    }

    @BeforeEach
    public void initTest() {
        typeBook = createEntity(em);
    }

    @Test
    @Transactional
    void createTypeBook() throws Exception {
        int databaseSizeBeforeCreate = typeBookRepository.findAll().size();
        // Create the TypeBook
        restTypeBookMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(typeBook)))
            .andExpect(status().isCreated());

        // Validate the TypeBook in the database
        List<TypeBook> typeBookList = typeBookRepository.findAll();
        assertThat(typeBookList).hasSize(databaseSizeBeforeCreate + 1);
        TypeBook testTypeBook = typeBookList.get(typeBookList.size() - 1);
        assertThat(testTypeBook.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createTypeBookWithExistingId() throws Exception {
        // Create the TypeBook with an existing ID
        typeBook.setId(1L);

        int databaseSizeBeforeCreate = typeBookRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTypeBookMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(typeBook)))
            .andExpect(status().isBadRequest());

        // Validate the TypeBook in the database
        List<TypeBook> typeBookList = typeBookRepository.findAll();
        assertThat(typeBookList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTypeBooks() throws Exception {
        // Initialize the database
        typeBookRepository.saveAndFlush(typeBook);

        // Get all the typeBookList
        restTypeBookMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(typeBook.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getTypeBook() throws Exception {
        // Initialize the database
        typeBookRepository.saveAndFlush(typeBook);

        // Get the typeBook
        restTypeBookMockMvc
            .perform(get(ENTITY_API_URL_ID, typeBook.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(typeBook.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingTypeBook() throws Exception {
        // Get the typeBook
        restTypeBookMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTypeBook() throws Exception {
        // Initialize the database
        typeBookRepository.saveAndFlush(typeBook);

        int databaseSizeBeforeUpdate = typeBookRepository.findAll().size();

        // Update the typeBook
        TypeBook updatedTypeBook = typeBookRepository.findById(typeBook.getId()).get();
        // Disconnect from session so that the updates on updatedTypeBook are not directly saved in db
        em.detach(updatedTypeBook);
        updatedTypeBook.name(UPDATED_NAME);

        restTypeBookMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTypeBook.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTypeBook))
            )
            .andExpect(status().isOk());

        // Validate the TypeBook in the database
        List<TypeBook> typeBookList = typeBookRepository.findAll();
        assertThat(typeBookList).hasSize(databaseSizeBeforeUpdate);
        TypeBook testTypeBook = typeBookList.get(typeBookList.size() - 1);
        assertThat(testTypeBook.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingTypeBook() throws Exception {
        int databaseSizeBeforeUpdate = typeBookRepository.findAll().size();
        typeBook.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTypeBookMockMvc
            .perform(
                put(ENTITY_API_URL_ID, typeBook.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(typeBook))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeBook in the database
        List<TypeBook> typeBookList = typeBookRepository.findAll();
        assertThat(typeBookList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTypeBook() throws Exception {
        int databaseSizeBeforeUpdate = typeBookRepository.findAll().size();
        typeBook.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeBookMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(typeBook))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeBook in the database
        List<TypeBook> typeBookList = typeBookRepository.findAll();
        assertThat(typeBookList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTypeBook() throws Exception {
        int databaseSizeBeforeUpdate = typeBookRepository.findAll().size();
        typeBook.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeBookMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(typeBook)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TypeBook in the database
        List<TypeBook> typeBookList = typeBookRepository.findAll();
        assertThat(typeBookList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTypeBookWithPatch() throws Exception {
        // Initialize the database
        typeBookRepository.saveAndFlush(typeBook);

        int databaseSizeBeforeUpdate = typeBookRepository.findAll().size();

        // Update the typeBook using partial update
        TypeBook partialUpdatedTypeBook = new TypeBook();
        partialUpdatedTypeBook.setId(typeBook.getId());

        partialUpdatedTypeBook.name(UPDATED_NAME);

        restTypeBookMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTypeBook.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTypeBook))
            )
            .andExpect(status().isOk());

        // Validate the TypeBook in the database
        List<TypeBook> typeBookList = typeBookRepository.findAll();
        assertThat(typeBookList).hasSize(databaseSizeBeforeUpdate);
        TypeBook testTypeBook = typeBookList.get(typeBookList.size() - 1);
        assertThat(testTypeBook.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void fullUpdateTypeBookWithPatch() throws Exception {
        // Initialize the database
        typeBookRepository.saveAndFlush(typeBook);

        int databaseSizeBeforeUpdate = typeBookRepository.findAll().size();

        // Update the typeBook using partial update
        TypeBook partialUpdatedTypeBook = new TypeBook();
        partialUpdatedTypeBook.setId(typeBook.getId());

        partialUpdatedTypeBook.name(UPDATED_NAME);

        restTypeBookMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTypeBook.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTypeBook))
            )
            .andExpect(status().isOk());

        // Validate the TypeBook in the database
        List<TypeBook> typeBookList = typeBookRepository.findAll();
        assertThat(typeBookList).hasSize(databaseSizeBeforeUpdate);
        TypeBook testTypeBook = typeBookList.get(typeBookList.size() - 1);
        assertThat(testTypeBook.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingTypeBook() throws Exception {
        int databaseSizeBeforeUpdate = typeBookRepository.findAll().size();
        typeBook.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTypeBookMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, typeBook.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(typeBook))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeBook in the database
        List<TypeBook> typeBookList = typeBookRepository.findAll();
        assertThat(typeBookList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTypeBook() throws Exception {
        int databaseSizeBeforeUpdate = typeBookRepository.findAll().size();
        typeBook.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeBookMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(typeBook))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeBook in the database
        List<TypeBook> typeBookList = typeBookRepository.findAll();
        assertThat(typeBookList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTypeBook() throws Exception {
        int databaseSizeBeforeUpdate = typeBookRepository.findAll().size();
        typeBook.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeBookMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(typeBook)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TypeBook in the database
        List<TypeBook> typeBookList = typeBookRepository.findAll();
        assertThat(typeBookList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTypeBook() throws Exception {
        // Initialize the database
        typeBookRepository.saveAndFlush(typeBook);

        int databaseSizeBeforeDelete = typeBookRepository.findAll().size();

        // Delete the typeBook
        restTypeBookMockMvc
            .perform(delete(ENTITY_API_URL_ID, typeBook.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TypeBook> typeBookList = typeBookRepository.findAll();
        assertThat(typeBookList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

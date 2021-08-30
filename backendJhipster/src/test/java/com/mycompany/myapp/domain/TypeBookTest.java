package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TypeBookTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TypeBook.class);
        TypeBook typeBook1 = new TypeBook();
        typeBook1.setId(1L);
        TypeBook typeBook2 = new TypeBook();
        typeBook2.setId(typeBook1.getId());
        assertThat(typeBook1).isEqualTo(typeBook2);
        typeBook2.setId(2L);
        assertThat(typeBook1).isNotEqualTo(typeBook2);
        typeBook1.setId(null);
        assertThat(typeBook1).isNotEqualTo(typeBook2);
    }
}

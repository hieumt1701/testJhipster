package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.TypeBook;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the TypeBook entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TypeBookRepository extends JpaRepository<TypeBook, Long> {}

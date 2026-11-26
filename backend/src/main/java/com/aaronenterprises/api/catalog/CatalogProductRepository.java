package com.aaronenterprises.api.catalog;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CatalogProductRepository
    extends JpaRepository<CatalogProduct, UUID>, CatalogProductRepositoryCustom {

    Optional<CatalogProduct> findBySlugAndPublishedTrue(String slug);
}

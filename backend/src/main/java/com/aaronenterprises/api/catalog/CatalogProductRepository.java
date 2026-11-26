package com.aaronenterprises.api.catalog;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CatalogProductRepository extends JpaRepository<CatalogProduct, UUID> {

    Optional<CatalogProduct> findBySlugAndPublishedTrue(String slug);

    @Query("""
        select product from CatalogProduct product
        where product.published = true
          and (:category is null or product.category = :category)
          and (:prefix is null
            or lower(product.name) like lower(concat(:prefix, '%'))
            or lower(product.brand) like lower(concat(:prefix, '%'))
            or lower(product.sku) like lower(concat(:prefix, '%')))
          and (:afterCreatedAt is null
            or product.createdAt < :afterCreatedAt
            or (product.createdAt = :afterCreatedAt and product.id < :afterId))
        order by product.createdAt desc, product.id desc
        """)
    List<CatalogProduct> findCatalog(
        @Param("category") String category,
        @Param("prefix") String prefix,
        @Param("afterCreatedAt") Instant afterCreatedAt,
        @Param("afterId") UUID afterId,
        Pageable pageable
    );
}

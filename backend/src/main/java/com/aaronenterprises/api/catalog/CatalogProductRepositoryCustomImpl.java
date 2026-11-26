package com.aaronenterprises.api.catalog;

import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.stereotype.Repository;

@Repository
class CatalogProductRepositoryCustomImpl implements CatalogProductRepositoryCustom {

    private final EntityManager entityManager;

    CatalogProductRepositoryCustomImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public List<CatalogProduct> findCatalog(String category, String prefix, CatalogCursor position, int limit) {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<CatalogProduct> query = builder.createQuery(CatalogProduct.class);
        Root<CatalogProduct> product = query.from(CatalogProduct.class);
        List<Predicate> filters = new ArrayList<>();

        filters.add(builder.isTrue(product.get("published")));
        if (category != null) {
            filters.add(builder.equal(product.get("category"), category));
        }
        if (prefix != null) {
            String pattern = escapeLike(prefix.toLowerCase(Locale.ROOT)) + "%";
            filters.add(builder.or(
                builder.like(builder.lower(product.get("name")), pattern, '\\'),
                builder.like(builder.lower(product.get("brand")), pattern, '\\'),
                builder.like(builder.lower(product.get("sku")), pattern, '\\')
            ));
        }
        if (position != null) {
            var createdAt = product.<Instant>get("createdAt");
            var id = product.<UUID>get("id");
            filters.add(builder.or(
                builder.lessThan(createdAt, position.createdAt()),
                builder.and(
                    builder.equal(createdAt, position.createdAt()),
                    builder.lessThan(id, position.id())
                )
            ));
        }

        query.select(product)
            .where(builder.and(filters.toArray(Predicate[]::new)))
            .orderBy(builder.desc(product.<Instant>get("createdAt")), builder.desc(product.<UUID>get("id")));
        return entityManager.createQuery(query).setMaxResults(limit).getResultList();
    }

    private static String escapeLike(String value) {
        return value.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
    }
}

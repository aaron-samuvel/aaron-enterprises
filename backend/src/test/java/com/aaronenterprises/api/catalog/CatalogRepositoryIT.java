package com.aaronenterprises.api.catalog;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

@Testcontainers
@SpringBootTest
class CatalogRepositoryIT {

    @Container
    static final PostgreSQLContainer POSTGRES = new PostgreSQLContainer("postgres:17-alpine");

    @DynamicPropertySource
    static void databaseProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
    }

    @Autowired
    JdbcTemplate jdbc;

    @Autowired
    CatalogService catalog;

    @BeforeEach
    void clearProducts() {
        jdbc.update("DELETE FROM catalog_products");
    }

    @Test
    void migrationsAndPrefixSearchSupportStableCursorPages() {
        insert("bearing-a", "BEAR-001", "Bearing Alpha", "SKF", "Bearings", true, "2026-11-20T10:00:00Z");
        insert("bearing-b", "BEAR-002", "Bearing Beta", "SKF", "Bearings", true, "2026-11-21T10:00:00Z");
        insert("hidden-bearing", "BEAR-003", "Bearing Hidden", "SKF", "Bearings", false, "2026-11-22T10:00:00Z");

        CatalogPageResponse first = catalog.browse("bear", "Bearings", 1, null);

        assertThat(first.items()).hasSize(1);
        assertThat(first.nextCursor()).isNotBlank();
        assertThat(first.items().getFirst().id()).isEqualTo("bearing-b");

        CatalogPageResponse second = catalog.browse("BEAR", "Bearings", 1, first.nextCursor());

        assertThat(second.items()).extracting(ProductResponse::id).containsExactly("bearing-a");
        assertThat(second.nextCursor()).isNull();
        assertThat(catalog.browse("hidden", "Bearings", 10, null).items()).isEmpty();
    }

    private void insert(String slug, String sku, String name, String brand, String category, boolean published, String createdAt) {
        jdbc.update(
            """
                INSERT INTO catalog_products
                    (id, slug, sku, name, brand, category, description, unit_price, gst_rate, stock, published, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
            UUID.randomUUID(),
            slug,
            sku,
            name,
            brand,
            category,
            "Test product",
            new BigDecimal("10.00"),
            new BigDecimal("18.00"),
            10,
            published,
            Instant.parse(createdAt)
        );
    }
}

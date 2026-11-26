package com.aaronenterprises.api.catalog;

import java.math.BigDecimal;
import java.time.Instant;

public record ProductResponse(
    String id,
    String sku,
    String name,
    String brand,
    BigDecimal price,
    BigDecimal gst,
    String image,
    String category,
    String description,
    int stock,
    String availability,
    boolean featured,
    Instant createdAt
) {

    static ProductResponse from(CatalogProduct product) {
        String availability = product.getStock() == 0
            ? "Out of stock"
            : product.getStock() < 8 ? "Low stock" : "In stock";
        return new ProductResponse(
            product.getSlug(),
            product.getSku(),
            product.getName(),
            product.getBrand(),
            product.getUnitPrice(),
            product.getGstRate(),
            product.getImageUrl(),
            product.getCategory(),
            product.getDescription(),
            product.getStock(),
            availability,
            product.isFeatured(),
            product.getCreatedAt()
        );
    }
}

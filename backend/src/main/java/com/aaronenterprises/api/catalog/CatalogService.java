package com.aaronenterprises.api.catalog;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class CatalogService {

    private static final int MAX_PAGE_SIZE = 50;
    private final CatalogProductRepository products;

    public CatalogService(CatalogProductRepository products) {
        this.products = products;
    }

    public CatalogPageResponse browse(String query, String category, int limit, String cursor) {
        if (limit < 1 || limit > MAX_PAGE_SIZE) {
            throw new IllegalArgumentException("limit must be between 1 and " + MAX_PAGE_SIZE);
        }
        String prefix = normalize(query);
        String categoryFilter = normalize(category);
        CatalogCursor position = cursor == null || cursor.isBlank() ? null : CatalogCursor.decode(cursor);
        List<CatalogProduct> page = products.findCatalog(
            categoryFilter,
            prefix,
            position,
            limit + 1
        );

        boolean hasMore = page.size() > limit;
        List<CatalogProduct> visible = hasMore ? page.subList(0, limit) : page;
        String nextCursor = hasMore ? CatalogCursor.encode(visible.getLast()) : null;
        return new CatalogPageResponse(visible.stream().map(ProductResponse::from).toList(), nextCursor);
    }

    public ProductResponse getPublished(String slug) {
        return products.findBySlugAndPublishedTrue(slug)
            .map(ProductResponse::from)
            .orElseThrow(() -> new CatalogProductNotFoundException(slug));
    }

    private static String normalize(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}

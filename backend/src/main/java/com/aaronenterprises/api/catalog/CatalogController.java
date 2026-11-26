package com.aaronenterprises.api.catalog;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/v1/products")
public class CatalogController {

    private final CatalogService catalog;

    public CatalogController(CatalogService catalog) {
        this.catalog = catalog;
    }

    @GetMapping
    public ResponseEntity<CatalogPageResponse> browse(
        @RequestParam(required = false) @Size(max = 80) String q,
        @RequestParam(required = false) @Size(max = 100) String category,
        @RequestParam(defaultValue = "24") @Min(1) @Max(50) int limit,
        @RequestParam(required = false) @Size(max = 256) String cursor
    ) {
        return ResponseEntity.ok()
            .cacheControl(CacheControl.maxAge(java.time.Duration.ofSeconds(30)).cachePublic())
            .body(catalog.browse(q, category, limit, cursor));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ProductResponse> get(@PathVariable @Size(max = 100) String slug) {
        return ResponseEntity.ok()
            .cacheControl(CacheControl.maxAge(java.time.Duration.ofSeconds(30)).cachePublic())
            .body(catalog.getPublished(slug));
    }
}

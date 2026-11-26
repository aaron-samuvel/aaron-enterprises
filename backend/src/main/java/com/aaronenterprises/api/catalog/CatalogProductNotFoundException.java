package com.aaronenterprises.api.catalog;

public final class CatalogProductNotFoundException extends RuntimeException {
    public CatalogProductNotFoundException(String slug) {
        super("No published product exists with slug: " + slug);
    }
}

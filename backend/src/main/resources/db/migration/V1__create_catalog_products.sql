CREATE TABLE catalog_products (
    id UUID PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    sku VARCHAR(80) NOT NULL,
    name VARCHAR(160) NOT NULL,
    brand VARCHAR(120) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description VARCHAR(2000) NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    gst_rate NUMERIC(5, 2) NOT NULL CHECK (gst_rate >= 0 AND gst_rate <= 100),
    image_url VARCHAR(2048),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX ux_catalog_products_sku_ci ON catalog_products (lower(sku));
CREATE INDEX ix_catalog_products_published_created ON catalog_products (created_at DESC, id DESC)
    WHERE published = TRUE;
CREATE INDEX ix_catalog_products_published_category_created ON catalog_products (category, created_at DESC, id DESC)
    WHERE published = TRUE;
CREATE INDEX ix_catalog_products_published_name_prefix ON catalog_products (lower(name) text_pattern_ops)
    WHERE published = TRUE;
CREATE INDEX ix_catalog_products_published_brand_prefix ON catalog_products (lower(brand) text_pattern_ops)
    WHERE published = TRUE;
CREATE INDEX ix_catalog_products_published_sku_prefix ON catalog_products (lower(sku) text_pattern_ops)
    WHERE published = TRUE;

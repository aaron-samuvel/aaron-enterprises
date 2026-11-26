package com.aaronenterprises.api.catalog;

import java.util.List;

public interface CatalogProductRepositoryCustom {

    List<CatalogProduct> findCatalog(String category, String prefix, CatalogCursor position, int limit);
}

package com.aaronenterprises.api.catalog;

import java.util.List;

public record CatalogPageResponse(List<ProductResponse> items, String nextCursor) {}

package com.aaronenterprises.api.catalog;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.aaronenterprises.api.config.SecurityConfiguration;
import com.aaronenterprises.api.web.ApiExceptionHandler;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(CatalogController.class)
@Import({SecurityConfiguration.class, ApiExceptionHandler.class})
class CatalogControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private CatalogService catalog;

    @Test
    void catalogIsPublicAndCacheable() throws Exception {
        when(catalog.browse(null, null, 24, null)).thenReturn(new CatalogPageResponse(List.of(), null));

        mvc.perform(get("/api/v1/products"))
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith("application/json"))
            .andExpect(header().string("Cache-Control", "max-age=30, public"))
            .andExpect(content().json("{\"items\":[],\"nextCursor\":null}"));
    }

    @Test
    void writesAreDeniedUntilAnAdminAuthenticationFlowExists() throws Exception {
        mvc.perform(post("/api/v1/products"))
            .andExpect(status().isForbidden());
    }

    @Test
    void catalogLimitIsBounded() throws Exception {
        mvc.perform(get("/api/v1/products").param("limit", "51"))
            .andExpect(status().isBadRequest());
    }
}

package com.aaronenterprises.api.catalog;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatIllegalArgumentException;

import java.time.Instant;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class CatalogCursorTest {

    @Test
    void cursorRoundTripsDatabasePosition() {
        UUID id = UUID.fromString("f0ef0ec3-7d21-4c62-b8a1-c8035d9b4734");
        CatalogProduct product = new CatalogProduct() {
            @Override
            public Instant getCreatedAt() {
                return Instant.parse("2026-11-25T12:34:56.123456Z");
            }

            @Override
            public UUID getId() {
                return id;
            }
        };

        CatalogCursor cursor = CatalogCursor.decode(CatalogCursor.encode(product));

        assertThat(cursor.createdAt()).isEqualTo(product.getCreatedAt());
        assertThat(cursor.id()).isEqualTo(id);
    }

    @Test
    void malformedCursorIsRejected() {
        assertThatIllegalArgumentException().isThrownBy(() -> CatalogCursor.decode("not-a-cursor"));
    }
}

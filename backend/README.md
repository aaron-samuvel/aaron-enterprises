# Aaron Enterprises Spring Boot API

This directory starts the Java backend as a separate service. The existing React site remains on GitHub Pages and is not wired to this API yet. The first API slice is read-only product discovery; no demo catalog rows are copied into the database as real business inventory.

## Stack

- Java 21 and Spring Boot 4.2.0
- Spring MVC REST API, Spring Data JPA, Bean Validation, and Spring Security
- PostgreSQL with Flyway migrations and Hibernate schema validation
- Bounded cursor pagination for catalog reads
- Actuator health probes and Prometheus metrics on a separate management port
- Embedded Apache Tomcat with bounded threads/connections and graceful shutdown
- Non-root container image and Docker Compose for local development

## API

`GET /api/v1/products` lists published products. `q` matches prefixes in product name, brand, or SKU; `category` filters exactly; `limit` is from 1 through 50; `cursor` continues a stable keyset page. The response contains `items` and `nextCursor`.

`GET /api/v1/products/{slug}` returns one published product. Unknown or unpublished slugs return `404` using an RFC 9457 problem response. Public catalog responses are cacheable for 30 seconds. Writes are denied; an administrative identity and authorization flow must be designed before product mutation endpoints are added.

The API permits only catalog reads and health probes. CORS origins are explicitly configured through `CORS_ALLOWED_ORIGINS`, without credentials or wildcard origins.

## Run locally

From this directory, copy `.env.example` to `.env`, replace the local password, and start the API and PostgreSQL:

```powershell
Copy-Item .env.example .env
docker compose up --build
```

The API listens on `http://localhost:8080`; PostgreSQL is bound to loopback. Liveness and readiness are available at `/livez` and `/readyz`. Prometheus is on port `8081`, bound to loopback in Compose. Do not expose that management port publicly.

Run the fast tests with `mvn test`. Run PostgreSQL integration tests with Docker available using `mvn verify -Pintegration-tests`.

## Deployment and scaling requirements

The API is stateless and can run as multiple replicas behind a load balancer. Use managed PostgreSQL with backups and point-in-time recovery, TLS between services, a secret manager, and an ingress/CDN that applies request and connection rate limits. The DB pool must be sized against the total replica count: reserve connections for operations and other services before setting `replicas × DB_POOL_MAX`.

Keep port `8081` on a private monitoring network. Configure the frontend origin in `CORS_ALLOWED_ORIGINS`; leave the default only for local development. Use the health probes for orchestration and scrape Prometheus only from trusted infrastructure. Tune Tomcat threads, connection limits, and pool sizes from load-test results for the chosen deployment size rather than treating the defaults as capacity guarantees.

## Still required before this becomes the live commerce backend

- Verify actual product, price, tax, and stock data with the business owner, then import it through a reviewed process.
- Define the admin identity provider and add authenticated, audited product-management APIs.
- Choose the production hosting, database plan, backups, ingress/CDN, secrets, CORS origins, and alerting.
- Add quote/order persistence only after retention, privacy, payment, and fulfillment requirements are defined.
- Connect the GitHub Pages frontend to the deployed API and verify error, timeout, retry, and cache behavior.
- Run load, failover, restore, and security checks against the selected hosting setup.

This PR provides a deployable API foundation, not a claim that the site is already operating as a complete production commerce system. No contact details, customer data, or illustrative product data are seeded.

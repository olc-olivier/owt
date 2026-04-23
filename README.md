# owt

## Requirements

### Challenge

Build The Boat App — a small but complete fullstack **web application** allowing **authenticated users** to manage a fleet of boats.

The goal is not to build a complex product, but to demonstrate your technical craft, your architecture decisions, and your ability to leverage AI tools effectively throughout development.

### Use Cases

#### MANDATORY
- UC1 The user opens the app and is redirected to a login page. After authentication, they reach the boat
overview (UC2).
- UC2 The authenticated user sees a paginated list of all boats.
- UC3 The user can create, update, and delete a boat.
- UC4 The user can click on a boat to access its detail view.
#### OPTIONAL
- UC5 The user can search or filter the boat list by name or description.
- UC6 The user sees a confirmation dialog before deleting a boat.


## Technical Requirements

|Frontend|Backend|
|:-------|:------|
|Framework: React, **Angular**, or Vue.js | Stack: **Java/Spring Boot** or .NET Core Web
API
| Responsive UI (mobile-friendly) | **RESTful API** with **CRUD operations** for boats
| Client-side routing | Boat model: id, name, description,
createdAt
| Form validation with friendly error messages | Input validation with HTTP error responses
(400, 404…)
| Explicit loading and error states | Only authenticated requests accepted

## Authentication, Containerization & Bonus

|Authentication|Containerization|Bonus|
|:-------|:------|:------|
|Preferred: OAuth 2.0. You can use a mock OAuth 2.0 server via Docker|The full stack must start with a single command: docker compose up | CI/CD pipeline (GitHub Actions) |
| Choice of library and approach is yours explain your decisions || Swagger / OpenAPI docs |
|||Dark mode / WCAG AA accessibility |
|||Audit log (who created / updated / deleted and when) |

## AI-Assisted Development

AI_USAGE.md — What to document
• Which AI tools you used
• What you used them for (architecture, code gen, tests, docs…)
• 3–5 representative prompts verbatim
• How you validated AI output (what you changed, fixed, or rejected)
• What you chose NOT to delegate to AI — and why

## Steps

1. Setup AI (find best template for claude)
2. What are the dependencies require? -> SPRING:security:web:rest:db (in memory more simple, with preload, H2)
3. Use Spring Initializr
4. Use NG client
5. Generate Automatic tests from Use cases
6. OAuth (use the config from an old spring project with my Google auth. coming from a Devoxx Conf.)
7. Errors/Logs centric manangement (???) -> OpenTelemetry
8. Responsive UI (mobile-friendly) -> Google Material
9. Not sure, I can use the Docker Maven Plugin with my Mac M1, to check 
10. Generate the Documentation

Bonus
- Enable Audittrail on the entity
- OpenAPI is free -> (use the config from an old spring project)
- Dark Mode -> discovery could be free with Google Material, require a slide button to enable in the header or footer
- CI/CD Github -> discovery (lot of time, keep for the end) :boom:


PROS/CONS AI Usage..
-> Yes: Documentation -> Easy with REST/Open API to generate...
-> Yes: Check challenge requirements
-> Yes: Tests -> Very Simple / Easy to check / No direct value for customer / Not business, should we create some UI tests with record/capture ??? 
-> No: Basic Spring Applications step... Use some already checked by me on previous projects
-> No: UX/UI Details Design

To see during the iteration, opinion could change...


## Miscellaneous

JHipster ??? Could do everything... But no personal demonstration in this case
Read the winner repo for AI Challenge -> https://github.com/affaan-m/everything-claude-code.git

AI Templates using: 
- npx claude-code-templates@latest --skill development/api-design-principles
- npx claude-code-templates@latest --skill development/java-pro
- npx claude-code-templates@latest --skill development/angular
- npx claude-code-templates@latest --agent programming-languages/spring-boot-engineer
- npx claude-code-templates@latest --skill development/e2e-testing-patterns
- npx claude-code-templates@latest --skill development/clean-code
- npx claude-code-templates@latest --skill development/senior-frontend
- npx claude-code-templates@latest --skill development/senior-backend
- npx claude-code-templates@latest --skill development/senior-architect


## Prompts

1. Generate SQL for preload data
```
generate sql queries for insert for a file "data.sql" inside the folder "src/main/resources", 1 table contains some boats and another table contains somes users for the application autentification, no link between tables, user is not attach to a boat, only for authentification
```

2. Generate domains/services/controllers from the preload data
```
generate all classes required to manage the 2 tables, follow the application folders structure and the best practices for spring data rest implementation
```

3. Fix mistake, "description" field missing, so replace "type" field, useless
```
fieldname error, for a boat entity rename the field "type" by "description" and fix the code, name of variable, data.sql, schema.sql, name inside the method name, comment... etc...
```

4. Generate Unit Tests
```
You are a senior Java/Spring expert.

Context:
- Read the README.md file first to gather additional information about this application.
- This is a Spring Boot REST application (version ≥ 4.0.5).

Your task:
Generate complete, production-quality unit tests for the REST controllers covering the following use cases only:

  UC2 – The user sees a paginated list of all boats.
  UC3 – The user can create, update, and delete a boat.
  UC4 – The user can click on a boat to access its detail view.

Technical constraints (mandatory, no exceptions):
  - Framework        : Spring Boot ≥ 4.0.5 / Spring Web
  - Test slice       : @WebMvcTest (controller layer only — no service/repo wiring)
  - Mocking          : @MockitoBean ONLY — never use @MockBean (removed in Spring Boot 4)
  - HTTP client      : MockMvc (auto-configured by @WebMvcTest)
  - ObjectMapper     : Declare a @Bean manually inside a @TestConfiguration class
  - HTTP verbs       : Cover GET, POST, PUT, DELETE where applicable
  - Coverage         : All success cases for every endpoint in scope

Output format (strict):
  - Full test class(es), one per controller
  - All imports included at the top of each file
  - No explanations, comments, or markdown prose — code only
  - Clean, readable structure: arrange/act/assert pattern, descriptive method names
```

5 Fix C2 Unit Test don't respect the Use Case
```
You are a senior Java/Spring expert.

Context:
- Read README.md first for project conventions and domain model.
- Spring Boot ≥ 4.0.5, Spring Web, Spring Data JPA.
- Pagination must follow Spring Data REST conventions:
  https://docs.spring.io/spring-data/rest/reference/paging-and-sorting.html

────────────────────────────────────────────
GOAL
────────────────────────────────────────────
UC2 — the user sees a paginated list of all boats, with:
  - configurable page size   (?size=N, default 20)
  - page navigation          (?page=N, zero-based)
  - single-field sort        (?sort=field,asc|desc)
  - multi-field sort         (?sort=field1,asc&sort=field2,desc)
  - Page metadata in response body (size, totalElements, totalPages, number)
  - HAL _links: self, first, last, next (when applicable), prev (when applicable)

Do NOT write a review report. Directly fix and generate — see steps below.

────────────────────────────────────────────
STEP 1 — SCAN (silent)
────────────────────────────────────────────
Read the existing controller, service, and repository for boats.
Identify silently which of the following are missing or incorrect:

  [ ] Repository method returns Page (not List)
  [ ] Service method accepts and forwards Pageable
  [ ] Controller endpoint accepts Pageable (auto-resolved by Spring MVC)
  [ ] Response wraps Page so metadata + _links are serialized
  [ ] Default page size is explicitly configured (e.g. @PageableDefault or config)
  [ ] Sort parameters map to valid Boat fields

────────────────────────────────────────────
STEP 2 — PATCH IMPLEMENTATION
────────────────────────────────────────────
For every gap found in Step 1, output the corrected file in full.
Rules:
  - Output complete classes only — no partial snippets, no "..." placeholders.
  - Preserve all existing logic unrelated to pagination.
  - Use @PageableDefault(size = 20) on the controller parameter if no default
    is set elsewhere.
  - Return ResponseEntity> (or the project's existing DTO/response
    wrapper — check README for conventions).
  - If no gap is found for a layer, output nothing for that layer.

Output format per file:
  // FILE: src/main/java/.../BoatController.java
  

────────────────────────────────────────────
STEP 3 — GENERATE UNIT TESTS
────────────────────────────────────────────
Write a complete @WebMvcTest test class for the boats list endpoint,
targeting the code produced in Step 2 (or the existing code if no patch was needed).

Hard constraints:
  - @WebMvcTest (controller layer only)
  - @MockitoBean — NEVER @MockBean (removed in Spring Boot 4)
  - MockMvc for all HTTP calls
  - ObjectMapper declared as @Bean inside a @TestConfiguration inner class
  - Security disabled (excludeAutoConfiguration or @TestConfiguration override)
  - All imports included at top of file
  - No explanations — code only
  - Arrange / Act / Assert structure, descriptive method names

Cover exactly these 8 scenarios:

  1. GET /boats (no params)
     → 200, page.number == 0, page.size == 20 (default)

  2. GET /boats?size=5
     → 200, page.size == 5, content.length <= 5

  3. GET /boats?page=1&size=5
     → 200, page.number == 1, _links contains "prev"

  4. GET /boats?sort=name,asc
     → 200, Pageable received by service has Sort.by("name").ascending()

  5. GET /boats?sort=name,desc
     → 200, Pageable received by service has Sort.by("name").descending()

  6. GET /boats?sort=type,asc&sort=name,desc
     → 200, Pageable has two sort orders in declared sequence

  7. Simulate last page (page == totalPages - 1)
     → 200, response body has no _links.next

  8. GET /boats?page=9999
     → 200, content is empty, no 4xx or 5xx

```  
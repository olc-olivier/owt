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

2.
```
generate all classes required to manage the 2 tables, follow the application folders structure and the best practices for spring data rest implementation
```
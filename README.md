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

|UseCase|Frontend|Backend|
|:------|:-------|:------|
|**UC1**|:negative_squared_cross_mark:|:parking:|
|**UC2**|:parking:|:white_check_mark:|
|**UC3**|:parking:|:white_check_mark:|
|**UC4**|:parking:|:white_check_mark:|
|UC5|:parking:|:white_check_mark:|
|UC6|:parking:|:white_check_mark:|


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
    -> Claude Templates (spring-boot-engineer, etc...)
    -> Claude Skills (angular, etc...)
    -> VSCode Copilot (less tokens consumptions)
• What you used them for (architecture, code gen, tests, docs…) 3–5 representative prompts verbatim
    -> See prompt on the bottom content
• How you validated AI output (what you changed, fixed, or rejected)
    -> Use cases, changed & fixed (missing fieldname, pagination forget)
    -> Security, over-consumed token to fix generate services under security enable
    -> Simple task of initiliazation like (create spring application, angular application, material) already have a industrial generation by the editor
• What you chose NOT to delegate to AI — and why
    -> Security (could be a lot complex, require to much loop)
    -> Do everything if your Claude Rules are not complete and tested, generate too much code and function useless, token comsumption high. I start from blank, my automatic generator is not ready and take existing on the net require to time to adjust the result generated.

## Steps

1. Setup AI (find best template for claude) :white_check_mark:
2. What are the dependencies require? -> SPRING:security:web:rest:db (in memory more simple, with preload, H2) :white_check_mark:
3. Use Spring Initializr :white_check_mark:
4. Use NG client :white_check_mark:
5. Generate Automatic tests from Use cases :white_check_mark:
6. OAuth (use the config from an old spring project with my Google auth. coming from a Devoxx Conf.)
7. Errors/Logs centric manangement (???) -> OpenTelemetry
8. Responsive UI (mobile-friendly) -> Google Material :white_check_mark:
9. Application as a Docker Container :white_check_mark:
10. Generate the Documentation

Bonus
- Enable Audittrail on the entity
- OpenAPI is free -> (use the config from an old spring project) :white_check_mark:
- Dark Mode -> discovery could be free with Google Material, require a slide button to enable in the header or footer :white_check_mark:
- CI/CD Github -> discovery (lot of time, keep for the end) :boom: :white_check_mark:


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

6. Web Application inside a Docker Container
```
Comme un Devops engineer, optimize le Dockerfile selon les bonnes pratiques
Container lance une application web Spring/Angular sur le port 8080 avec le user OWT

"
FROM eclipse-temurin:25-jdk-alpine
EXPOSE 8080
RUN addgroup -S owt && adduser -S owt -G owt
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} /opt/owt/app.jar
WORKDIR /opt/owt
RUN chown -R owt:owt /opt/owt
USER owt
ENTRYPOINT ["java","-jar","/opt/owt/app.jar"]
"
```

7. Better commit log for other developers
```
I will commit my changes, read the change and generate the commit log with the best understanding for others developers about my work. Should be short, less 20 words.
```

8. Dark Mode
````
Here's the comprehensive senior-level prompt, grounded in the official Tailwind v4 docs and Angular 21 best practices:

🎯 Master Prompt — Angular 21 + Tailwind CSS v4 Dark Mode
You are a Senior Angular Developer. Implement a complete, production-grade 
Dark Mode system for an Angular 21 application using Tailwind CSS v4 
and Angular Material 3 (MDC). The toggle is driven by an existing 
mat-slide-toggle component.

=== CURRENT STATE ===

The app already has one Angular Material theme defined in styles.scss:

  @include mat.theme(
    (
      color: (
        primary: mat.$azure-palette,
        tertiary: mat.$blue-palette,
      ),
      typography: Roboto,
      density: 0,
    )
  );

The toggle HTML already exists:

  <mat-slide-toggle class="dark-mode-slide-toggle">
    <h2 class="example-h2">Dark Mode</h2>
  </mat-slide-toggle>

=== ARCHITECTURE DECISION ===

Use the CSS class strategy (NOT prefers-color-scheme media query) so:
- The user's explicit toggle choice always wins over the OS preference
- Tailwind dark: variants activate via a .dark class on <html>
- Angular Material dark theme activates via .dark-theme class on <body>
- Tailwind v4 requires: @custom-variant dark (&:where(.dark, .dark *));
  in styles.css (NOT tailwind.config.js — v4 uses CSS-first config)

=== REQUIREMENTS ===

1. THEME SERVICE (ThemeService)
   - Create a ThemeService as a root-level Injectable (providedIn: 'root')
   - Expose: isDarkMode = signal<boolean>(false)
   - Method: toggleTheme(): void
       - Flips the signal value
       - Adds/removes 'dark' class on document.documentElement (<html>)
         → This activates Tailwind dark: variants
       - Adds/removes 'dark-theme' class on document.body (<body>)
         → This activates the Angular Material dark theme
       - Persists preference to localStorage under key 'theme'
   - Method: initTheme(): void
       - Called once at app startup (APP_INITIALIZER or constructor)
       - Reads from localStorage first
       - Falls back to window.matchMedia('(prefers-color-scheme: dark)')
         as the default if no stored preference exists
       - Must be SSR-safe: wrap document/window access with isPlatformBrowser()

2. TAILWIND DARK MODE CONFIG (styles.css or global styles)
   Tailwind v4 CSS-first approach — no tailwind.config.js:

   @import "tailwindcss";
   @custom-variant dark (&:where(.dark, .dark *));

   This registers the dark: variant to activate on .dark class,
   NOT on prefers-color-scheme.

3. ANGULAR MATERIAL DARK THEME (styles.scss)
   Add a second @include mat.theme() call scoped to .dark-theme:

   .dark-theme {
     @include mat.theme(
       (
         color: (
           theme-type: dark,
           primary: mat.$azure-palette,
           tertiary: mat.$blue-palette,
         ),
         typography: Roboto,
         density: 0,
       )
     );
   }

   Keep the existing light theme as-is (applied globally without selector).

4. TOGGLE COMPONENT WIRING
   In the component that owns the mat-slide-toggle:
   - Inject ThemeService
   - Bind [checked]="themeService.isDarkMode()"
   - Bind (change)="themeService.toggleTheme()" on the mat-slide-toggle
   - Use the Angular Material change event (MatSlideToggleChange), 
     not a click event

   Final HTML:
   <mat-slide-toggle
     class="dark-mode-slide-toggle"
     [checked]="themeService.isDarkMode()"
     (change)="themeService.toggleTheme()">
     <h2 class="example-h2">Dark Mode</h2>
   </mat-slide-toggle>

5. SMOOTH TRANSITION
   Add to styles.scss (or global CSS):

   * {
     transition: background-color 300ms ease, color 300ms ease,
                 border-color 300ms ease;
   }

   Scope this under a .theme-transition class toggled during the switch
   if you want to avoid transitions on first load (FOUC prevention).

6. FOUC PREVENTION (Flash of Unstyled Content)
   In index.html, inside <head> BEFORE any stylesheets, add an inline 
   <script> (not deferred, not async):

   <script>
     (function() {
       const stored = localStorage.getItem('theme');
       const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
       if (stored === 'dark' || (!stored && prefersDark)) {
         document.documentElement.classList.add('dark');
         document.body.classList.add('dark-theme');
       }
     })();
   </script>

   This runs synchronously before Angular bootstraps, 
   preventing any flash of light mode on dark-preferring users.

7. TAILWIND USAGE PATTERN IN TEMPLATES
   Use Tailwind dark: variants on all themed elements:

   <div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
   <nav class="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
   <button class="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400">

   Angular Material components inherit the dark palette automatically 
   from .dark-theme on body — no extra Tailwind classes needed for mat-* components.

8. SSR COMPATIBILITY (if using Angular Universal / SSR)
   - Inject PLATFORM_ID and use isPlatformBrowser() guard around ALL 
     localStorage, document, and window access in ThemeService
   - Server renders with light theme by default (safe fallback)
   - Client hydration applies the correct theme via initTheme() + 
     the inline <script> in index.html

9. ACCESSIBILITY
   - Add aria-label="Toggle dark mode" to the mat-slide-toggle
   - Add aria-checked binding: [attr.aria-checked]="themeService.isDarkMode()"
   - Ensure color contrast ratio ≥ 4.5:1 in both themes (WCAG AA)
   - Use prefers-reduced-motion to disable transitions when needed:
       @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }

10. TESTING
    - Unit test ThemeService:
        - toggleTheme() adds/removes 'dark' on documentElement
        - toggleTheme() persists to localStorage
        - initTheme() restores 'dark' from localStorage on init
        - initTheme() falls back to matchMedia when no localStorage entry
    - Component test: mat-slide-toggle [checked] reflects isDarkMode()
    - Use Angular's TestBed with a mock PLATFORM_ID = BROWSER

=== CONSTRAINTS ===
- Angular 21 with standalone components (no NgModules)
- Signals API (signal, computed, effect) — NO BehaviorSubject/RxJS for state
- Tailwind CSS v4 (CSS-first, no tailwind.config.js)
- Angular Material 3 (MDC-based, mat.theme() mixin)
- No third-party theme libraries
- ThemeService must be stateless regarding DOM on construction 
  (defer DOM access to initTheme())

=== DELIVERABLES ===
Provide in order:
1. theme.service.ts — with signals, localStorage, SSR-safe guards
2. styles.scss — both mat.theme() blocks (light global + dark scoped)  
3. styles.css (or app.css) — Tailwind v4 @custom-variant dark declaration
4. index.html — FOUC-prevention inline script
5. app.component.ts — wired mat-slide-toggle (standalone)
6. app.component.html — toggle markup with bindings
7. theme.service.spec.ts — unit tests

For each file, add a one-line comment explaining the key design decision.
```

9. Dark Mode Fix with Angular Skill IA
/angular fix test on Dark Mode not working   
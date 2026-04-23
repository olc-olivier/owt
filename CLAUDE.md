# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

It is a Java/Angular application.
The Boat App, a small but complete fullstack web application allowing authenticated users to manage a fleet of boats.


## Build System and Commands

This project uses Maven with the Maven Wrapper (mvnw). Each module can be built and run independently.

### Common Development Commands

**Build and run:**
```bash
cd <module-directory>
./mvnw clean package
./mvnw spring-boot:run
```

**Build:**
```bash
mvn clean package
```

**Run all tests:**
```bash
mvn test
```

**Run a single test class:**
```bash
mvn test -Dtest=YourTestClassName
```

**Run a single test method:**
```bash
mvn test -Dtest=YourTestClassName#methodName
```

**Generate the Surefire report, see all test-results in ${basedir}/target/reports/surefire.html:**
```bash
mvn surefire-report:report 
```

**Build without running tests:**
```bash
mvn package -DskipTests
```

**Generate the Docker Image / require to have a Docker Daemon to run:**
```bash
mvn install -DskipTests
```


## Architecture

Spring Boot REST API using an in-memory H2 database (resets on restart).
H2 console available at http://localhost:8080/h2-console (JDBC URL: jdbc:h2:mem:restdb, user: sa, no password).

### Module Structure
- Is a self-contained Spring Boot application
- Modules follow standard Maven directory structure: `src/main/java` and `src/test/java`

### Library Version / Code Generated should be compatible with the version
- Java: 25
- Spring Boot: 4.0.5
- REST Assured 6.0
- JUnit 5
- Angular: 21

### Key Module Categories

**Technical Features: **
- Demonstrates CRUD operations
- Enable Spring Security OAuth 2.0
- Use database in memory with preload data
- Enable OpenAPI/ Swagger
- Generate Javadoc


### Configuration Patterns
- Application properties typically in `src/main/resources/application.properties` or `application.yaml`
- Docker Compose files for complex setups (e.g., `compose.yml`)

### Application Folders Structure 
````
src/
├── main/
│   ├── java/
│   │   └── owt/
│   │       └── demo/
│   │           ├── config/                    # Configuration classes
│   │           │   ├── AppConfig.java
│   │           │   ├── SecurityConfig.java
│   │           │   └── DatabaseConfig.java
│   │           │
│   │           ├── presentation/              # HTTP/REST layer (Controllers)
│   │           │   └── controller/
│   │           │
│   │           ├── application/               # Use cases / Application services
│   │           │   └── service/
│   │           │
│   │           ├── domain/                    # Business logic / Entity models
│   │           │   ├── model/
│   │           │   ├── repository/            # Repository interfaces (abstraction)
│   │           │   └── exception/
│   │           │       ├── EntityNotFoundException.java
│   │           │       └── InvalidOperationException.java
│   │           │
│   │           ├── infrastructure/            # Data access / External service implementations
│   │           │   └── persistence/
│   │           │
│   │           ├── dto/record                 # Data Transfer Objects 
│   │           │
│   │           ├── mapper/                    # Entity <-> DTO converters
│   │           │
│   │           ├── util/                      # Utilities/Helpers
│   │           │
│   │           └── DemoApplication.java       # Main entry point
│   │
│   └── resources/
│       ├── application.yml
│       ├── application-dev.yml
│       ├── application-prod.yml
│       ├── schema.sql                         # Database creation
│       ├── data.sql                           # Sample data
│       ├── static/
│       └── templates/
│
└── test/
    └── java/
        └── owt/
            └── demo/
                ├── DemoApplicationTests.java
                ├── integration/               # Integration tests
                ├── unit/                      # Unit tests
                └── fixtures/                  # Test data builders

```


## Testing Framework

This repository uses a comprehensive integration testing framework with for the CRUD opertations and authentification for ensuring all examples work correctly across releases. The framework currently covers the application with integration tests** with intelligent validation for interactive applications. Some Java (mvn test ...) and Typescript (npm test ...) Tests, various location depends on the language technology.

### Testing Approaches

Java ->
| Example Type | Test Location | Command | Purpose |
|--------------|---------------|---------|---------|
| **Simple** | `src/test/java/` | `./mvnw test` | Unit tests, basic functionality |


### Key Features

- **Application Tested**: Integration tests for all major operations
- **Centralized Architecture**: Single source of truth with 84% code reduction
- **Comprehensive Logging**: Full application output preserved for debugging

### 🤖 AI Validation (NEW)

The integration testing framework now includes AI-powered validation using Claude to intelligently analyze test outputs. This goes beyond regex pattern matching to understand context, validate unpredictable AI outputs, and assess complex workflows.

**Key Benefits:**
- **Intelligent Assessment** - Understands if examples achieved their intended purpose
- **Context-Aware** - Uses README documentation for validation context
- **Cost Efficient** - ~100 tokens per validation with high cache utilization

## Development Notes

- Use the integration testing framework for comprehensive example testing and validation
- A Maven wrapper 
- Examples demonstrate the CRUD operations for the boats fleet
- Complex examples should include integration tests for CI/CD validation

## Commit Message Guidelines

**IMPORTANT**: When committing code to this repository, commit messages should appear to be authored by humans:

- ❌ **DO NOT include**: Robot emoji (🤖), "Generated with Claude Code", "Co-Authored-By: Claude", or any AI attribution
- ✅ **DO use**: Professional commit messages following established conventions

### The Seven Rules of a Great Git Commit Message

Based on [Chris Beams' classic guide](https://cbea.ms/git-commit/), follow these rules:

1. **Separate subject from body with a blank line**
2. **Limit the subject line to 50 characters**
3. **Capitalize the subject line**
4. **Do not end the subject line with a period**
5. **Use the imperative mood in the subject line** ("Add feature" not "Added feature")
6. **Wrap the body at 72 characters**
7. **Use the body to explain what and why vs. how**

### Modern Conventions (Recommended)

Combine the classic rules with conventional commit format:

- `feat(scope): add new feature` - new functionality
- `fix(scope): resolve issue description` - bug fixes  
- `docs(scope): update documentation` - documentation changes
- `refactor(scope): restructure without changing behavior` - code refactoring
- `test(scope): add or update tests` - test changes
- `chore(scope): maintenance tasks` - build, dependencies, etc.

### Examples

**Good:**
```
feat(mcp): add server with OAuth2 support

Implements OAuth2 authentication for data access.
Resolves rate limiting issues and improves security.
```

**Good (simple):**
```
fix: resolve port conflicts in integration tests
```

**Bad:**
```
🤖 Generated with Claude Code: Fixed some stuff

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Writing Tip
Your commit message should complete: "If applied, this commit will _[subject line]_"
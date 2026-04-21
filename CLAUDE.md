# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

It is a Java/Angular application.
The Boat App, a small but complete fullstack web application allowing authenticated users to manage a fleet of boats.


## Build System and Commands

This project uses Maven with the Maven Wrapper (mvnw). Each module can be built and run independently.

### Common Development Commands

**Build entire project:**
```bash
./mvnw clean package
```

**Build and run individual module:**
```bash
cd <module-directory>
./mvnw clean package
./mvnw spring-boot:run
```

**Build from root (all modules):**
```bash
mvn clean package
```


## Architecture

### Module Structure
- Is a self-contained Spring Boot application
- Modules follow standard Maven directory structure: `src/main/java` and `src/test/java`
- Java version: 25
- Spring Boot parent: `4.0.5`

### Key Module Categories

**Technical Features: **
- Demonstrates CRUD operations
- Enable Spring Security OAuth 2.0
- Use H2 Database in memory with preload data
- Enable OpenAPI/ Swagger
- Generate Javadoc


### Configuration Patterns
- Application properties typically in `src/main/resources/application.properties` or `application.yaml`
- Docker Compose files for complex setups (e.g., `compose.yml`)

## Testing Framework

This repository uses a comprehensive integration testing framework with for the CRUD opertations and authentification for ensuring all examples work correctly across releases. The framework currently covers the application with integration tests** with intelligent validation for interactive applications. Some Java (mvn test ...) and Typescript (npm test ...) Tests, various location depends on the language technology.

### Testing Approaches

Java ->
| Example Type | Test Location | Command | Purpose |
|--------------|---------------|---------|---------|
| **Simple** | `src/test/java/` | `./mvnw test` | Unit tests, basic functionality |
| **Complex** | `integration-tests/` | `jbang integration-tests/Run*.java` | End-to-end integration with AI validation |

### Key Features

- **Application Tested**: Integration tests for all major operations
- **Centralized Architecture**: Single source of truth with 84% code reduction
- **Comprehensive Logging**: Full application output preserved for debugging

### Primary Integration Testing Tools

The framework provides **two essential tools** for integration testing:

**1. ⭐ Run all integration tests (primary test runner):**
```bash
./integration-testing/scripts/run-integration-tests.sh
```

**Run specific integration test:**
```bash
./integration-testing/scripts/run-integration-tests.sh module-name
```

**Run with clean logs:**
```bash
./integration-testing/scripts/run-integration-tests.sh --clean-logs
```

**2. ⭐ Create integration tests for new examples (scaffolding tool):**
```bash
# Essential for extending the framework - creates ExampleInfo.json + Run*.java files
python3 integration-testing/scripts/scaffold_integration_test.py <module-path> [--complexity simple|complex|mcp]
```

**Create integration test with AI validation:**
```bash
# Simple example (hybrid AI validation)
python3 integration-testing/scripts/scaffold_integration_test.py kotlin/kotlin-hello-world --complexity simple

# Complex workflow (primary AI validation)
python3 integration-testing/scripts/scaffold_integration_test.py agentic-patterns/chain-workflow --complexity complex

# Interactive application (fallback AI validation)
python3 integration-testing/scripts/scaffold_integration_test.py agents/reflection --complexity complex

# MCP example (hybrid validation)
python3 integration-testing/scripts/scaffold_integration_test.py model-context-protocol/weather/server --complexity complex
```

**Test specific example:**
```bash
cd <module-directory>
jbang integration-tests/Run*.java  # For complex examples
./mvnw test                         # For simple examples
```

### Integration Test Structure

Complex examples include an `integration-tests/` directory with AI validation:
```
src/
├── test/
│   ├── CRUDTest.json               # Test API rest on the boat float management (add/remove/... a boat(s))
│   └── AuthentificationTest.java   # Test Authentification and Security Access Page Protected
```

### JBang Script Pattern & AI Validation

All integration test scripts use centralized utilities with AI validation support:
- **Centralized Architecture**: Each script is only ~18 lines (84% code reduction)
- **AI Integration**: Automatic AI validation using Claude for intelligent analysis
- **Universal Support**: All test logic in `integration-testing/jbang-lib/IntegrationTestUtils.java`
- **Interactive Apps**: Special handling for Scanner-based applications

**Validation Modes:**
- **Primary**: AI-only validation for unpredictable AI outputs
- **Hybrid**: Regex patterns + AI validation for reliability
- **Fallback**: Regex primary with AI backup for interactive applications

See `integration-testing/docs/README.md` for complete guide and `integration-testing/docs/TROUBLESHOOTING.md` for troubleshooting.

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
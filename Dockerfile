FROM eclipse-temurin:25-jre-alpine

# Métadonnées
LABEL maintainer="olivier.chantereau@gmail.com" \
      app.name="owt-webapp" \
      app.version="1.0.0"

# Variables d'environnement JVM (configurables au runtime)
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+ExitOnOutOfMemoryError" \
    APP_HOME=/opt/owt

# Créer user/group avant toute copie
RUN addgroup -S owt && adduser -S owt -G owt \
    && mkdir -p ${APP_HOME} \
    && chown -R owt:owt ${APP_HOME}

WORKDIR ${APP_HOME}

# Copier le JAR avec les bons droits directement
ARG JAR_FILE=target/*.jar
COPY --chown=owt:owt ${JAR_FILE} app.jar

# Basculer sur l'utilisateur non-root
USER owt

EXPOSE 8080

# Healthcheck intégré
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider [localhost](http://localhost:8080/actuator/health) || exit 1

ENTRYPOINT ["sh", "-c", "java ${JAVA_OPTS} -jar app.jar"]

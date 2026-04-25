# Start with a lightweight Java 17 image
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Download the JUnit Standalone Runner
RUN wget https://repo1.maven.org/maven2/org/junit/platform/junit-platform-console-standalone/1.10.0/junit-platform-console-standalone-1.10.0.jar -O /opt/junit.jar

# Download the AssertJ Library
RUN wget https://repo1.maven.org/maven2/org/assertj/assertj-core/3.24.2/assertj-core-3.24.2.jar -O /opt/assertj.jar

CMD ["sh"]
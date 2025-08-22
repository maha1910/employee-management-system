# Step 1: Use a lightweight JDK image
FROM eclipse-temurin:17-jdk-alpine

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy built jar (from Maven build)
COPY target/employeemanagement-0.0.1-SNAPSHOT.jar app.jar

# Step 4: Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]

## Spring Boot용 Dockerfile
#FROM eclipse-temurin:17-jdk
#LABEL authors="sinjunsu"
#
## ARG로 Jar 파일 경로 지정 (초기값 target/*.jar)
## Gradle 구조에서는 build/libs/*.jar로 바꾸면 됩니다
#ARG JAR_FILE=build/libs/*.jar
#COPY ${JAR_FILE} app.jar
#
#ENTRYPOINT ["java","-jar","/app.jar"]

# 개발용 이미지
# Ubuntu 기반 Gradle + JDK 17 이미지 사용
FROM gradle:8.3-jdk17
WORKDIR /app

COPY gradlew .
COPY gradle ./gradle
COPY build.gradle settings.gradle ./
COPY src ./src

RUN chmod +x ./gradlew

CMD ["./gradlew", "bootRun"]

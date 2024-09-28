FROM openjdk:17-jdk-slim

#timezone
ENV TZ Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app

# COPY ksignaccess-spring-agent-0.0.91-RELEASE_REDIS.war .
COPY ksignaccess-spring-agent-0.0.91-RELEASE.war .

COPY properties /app/properties

# ENV APP=/app/ksignaccess-spring-agent-0.0.91-RELEASE_REDIS.war
ENV APP=/app/ksignaccess-spring-agent-0.0.91-RELEASE.war

ENV SPRING_CONFIG=/app/properties/application.properties

ENTRYPOINT [ "sh", "-c", "java -Xms2048m -Xmx2048m -Djava.security.egd=file:/dev/./urandom -server -jar $APP --spring.config.location=file:$SPRING_CONFIG" ]
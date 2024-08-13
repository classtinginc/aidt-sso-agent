#!/bin/sh
echo KSignAccessAgent start

JDK_PATH=/agent/jdk-17.0
SPRING_CONFIG=/agent/properties/application.properties
WAR_FILE=/agent/ksignaccess-spring-agent-dev-0.0.6-RELEASE.war

nohup ${JDK_PATH}/bin/java -jar ${WAR_FILE} --spring.config.location=file:${SPRING_CONFIG} > nohup.out 2>&1 &

echo $! > app.pid

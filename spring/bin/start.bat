@echo off
echo KSignAccessAgent start

set JDK_PATH=D:\agent\jdk-17.0
set SPRING_CONFIG=D:\agent\properties\application.properties
set WAR_FILE=D:\agent\ksignaccess-spring-agent-0.0.91-RELEASE_REDIS.war

start "" %JDK_PATH%\bin\java -jar %WAR_FILE% --spring.config.location=file:%SPRING_CONFIG% > nul 2>&1

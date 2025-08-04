
# Étape 1 : Image de base
FROM openjdk:11
EXPOSE 8089

# Étape 2 : Ajouter le fichier JAR
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar

# Étape 3 : Exécuter l’application
ENTRYPOINT ["java","-jar","/app.jar"]

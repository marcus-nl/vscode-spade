@echo off
echo Starting PaGenServer on port %1
java -Dstcs.port=%1 -jar %PAGEN_SERVER_JAR%
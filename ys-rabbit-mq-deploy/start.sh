docker run -d --hostname ys-rabbit --name ys-rabbit -p 5672:5672 -p 8080:15672 rabbitmq:3-management
sleep 5
docker ps
open http://localhost:8080/
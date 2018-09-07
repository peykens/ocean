docker stop ys-rabbit
sleep 2
docker ps
docker start ys-rabbit
sleep 5
docker ps
open http://localhost:8080/#/
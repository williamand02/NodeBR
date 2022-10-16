## Cria docker postgres com banco de nome = heroes

```shel
docker run --name postgres -e POSTGRES_USER=rootName -e POSTGRES_PASSWORD=rootPassword -e POSTGRES_DB=heroes -p 5432:5432 -d postgres
```

## Cria interface amigavel slq

```shel
docker run \
--name adminer \
-p 8080:8080 \
--link postgres:postgres \
-d \
adminer
```

## Cria docker mongodb

```
docker run \
--name mongodb \
-p 27017:27017 \
-e MONGO_INITDB_ROOT_USERNAME=rootName \
-e MONGO_INITDB_ROOT_PASSWORD=rootPassword \
-d \
mongo:4
```

### Criar banco de dados mongodb criando um usuario e definindo seu papel

```shel
docker exec -it mongodb \
mongo --host localhost -u rootName -p rootPassword --authenticationDatabase admin \
--eval "db.getSiblingDB('herois').createUser({user:'userName', pwd: 'userSenha',roles:[{role:'readWrite',db:'herois'}]})"
```

## Cria interface amigavel nosql

```shel
docker run \
--name mongoclient \
-p 3000:3000 \
--link mongodb:mongodb \
-d \
mongoclient/mongoclient
```

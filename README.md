## Pré-requisitos
```
npm or yarn (recommended)
nodejs
cassandra
Docker
docker-compose
```

## Iniciando as aplicações
```
$ sudo docker-compose up
```
Este comando irá iniciar o banco de dados cassandra aceitando comandos cql na porta 5432.

Para rodar a aplicação que carrega os tweets, a partir da pasta raiz do projeto, rode os seguintes comandos:
```
$ cd hashtag-loader-node
$ yarn start
```
**Importante: para que seja possível carregar os tweets, é necessário passar um token válido da API do Twitter através da variável de ambiente `TWITTER_BEARER_TOKEN`**

## Criando keyspaces e tabelas
Na pasta raiz do projeto, rode o seguinte comando:
```
$ ./database/create-database ./database
```


## Construind a imagem docker botweet-springboot (não use esta opção)
Esta imagem está sendo mantida para ser usada no relatório somente.
```
$ cd hashtag-loader
$ ./mvnw install
$ sudo docker build -t botweet-springboot .
```

## Interagindo com o Bot
Para interagir com o Bot, basta enviar uma mensagem no seguinte formato: **#hashtag_name** e o Bot irá responder com as estatísticas dos tweets da hashtag solicitada.

## Pré-requisitos
```
npm or yarn (recomendado)
Nodejs
Docker
docker-compose
```

## Iniciando as aplicações
```
$ sudo docker-compose up -d
```
Este comando irá iniciar todas as aplicações, banco de dados e criará o *schema* do banco de dados.

## Aplicações
### Banco de dados Cassandra
O banco de dados aceita comandos CQL através da porta 9042.
Para acessar o banco diretamente, rode o comando
```
$ docker exec -it botweet-cassandra cqlsh
```
### Tweets API
API que executa as consultas propostas através do PySpark acessando o banco de dados Cassandra.
Esta API, por padrão, roda em `http://localhost:5000`

Endpoints disponíveis:
```
GET /hashtags
GET /hashtags/<hashtag>/tweets/lang/<lang>
GET /hashtags/<hashtag>/tweets/lang/<lang>/count
GET /hashtags/<hashtag>/tweets/count/by-hour
GET /hashtags/<hashtag>/users/most-followed
```

### Hashtag loader (node)
API que carrega as informações dos tweets de uma hashtag no banco de dados. Esta API, por padrão, roda em `http://localhost:3000`

Endpoints disponíveis:
```
POST /hashtags/<hashtag>
```
**Importante: para que seja possível carregar os tweets, é necessário passar um token válido da API do Twitter através da variável de ambiente `TWITTER_BEARER_TOKEN`.**

### Bot do Telegram
Aplicação Node.js que interpreta mensagens recebidas pelo Bot do Telegram.

**Importante: para que o Bot rode corretamente, é necessário passar um token de Bot do Telegram através da variável de ambiente `TELEGRAM_BOT_TOKEN`.**

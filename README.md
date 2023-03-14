# Getting started

Start container:
```
cp .env.example .env
dokcer-compose up
```
Add custom domain in /etc/hosts
```
127.0.0.1 rabbitmq.test
```
Web UI available at: http://rabbitmq.test:15672

To run RabbitMQ cli tools inside container:
```
# For service management and general operator tasks
./rabbit.sh rabbitmqctl

# For diagnostics and health checking
./rabbit.sh rabbitmq-diagnostics

# For plugin management
./rabbit.sh rabbitmq-plugins

# For maintenance tasks on queues, in particular quorum queues
./rabbit.sh rabbitmq-queues

# For maintenance tasks on streams
./rabbit.sh rabbitmq-streams

# For maintenance tasks related to upgrades
./rabbit.sh rabbitmq-upgrade
```
Setup client:
```
cd client && npm i
cp .env.example .env
vi .env
```
You should run create / receive in different terminal panes so you can see how push mechanism works.

### Simple tasks queue
[![asciicast](https://asciinema.org/a/566071.svg)](https://asciinema.org/a/566071)
```
npm run create-task hello
npm run receive-task
```
### FANOUT mode
![rabbitmq-fanout](https://user-images.githubusercontent.com/8479569/225120469-a24df614-80d1-4a04-a6b1-0a633a608014.png)

[![asciicast](https://asciinema.org/a/566077.svg)](https://asciinema.org/a/566077)
```
npm run create-tasks hello
npm run receive-tasks taskq1
npm run receive-tasks taskq2
```
Note that nacked messages are requeued.

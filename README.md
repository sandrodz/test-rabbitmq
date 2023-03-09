# Notes

Start container:
```
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

To run simple tasks queue:
```
npm run create-task hello
npm run receive-task
```
To run queue in FANOUT mode:
```
npm run create-tasks hello
npm run receive-tasks taskq1
npm run receive-tasks taskq2
```

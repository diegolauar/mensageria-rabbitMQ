Loja Virtual - Microservices Architecture
Descrição do Projeto
Este projeto é uma aplicação distribuída baseada em microserviços para gerenciar o ciclo de vida de pedidos de uma loja virtual.
A aplicação é containerizada com Docker, utiliza PostgreSQL para persistência dos dados e RabbitMQ para comunicação assíncrona entre os serviços.

Diagrama de Microserviços
Visualize o diagrama completo online

O sistema possui quatro serviços principais:

Stock – Gerencia os produtos e quantidades disponíveis em estoque.
Order – Gerencia pedidos realizados pelos clientes.
Payment – Processa pagamentos dos pedidos.
Notification – Envia notificações via email em caso de sucesso ou erro.
Serviços e Responsabilidades
Serviço	Responsabilidade
Stock	Cadastro, atualização e controle de quantidades de produtos.
Order	Recebe pedidos, verifica estoque e atualiza status dos pedidos.
Payment	Processa pagamentos, atualiza status do pedido e envia eventos de pagamento.
Notification	Consome eventos de pagamento e envia email de confirmação ou rejeição.
Fluxo do Sistema
Criação de Pedido

Cliente envia requisição HTTP para o serviço Order.
Order consulta via HTTP o serviço Stock para verificar se os produtos estão disponíveis.
Se disponível, o pedido é registrado no banco de dados com status created e a quantidade é "reservada" no estoque.
Order envia mensagem para a fila payments_queue no RabbitMQ.
Processamento de Pagamento

Payment consome a mensagem e simula o pagamento.
Se aprovado:
Atualiza status do pedido para paid via HTTP no Order.
Registra o pagamento no seu banco.
Publica evento na fila notifications_queue.
Se rejeitado:
Reverte a quantidade no estoque via HTTP para o serviço Stock.
Atualiza status do pedido para rejected no Order.
Publica evento na fila notifications_queue.
Notificação

Notification consome mensagens da fila notifications_queue.
Valida se o pagamento foi confirmado.
Envia email ao cliente.
Registra a notificação no banco de dados.
Configuração do RabbitMQ
O sistema utiliza RabbitMQ para comunicação assíncrona entre os microserviços, com a seguinte configuração:

Exchange
Nome: events_order
Tipo: topic
Função: centraliza todos os eventos relacionados aos pedidos, permitindo que diferentes filas sejam ligadas a diferentes padrões de routing key.
Filas
1. payments_queue
Ligação (binding): order.created
Durabilidade: durable: true (sobrevive a reinicializações do broker)
Uso: recebe eventos de novos pedidos criados (order.created) para processar o pagamento.
2. notifications_queue
Ligação (binding): payment.completed
Durabilidade: durable: true
Uso: recebe eventos de pagamentos finalizados (payment.completed) para envio de notificações ao cliente.
Fluxo de mensagens
[Order Service] --(order.created)--> [payments_queue] --> [Payment Service] [Payment Service] --(payment.completed)--> [notifications_queue] --> [Notification Service]

Dependências
Node.js v23.11.1
Docker & Docker Compose
PostgreSQL
RabbitMQ

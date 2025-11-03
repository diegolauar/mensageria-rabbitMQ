# Loja Virtual - Microservices Architecture

## Descrição do Projeto

Este projeto é uma **aplicação distribuída baseada em microserviços** para gerenciar o ciclo de vida de pedidos de uma loja virtual.  
A aplicação é **containerizada com Docker**, utiliza **PostgreSQL** para persistência dos dados e **RabbitMQ** para comunicação assíncrona entre os serviços.

## Diagrama de Microserviços
[Visualize o diagrama completo online](https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=microservice.drawio&dark=auto#R%3Cmxfile%3E%3Cdiagram%20name%3D%22P%C3%A1gina-1%22%20id%3D%22lysIfZnb4Ixn4OZf4T6V%22%3E3Vrbdps4FP0aP9oLSWDgsXHSZtZqpp5JOmnmTTGyrQYjj5BjyNdXgLgKUhzbsTO8xGfrhs7ZZ%2BtCBmiyir5wvF7eMI%2F4A2h40QBdDiA0bWTKPwkSZ4htOhmw4NTLIFACt%2FSFKNBQ6IZ6JKxVFIz5gq7r4IwFAZmJGoY5Z9t6tTnz66Ou8YJowO0M%2Bzp6Tz2xzFAH2iV%2BTehimY8Mxm5WssJ5ZTWTcIk9tq1A6GqAJpwxkf1aRRPiJ87L%2FZK1%2B9xRWrwYJ4Ho02D4Y%2Fgzun%2B4e%2FkKp6Z1j75dw2ioovOM%2FY2asHpZEeceIJ50iDIZF0u2YAH2r0r0grNN4JFkGENaZZ2vjK0lCCT4kwgRq%2BjijWASWoqVr0qzMZOBOuemoJBt%2BEzViv%2BKXvg%2F2HmagfX4e2j8YTn%2FDnOOYL4g4pWJoyICkrqErYjgsWzHiY8Ffa6%2FB1YcWhT1SjfLH8rT7V5%2F7SUrXv8eEq55frukgtyucTrhrcyvutdwuM4YP6dR4n0ZByFfngUqEJ1OfCZckKgC6X5QpUMETUVflb8ot7dlNlhgBKwMXVZyoQLv48HW8OXy8CGJ203IHsR134m47W63zsLtHg6XafvEmFPfnzCf8XR4NMdjx0j6DQVnT6RSMrGRZRiniRowTxk2pEXtG%2FeOJTiaurR49hXBAcAZOVZdc5CuOXa75thH1JxxD%2B4H3qdk0yGtmY%2FDkM7qHqwzvy8PdW9VxddoUV6F9WaXGmHKqBy4Ggy7rv4gV%2F%2B8kyxBVLvq5kPrynB%2F01WWQ1pXaaiKqb89erYWveu7u6kWQUld0WC9TxcJw2cyKDJn0EVCcCp3iJ9UwYp6XqZrJKQv%2BDHtKonvOplLOjvrYmBdJn1JKQszVQOaRAUsIA09U9BhEsvSEguAlsW8hU%2FI6KbOXinlakG5FWz29FGECbgtwtTiP%2FtY%2FkPWKZZf6TIe%2F1DtU%2BMhMUZWbl5G1cLLWFnns2wDs%2Be6jeCe63baVK4JOK5UUMLQLbzQBU6NadAZN8iS9XlQiQT6afBv%2FPhIxc1%2Fh87IXlSYs0BUcCN9elBkv0SHrtU48iA0QmMt0cfmyER6rlfgg6c7PG26g93S%2FZD5Ou6Zr%2Fuejrry0bLNOifcfhuh3TO%2FORJUQT9q5ufXWadaR0ouPVTL9iTWEXhgG%2FbIrsXHNJIjh1E8oBcv2jbIjjFybdPNH2uXYTo2z7vTr2WCyOjx5q%2B2ORJp%2B9wBlQcytZeurTyNO4UpFnKLH6QINFCx1OQ3v1BjfYXCjuvsQuLUmhJOpRuSY0UGRlRkvRmOreyiM%2Fm77Csx4orR7OmA4lvcu%2F9OfM%2FutAoOd1ptdnXk02pxVVty%2B4YEIV7IMGON5f%2FjQ6utHbrGjrYVc9%2FzzAr7fDNpuwcKJWfEDtdDhRhUhECtlN1S8Ma92hkdzfpu9bquVN9JbaDTkAgE36o20Gl8ZNEuDI6sNkC%2F2pzieEXUaGd2EwPt5jep87gfRlDz4p9M0LmU3dQDH8GVRXocy5XSLD95Z%2Fwt%2F3EAXf0C%3C%2Fdiagram%3E%3C%2Fmxfile%3E)

O sistema possui quatro serviços principais:

1. **Stock** – Gerencia os produtos e quantidades disponíveis em estoque.
2. **Order** – Gerencia pedidos realizados pelos clientes.
3. **Payment** – Processa pagamentos dos pedidos.
4. **Notification** – Envia notificações via email em caso de sucesso ou erro.

---

## Serviços e Responsabilidades

| Serviço       | Responsabilidade                                                                 |
|---------------|---------------------------------------------------------------------------------|
| Stock         | Cadastro, atualização e controle de quantidades de produtos.                   |
| Order         | Recebe pedidos, verifica estoque e atualiza status dos pedidos.                 |
| Payment       | Processa pagamentos, atualiza status do pedido e envia eventos de pagamento.    |
| Notification  | Consome eventos de pagamento e envia email de confirmação ou rejeição.          |

---

## Fluxo do Sistema

1. **Criação de Pedido**
   - Cliente envia requisição HTTP para o serviço `Order`.
   - `Order` consulta via HTTP o serviço `Stock` para verificar se os produtos estão disponíveis.
   - Se disponível, o pedido é registrado no banco de dados com status `created` e a quantidade é "reservada" no estoque.
   - `Order` envia mensagem para a fila `payments_queue` no RabbitMQ.

2. **Processamento de Pagamento**
   - `Payment` consome a mensagem e simula o pagamento.
   - Se aprovado:
     - Atualiza status do pedido para `paid` via HTTP no `Order`.
     - Registra o pagamento no seu banco.
     - Publica evento na fila `notifications_queue`.
   - Se rejeitado:
     - Reverte a quantidade no estoque via HTTP para o serviço `Stock`.
     - Atualiza status do pedido para `rejected` no `Order`.
     - Publica evento na fila `notifications_queue`.

3. **Notificação**
   - `Notification` consome mensagens da fila `notifications_queue`.
   - Valida se o pagamento foi confirmado.
   - Envia email ao cliente.
   - Registra a notificação no banco de dados.

---

## Configuração do RabbitMQ

O sistema utiliza **RabbitMQ** para comunicação assíncrona entre os microserviços, com a seguinte configuração:

### Exchange

- **Nome:** `events_order`  
- **Tipo:** `topic`  
- **Função:** centraliza todos os eventos relacionados aos pedidos, permitindo que diferentes filas sejam ligadas a diferentes padrões de **routing key**.

### Filas

#### 1. payments_queue
- **Ligação (binding):** `order.created`  
- **Durabilidade:** `durable: true` (sobrevive a reinicializações do broker)  
- **Uso:** recebe eventos de novos pedidos criados (`order.created`) para processar o pagamento.

#### 2. notifications_queue
- **Ligação (binding):** `payment.completed`  
- **Durabilidade:** `durable: true`  
- **Uso:** recebe eventos de pagamentos finalizados (`payment.completed`) para envio de notificações ao cliente.

### Fluxo de mensagens
[Order Service] --(order.created)--> [payments_queue] --> [Payment Service] 
[Payment Service] --(payment.completed)--> [notifications_queue] --> [Notification Service]

---

## Dependências

- Node.js **v23.11.1**
- Docker & Docker Compose
- PostgreSQL
- RabbitMQ

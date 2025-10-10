# Vitrine - Aplicação Full-Stack de E-commerce

**Aplicação em Produção:** [https://vitrine-fawn.vercel.app/](https://vitrine-fawn.vercel.app/)

## Visão Geral

Vitrine é uma plataforma completa de e-commerce desenvolvida como um monorepo, com um frontend moderno em Next.js e um backend robusto em Node.js. A aplicação permite que usuários criem contas, gerenciem produtos (CRUD completo) em uma vitrine pessoal e compartilhem um link público para sua loja.

## Stack Tecnológica

| Área          | Tecnologias                                       |
|---------------|---------------------------------------------------|
| **Frontend** | Next.js (App Router), React, TypeScript, Tailwind CSS |
| **Backend** | Node.js, Express.js, TypeScript, JWT, Mongoose    |
| **Banco de Dados** | MongoDB                                           |
| **DevOps** | Docker, Vercel                                    |

## Arquitetura e Decisões Técnicas

Este projeto foi estruturado para simular um ambiente de produção profissional, focando em escalabilidade, manutenibilidade e boas práticas.

1.  **Estrutura Monorepo:** O código foi organizado em `frontend/` e `backend/` para facilitar o desenvolvimento e o deploy integrado, configurado através do `vercel.json`.

2.  **Backend com Arquitetura em Camadas:** A API segue um padrão de design claro, dividindo as responsabilidades em **Rotas**, **Controladores**, **Serviços** e **Repositórios**.

3.  **Autenticação Segura:** A segurança é tratada com tokens **JWT** e as senhas dos usuários são hasheadas com **bcrypt**, prevenindo ataques comuns.

4.  **Gerenciamento de Estado no Frontend:** A autenticação e os dados do usuário são gerenciados globalmente utilizando a **Context API** do React (`AuthContext`), evitando prop drilling e simplificando o acesso aos dados em toda a aplicação.

5.  **Comunicação com a API:** Utilizo um cliente **Axios** centralizado com `interceptors` para anexar automaticamente o token de autorização às requisições e para tratar erros de autenticação (como token expirado), redirecionando o usuário para a página de login.

## Como Executar Localmente

1.  **Clone o repositório.**
2.  **Backend:**
    * Navegue até a pasta `backend/`.
    * Crie um arquivo `.env` baseado nas variáveis necessárias descritas no `.env.example`.
    * Execute `npm install`.
    * Para o banco de dados, execute `docker-compose up -d` para iniciar um container MongoDB.
    * Execute `npm run dev` para iniciar o servidor.
3.  **Frontend:**
    * Navegue até a pasta `frontend/`.
    * Crie um arquivo `.env` baseado nas variáveis necessárias descritas no `.env.example`.
    * Execute `npm install`.
    * Execute `npm run dev`.
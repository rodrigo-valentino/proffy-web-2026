# Proffy Web

Aplicação web para conectar estudantes e professores, construída com React, TypeScript, Vite e Tailwind CSS.

## Executar localmente

Requisitos: Node.js e npm.

```bash
npm install
npm run dev
```

O Vite informa no terminal o endereço local da aplicação. Para validar o projeto:

```bash
npm run build
npm run lint
```

## Rotas implementadas

- `/` — página inicial.
- `/study` — busca de professores.
- `/give-classes` — formulário para cadastro de professor.
- `/give-classes/success` — confirmação de cadastro.
- `/profile` — perfil do professor, com edição dos dados e horários.
- `/sign-in` e `/sign-up` — telas de autenticação existentes.

## Decisões técnicas

- O formulário usa React Hook Form e Zod para gerenciar campos e validar dados, incluindo o limite de 300 caracteres da biografia, telefone com máscara e horários válidos.
- Os dados do professor são armazenados no `localStorage` para permanecerem disponíveis entre as telas e após recarregar a aplicação. O projeto ainda não possui uma API de cadastro.
- Os campos de nome e e-mail são preenchidos com os dados do usuário de demonstração da página inicial; eles podem ser editados no perfil.
- Horários são dinâmicos: podem ser adicionados no formulário e adicionados ou excluídos no perfil.

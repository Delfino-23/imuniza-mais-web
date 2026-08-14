# Imuniza+

Sistema de gerenciamento de vacinas — Imuniza+. Projeto front-end construído com React e Vite.

## Descrição

Interface administrativa para gerenciar pacientes, vacinas e aplicações. Projeto de exemplo/portfólio destinado a demonstrar uma pequena aplicação CRUD com integração via API.

## Tecnologias

- React
- Vite
- Tailwind CSS
- Axios

## Dependências (conforme `package.json`)

- axios: ^1.17.0
- react: ^18.3.1
- react-dom: ^18.3.1

DevDependencies:

- @vitejs/plugin-react: ^4.3.1
- autoprefixer: ^10.4.20
- postcss: ^8.4.47
- tailwindcss: ^3.4.14
- vite: ^5.4.10

## Requisitos

- Node.js (recomendado >= 18)
- npm ou yarn

## Instalação

1. Instale as dependências:

```bash
npm install
# ou
yarn
```

2. Inicie o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

3. Build para produção:

```bash
npm run build
# ou
yarn build
```

4. Preview do build gerado:

```bash
npm run preview
# ou
yarn preview
```

## Estrutura básica

- [index.html](index.html) — página de entrada.
- [src/main.jsx](src/main.jsx) — ponto de entrada React.
- [src/App.jsx](src/App.jsx) — componente principal.
- [src/pages](src/pages) — páginas (`Login.jsx`, `Dashboard.jsx`, etc.).
- [src/components](src/components) — componentes reutilizáveis.
- [src/services/api.js](src/services/api.js) — configuração de chamadas API com Axios.

## Observações

- A senha padrão usada no componente de login é `TrocarSenha123` apenas para fins de demonstração — altere em produção.
- Ajuste a URL das APIs em [src/services/api.js](src/services/api.js#L1) conforme seu backend.

## Contato

Projeto criado como parte do TCC. Para dúvidas, abra uma issue ou entre em contato com o autor.

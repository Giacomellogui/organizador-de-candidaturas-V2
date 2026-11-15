# Organizador de Candidaturas

Aplicação para ajudar pessoas em busca de emprego a organizar suas candidaturas em um só lugar. Permite registrar vagas e acompanhar a etapa de cada processo seletivo.

## Funcionalidades

- Cadastrar empresa, cargo, link da vaga, data e etapa da candidatura.
- Editar os dados de uma candidatura.
- Cancelar uma edição sem salvar as alterações.
- Excluir candidaturas.
- Filtrar por etapa do processo seletivo.
- Mostrar a quantidade de candidaturas exibidas.
- Exibir uma mensagem quando não houver resultados.
- Salvar os dados no navegador com localStorage.
- Adaptar o layout para telas menores.

## Tecnologias utilizadas

- HTML: estrutura do formulário e das seções da página.
- CSS: cores, espaçamentos, botões e adaptação do layout.
- JavaScript: cadastro, edição, exclusão, filtros e armazenamento dos dados.

## Como executar

1. Baixe ou clone este repositório.
2. Abra a pasta do projeto no VS Code.
3. Inicie a página com a extensão Live Server.
4. Acesse o endereço local informado pela extensão.

## Armazenamento dos dados

As candidaturas são armazenadas no localStorage do navegador e recuperadas ao abrir a aplicação no mesmo endereço.

Os dados não são sincronizados entre dispositivos ou navegadores. Limpar os dados do site no navegador também remove as candidaturas salvas.

## Aprendizados

Durante o desenvolvimento, pratiquei:

- Formulários HTML e validação de campos obrigatórios.
- Estilização com CSS e uso de media queries.
- Manipulação de elementos da página com JavaScript.
- Eventos de envio, clique e mudança de seleção.
- Arrays, objetos, funções e condições.
- Conversão de dados com JSON.stringify e JSON.parse.
- Persistência de dados com localStorage.

## Possíveis melhorias

- Busca por empresa ou cargo.
- Ordenação por data da candidatura.
- Exportação e importação dos dados.
- Estatísticas por etapa do processo seletivo.
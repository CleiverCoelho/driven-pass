## 📝 Descrição

- Seu primeiro projeto *back-end* com o Nest será a reconstrução de um velho conhecido… A API do Tweteroo, um clone do Twitter (ou será que agora devemos chamar de… X?) - que foi o primeiro projeto back-end de vocês!
- Novamente, neste projeto você **NÃO DESENVOLVERÁ** o front-end do projeto. Ele já está pronto e disponível abaixo, na seção `🛠️ Recursos`.
    - No entanto, note que o front-end não está escrito em React e sim no formato web tradicional. Logo, para fazer ele funcionar em desenvolvimento, basta usar o bom e velho `Live Server` no VS Code.

## ⌚ DrivenTime

- Nomeie a pasta do seu projeto com: `projeto21-tweteroo`

## 🎨 Layout

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c23c3a17-17a4-459e-853e-a125695f4858/Untitled.png)

## 🛠️ Recursos

<aside>
🚨 **Atenção:** coloque no seu GitHub somente o código do back-end.

</aside>

- Código do front-end do projeto:
    
    [tweteroo__front__bonus.zip](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/ca8ebdf1-91a8-48c6-9ca1-7470365a4944/tweteroo__front__bonus.zip)
    

## ✅ Requisitos

- Geral
    - [ ]  O projeto deve ser desenvolvido inteiramente em NestJS.
    - [ ]  A porta utilizada pelo seu servidor deve ser a 3000 (padrão do Nest).
    - [ ]  O versionamento usando Git é obrigatório, crie um repositório público no seu perfil do GitHub apenas com o código do back-end.
    - [ ]  Faça commits a cada funcionalidade implementada.
    - [ ]  Não esqueça de criar o `.gitignore`, a `node_modules` não deve ser commitada.
    - [ ]  Seu projeto deve ter, obrigatoriamente, os arquivos `package.json` e `package-lock.json`, que devem estar na raiz do projeto. Eles devem conter todas as **dependências** do projeto.
- Armazenamento e formato dos dados
    - [ ]  Para persistir os dados (usuários e tweets), utilize variáveis globais em memória na camada de Service.
    - [ ]  Crie uma classe como abstração para reunir os comportamentos e atributos esperados para cada entidade.
    - [ ]  A localização das entidades fica a seu critério, recomendamos a pasta `models/`.
    - [ ]  O `User` deve ter as seguintes propriedades:
        
        ```tsx
        username: string;
        avatar: string; // url
        ```
        
    - [ ]  O `tweet` deve ter as seguintes propriedades:
        
        ```tsx
        user: User;
        tweet: string; // text
        ```
        
- **POST** `/sign-up`
    - [ ]  Deve receber (pelo `body` da request), um parâmetro `username` e um `avatar`, contendo o nome de usuário e a sua foto de avatar:
        
        ```jsx
        {
          username: "spongebob",
        	avatar: "https://avatars.akamai.steamstatic.com/d322ffa327f56fcebc08ac76b340742b930648c8_full.jpg"
        }
        ```
        
    - [ ]  Salvar esse usuário num array de usuários em memória.
    - [ ]  Por fim, retornar o status code `200 (OK)`.
- **POST** `/tweets`
    - [ ]  Se o usuário não estiver cadastrado (username não fez `sign-up` anteriormente), deve retornar status `401 (UNAUTHORIZED)`.
    - [ ]  Deve receber (pelo `body` da request), os parâmetros `username` e `tweet`:
        
        ```jsx
        {
        	username: "spongebob",
          tweet: "You like krabby patties, don’t you @Squidward?"
        }
        ```
        
    - [ ]  Salvar esse tweet num array de usuários em memória.
    - [ ]  Por fim, retornar o status code `201 (OK)`.
- Validação de dados
    - [ ]  Todas as rotas deverão validar os dados recebidos.
        - [ ]  Caso algum dado venha vazio ou em um formato inválido, o servidor deverá retornar o status code `400 (BAD REQUEST)` e não continuará com a execução da função.
        - [ ]  **POST** `/sign-up` precisa validar se os valores de `username` e `avatar` foram enviados e são strings. Caso contrário, deverá responder com a mensagem `"Todos os campos são obrigatórios!"`.
        - [ ]  **POST** `/tweets` precisa validar se os valores de `username` e `tweet` foram enviados e são strings. Caso contrário, deverá responder com a mensagem `"Todos os campos são obrigatórios!"`.
- **GET** `/tweets`
    - [ ]  Retornar os 15 últimos tweets publicados (de qualquer usuário):
        
        ```jsx
        [
        	{
        		username: "bobesponja",
        		avatar: "https://cdn.shopify.com/s/files/1/0150/0643/3380/files/Screen_Shot_2019-07-01_at_11.35.42_AM_370x230@2x.png",
        		tweet: "Eu amo hambúrguer de siri!"
        	}
        ]
        ```
        
    - [ ]  Caso não tenha nenhum tweet cadastrado, retorna um array vazio.
    - Paginação
        - [ ]  Esse endpoint deverá passar a receber uma página identificada via query string, no formato `?page=1`.
        - [ ]  Modifique o endpoint para retornar corretamente os tweets da “página” (`page`) atual, esse endpoint será chamado ao clicar no botão “**Carregar mais**” (isso já foi feito no front-end).
        - [ ]  A primeira página corresponde aos últimos 10 tweets, a segunda do 11 ao 20, a terceira do 21 ao 30, etc.
        - [ ]  Lembre-se de validar se o valor de `page` (query string) foi enviado e tem valor **maior ou igual a** **1.** Caso o valor não seja um número maior que 1, deverá responder com a mensagem “Informe uma página válida!” e com o status code 400 (BAD REQUEST).
        - [ ]  O parâmetro `page` continua opcional. Caso não seja enviado, deverá comportar como no requisito original (200, retornando últimos 10 tweets).
- **GET** `/tweets/USERNAME`
    - [ ]  Retornar todos os tweets publicados do usuário recebido por parâmetro de rota em um array no formato abaixo:
        
        ```jsx
        [
        	{
        		username: "bobesponja",
        		avatar: "https://cdn.shopify.com/s/files/1/0150/0643/3380/files/Screen_Shot_2019-07-01_at_11.35.42_AM_370x230@2x.png",
        	  tweet: "Eu amo hambúrguer de siri!"
        	},
        	{
        		username: "bobesponja",
        		avatar: "https://cdn.shopify.com/s/files/1/0150/0643/3380/files/Screen_Shot_2019-07-01_at_11.35.42_AM_370x230@2x.png",
        	  tweet: "Eu sou amigo do Patrick, ele é uma estrela!"
        	}
        ]
        ```
        
    - [ ]  Se não houver nenhum tweet deste usuário, retornar um array vazio.

### 📖 Você precisará consultar…

- Como ativar o CORS no NestJS
    
    [Documentation | NestJS - A progressive Node.js framework](https://docs.nestjs.com/security/cors#getting-started)
    
- O básico sobre tratamento de erros no NestJS (Exception Filters)
    
    [Documentation | NestJS - A progressive Node.js framework](https://docs.nestjs.com/exception-filters)
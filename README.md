# WebPorco

![npm](https://img.shields.io/npm/v/npm.svg)
![node](https://img.shields.io/badge/node-v8.11.2-green.svg)

Antes de inicializar o servidor é necessário instalar todas as dependências digitando no console

```console
$ npm install
```

Para popular o banco de dados com alguns produtos, o adiministrador e aguns serviços, digite o seguinte comando

```console
$ node seed/seeder.js
```

Para inicializar o servidor usamos o seguinte comando:

```console
$ npm start
```

Com o servidor rodando basta digitar no browser

```console
$ localhost:3000
```

### Administardor
Para acessar como administrador acesse a página de login pela navbar e entre com as informações

```console
Usuário: admin
Senha: admin
```

O administrador pode acessar as informações administrativas no perfil de usuário. Lá ele pode cadastrar e editar produtos e serviços


### Usuário comum

É possível se registrar como um usuário comum pelo link na navbar e caso o usuário já possua uma conta ele pode acessar usando o usuário e senha cadastrado.

Se o usuário quiser comprar um produto basta ele clicar no botão comprar embaixo de cada item e então uma unidade do produto selecionado é adicionado no carrinho de compras. Já na página do carrinho é possível remover todos os itens de um produto ou reduzi-lo em uma unidade, e ao clicar para finalizar a compra o usuário é redirecionado para uma página onde ele deve preencher as informações necessárias para finalizar a compra, como por exemplo, as informações do cartão de crédito.

Na página de perfil do usuário ele pode ver seus dados, as compras realizadas, os serviços agendados e também pode agendar novos serviços e cadastrar novos pets.

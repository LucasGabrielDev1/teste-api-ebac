Cypress.Commands.add('token', (email, senha) => {
    cy.request({
        method: 'POST',
        url: 'login',
        body: {
            "email": email,
            "password": senha 
        }
    }).then((response) => {
        expect(response.status).to.equal(200)
        return response.body.authorization
    })
 })

 Cypress.Commands.add('cadastrarProduto' , (token, produto, preco, descricao, quantidade) =>{
    cy.request({
        method: 'POST', 
        url: 'produtos',
        headers: {authorization: token}, 
        body: {
            "nome": produto,
            "preco": preco,
            "descricao": descricao,
            "quantidade": quantidade
          }, 
          failOnStatusCode: false
    })
 })

 Cypress.Commands.add('cadastrarUsuario', (usuario) => {
    cy.request({
      method: 'POST',
      url: '/usuarios', // endpoint da Serverest
      body: usuario,
      failOnStatusCode: false // opcional, caso queira tratar erros manualmente
    }).then((response) => {
      expect(response.status).to.eq(201); // ou o status que você espera
      Cypress.env('idUsuario', response.body._id); // guarda o ID do usuário criado
      return response;
    });
  });
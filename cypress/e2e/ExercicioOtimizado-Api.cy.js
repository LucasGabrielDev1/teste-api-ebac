/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contratos';
import { faker } from '@faker-js/faker';

describe('Testes da Funcionalidade Usuários', () => {
  const endpoint = 'usuarios';

  const gerarUsuario = () => ({
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 8 }),
    administrador: faker.datatype.boolean().toString()
  });

  it('Deve validar contrato de usuários', () => {
    cy.request(endpoint).then(response => {
      expect(response.status).to.eq(200);
      contrato.validateAsync(response.body);
    });
  });

  it('Deve listar usuários cadastrados - GET', () => {
    cy.request(endpoint).then(response => {
      expect(response.status).to.eq(200);
    });
  });

  it('Deve cadastrar um usuário com sucesso - POST', () => {
    cy.request('POST', endpoint, gerarUsuario()).then(response => {
      expect(response.status).to.eq(201);
      expect(response.body.message).to.eq('Cadastro realizado com sucesso');
    });
  });

  it('Deve validar um usuário com email inválido - POST', () => {
    cy.request({
      method: 'POST',
      url: endpoint,
      failOnStatusCode: false,
      body: {
        nome: 'Fulano da Silva',
        email: 'beltrano@qa.com.br',
        password: 'teste',
        administrador: 'false'
      }
    }).then(response => {
      expect(response.status).to.eq(400);
      expect(response.body.message).to.eq('Este email já está sendo usado');
    });
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    cy.request('PUT', `${endpoint}/0uxuPY0cbmQhpEz1`, {
      nome: 'Fulano da Silva',
      email: 'fulano@qa.com',
      password: 'teste',
      administrador: 'true'
    }).then(response => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.eq('Registro alterado com sucesso');
    });
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    cy.request('DELETE', `${endpoint}/V4izINIJYpm6LDok`).then(response => {
      expect(response.status).to.eq(200); // melhor validar status também
    });
  });
});

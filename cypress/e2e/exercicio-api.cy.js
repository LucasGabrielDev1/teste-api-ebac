/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contratos';
import { faker } from '@faker-js/faker';

describe('Testes da Funcionalidade Usuários', () => {

  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response => {
      expect(response.status).to.equal(200);
      return contrato.validateAsync(response.body);
    });
  });

  it('Deve listar usuários cadastrados - GET', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios'
    }).then(response => {
      expect(response.status).to.equal(200);
    });
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    const usuarioOriginal = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 8 }),
      administrador: faker.datatype.boolean().toString()
    };

    cy.request({
      method: 'POST',
      url: 'usuarios',
      body: usuarioOriginal,
      failOnStatusCode: false
    }).then(response => {
      expect(response.status).to.equal(201);
      const idUsuario = response.body._id;

      const usuarioEditado = {
        nome: 'Fulano da Silva',
        email: `fulano${Date.now()}@qa.com`,
        password: 'teste',
        administrador: 'true'
      };

      cy.request({
        method: 'PUT',
        url: `usuarios/${idUsuario}`,
        body: usuarioEditado,
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Registro alterado com sucesso');
        if (res.body.nome && res.body.email) {
          expect(res.body).to.have.property('nome', 'Fulano da Silva');
          expect(res.body).to.have.property('email', usuarioEditado.email);
        }
      });
    });
  });

  it('Deve validar um usuário com email inválido - POST', () => {
    cy.request({
      failOnStatusCode: false,
      method: 'POST',
      url: 'Usuarios',
      body: {
        nome: 'Fulano da Silva',
        email: 'beltrano@qa.com.br',
        password: 'teste',
        administrador: 'false'
      }
    }).then(response => {
      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('Este email já está sendo usado');
    });
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    const usuarioOriginal = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 8 }),
      administrador: faker.datatype.boolean().toString()
    };

    cy.request({
      method: 'POST',
      url: 'usuarios',
      body: usuarioOriginal,
      failOnStatusCode: false
    }).then(response => {
      expect(response.status).to.equal(201);
      const idUsuario = response.body._id;

      cy.request({
        method: 'DELETE',
        url: `usuarios/${idUsuario}`,
        failOnStatusCode: false
      }).then(deleteResponse => {
        expect(deleteResponse.status).to.equal(200);
        expect(deleteResponse.body.message).to.equal('Registro excluído com sucesso');
      });
    });
  });

});

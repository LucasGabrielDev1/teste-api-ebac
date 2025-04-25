/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contratos'
import { faker } from '@faker-js/faker';

describe('Testes da Funcionalidade Usuários', () => {

  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response => {
      expect(response.status).to.equal(200)
      return contrato.validateAsync(response.body)
    })


  }); //CONCLUIDO

  it('Deve listar usuários cadastrados - GET', () => {
    cy.request({
    method: 'GET',
    url: 'usuarios'
    }).then((response => {
      expect(response.status).equal(200)
    }))
  }); //CONCLUIDO

  it('Deve cadastrar um usuário com sucesso - POST', () => {
    cy.request({
      method: 'POST',
      url: 'usuarios',
      body: {
        nome: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 8 }),
        administrador: faker.datatype.boolean().toString()
      }
    }).then((response => {
      expect(response.status).to.equal(201)
      expect(response.body.message).to.equal('Cadastro realizado com sucesso')
    }))
  }); //CONLUIDO

  it('Deve validar um usuário com email inválido - POST', () => {
    cy.request({
      failOnStatusCode: false,
      method: 'POST',
      url: 'Usuarios',
      body: {
          "nome": "Fulano da Silva",
          "email": "beltrano@qa.com.br",
          "password": "teste",
          "administrador": "false"
          
      }
    }).then((response => {
      expect(response.status).to.equal(400)
      expect(response.body.message).to.equal('Este email já está sendo usado')
    }))
  }); //CONCLUIDO

  it('Deve editar um usuário previamente cadastrado', () => {
    cy.request({
      method: 'PUT',
      url: 'usuarios/0uxuPY0cbmQhpEz1',
      body: {
      
          "nome": "Fulano da Silva",
          "email": "fulano@qa.com",
          "password": "teste",
          "administrador": "true"
        
      }
    }).then((response => {
      expect(response.body.message).to.equal('Registro alterado com sucesso')
      expect(response.status).to.equal(200)
    }))
  }); //CONCLUIDO

  it('Deve deletar um usuário previamente cadastrado', () => {
    cy.request({
      method: 'DELETE',
      url: 'usuarios/V4izINIJYpm6LDok',

    })
  }); //CONCLUIDO


});

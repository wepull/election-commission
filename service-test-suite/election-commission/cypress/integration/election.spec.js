const { expect } = require("chai")

describe('Testing Election Commission Webpage', () => {

  it('Testing valid text in web-page',()=> {
    cy.visit(Cypress.env('ROOST_SVC_URL'))
   
    cy.contains('Election Commission Admin Portal')
    cy.contains("Add Candidate")
    .should('be.visible')
    .click()
    cy.contains('Add your candidates for election of K8s distribution here')
    cy.contains("Candidate's Name")
    cy.contains("Candidate's Picture")
  })

  it('Testing adding the candidate in web-page',()=>{
    cy.visit(Cypress.env('ROOST_SVC_URL'))

    cy.intercept(
      {
        method: 'POST', 
        url: '*ecserver*', 
      }
    ).as('postresult')  

    cy.contains("Add Candidate").click()
    cy.get("#candidateNameInput").type("RoostK8s")
    cy.get("#candidateImageUrlInput").type("https://content.roost.io/content/images/2021/05/Roost-3D-Metallic---Horizontal---Light-Silver.png")
    cy.contains("Submit").should('be.visible').click()

    cy.wait('@postresult',{ responseTimeout: 5000 }).then((interception) => {

      assert.isNotNull(interception.response.body, '{code: 201 }')
    })

    cy.contains("Add Candidate").click()
    cy.get("#candidateNameInput").type("Helm")
    cy.get("#candidateImageUrlInput").type("https://helm.sh/img/helm.svg")
    cy.contains("Submit").should('be.visible').click()

    cy.wait('@postresult',{ responseTimeout: 5000 }).then((interception) => {

      assert.isNotNull(interception.response.body, '{code: 201 }')
    })

  })

  it('Testing deleting the candidate in web-page',()=>{

    cy.visit(Cypress.env('ROOST_SVC_URL'))
    cy.intercept(
      {
        method: 'DELETE',
        url: '*ecserver*', 
      }
    ).as('deleteresult')   
    cy.contains("Delete").click()
    cy.wait('@deleteresult',{ responseTimeout: 5000 }).then((interception) => {

      assert.isNotNull(interception.response.body, '{code: 201}')
    })
  })

})

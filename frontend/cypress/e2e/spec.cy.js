describe('System Integration: Login Flow', () => {

  // make sure an account exists for login test
  before(() => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8000/api/v1/auth/register',
      failOnStatusCode: false, 
      body: {
        email: "testuser@example.com",
        username: "test",
        password: "MySecretPassword123$"
      }
    }).then((response) => {
      if (response.status === 409) {
        cy.log('Account already exists - moving on anyway.');
      } else if (response.status === 200 || response.status === 201) {
        cy.log('New account created for this test.');
      }
    });
  });

  it('opens the profile popup, logs in, and verifies success', () => {
    cy.visit('http://localhost:8081'); 

    // click profile button to open the login screen
    cy.get('[aria-label="ProfileButton"]').click();

    // find the email input using its placeholder text
    cy.get('input[placeholder="Email Address"]').type('testuser@example.com');

    cy.get('input[placeholder="Password"]').type('MySecretPassword123$');

    // submit
    cy.get('[aria-label="LoginSubmit"]').click();

    // check if worked
    cy.contains('Hello,').should('be.visible');
  });
});

describe.skip('System Integration: Audio Chunk Upload', () => {
  
  it('successfully uploads a single chunk directly to FastAPI', () => {
    cy.fixture('dummy.m4a', 'binary').then((audioBinary) => {
      const blob = Cypress.Blob.binaryStringToBlob(audioBinary, 'audio/m4a');
      
      // Generate real UUIDs so FastAPI's validation passes
      const testFileId = crypto.randomUUID(); 
      const testSessionId = crypto.randomUUID();

      const formData = new FormData();
      formData.append("session_id", testSessionId);
      formData.append("chunk_index", "0");
      formData.append("is_final", "true");
      formData.append("context_mode", JSON.stringify("Online"));
      formData.append("audio", blob, "chunk_0.m4a");

      cy.window().then((win) => {
        cy.wrap(
          win.fetch(`http://localhost:8000/api/v1/upload-audio?file_id=${testFileId}`, {
            method: 'POST',
            body: formData,
          }), {timeout: 30000}
        ).then(async (response) => {
          
          // Let's extract the exact JSON response from FastAPI
          const responseData = await response.json();
          
          // Print the exact error if it fails again
          if (response.status === 422) {
            cy.log('FASTAPI VALIDATION ERROR:', JSON.stringify(responseData.detail));
            console.error('FASTAPI 422 ERROR DETAILS:', responseData.detail);
          }

          // Assert success
          expect(response.status).to.eq(200); 
        });
      });
    });
  });
});
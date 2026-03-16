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


describe('System Integration: Create Account Flow', () => {
  const uniqueId = Date.now();
  const testEmail = `testuser+${uniqueId}@example.com`;
  const testUsername = `testuser_${uniqueId}`;
  const testPassword = "MySecretPassword123$";
  

  it('opens the profile popup, creates and account, is logged in', () => {
    cy.visit('http://localhost:8081'); 

    cy.get('[aria-label="ProfileButton"]').click();

    // click profile button to open the login screen
    cy.get('[aria-label="createAccount"]').click();

    // find the email input using its placeholder text
    cy.get('input[placeholder="Email Address"]').type(testEmail);

    cy.get('input[placeholder="First Name"]').type(testUsername);


    cy.get('input[placeholder="Password"]').type('MySecretPassword123$');
    cy.get('input[placeholder="Confirm Password"]').type('MySecretPassword123$');

    // submit
    cy.get('[aria-label="CreateAccountSubmit"]').click();

    // check if worked
    cy.contains('Hello,').should('be.visible');


    cy.contains('Hello,').should('be.visible');
  });
});


describe('System Integration: Delete Account Flow', () => {

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

   it('opens the profile, logs in, and deletes account', () => {
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

    cy.get('[aria-label="SettingsButton"]').click();
    cy.get('[aria-label="DeleteAccountButton"]').click();
    cy.get('[aria-label="ConfirmDeleteCheckbox"]').click();
    cy.get('input[placeholder="Password"]').type('MySecretPassword123$');
    cy.get('[aria-label="ConfirmDeleteAccountButton"]').click();
    cy.contains('have an account?').should('be.visible');

  });
});


describe('System Integration: Audio and Stats Flow', () => {
  let authToken = '';

  beforeEach(() => {
    cy.visit('http://localhost:8081'); 
    // log in and remember the token for the dummy file later
    cy.get('[aria-label="ProfileButton"]').click();
    cy.get('input[placeholder="Email Address"]').type('testuser@example.com');
    cy.get('input[placeholder="Password"]').type('MySecretPassword123$');
    
    // intercept the login to grab the token
    cy.intercept('POST', '**/api/v1/auth/login').as('login');
    cy.get('[aria-label="LoginSubmit"]').click();
    
    cy.wait('@login').then((interception) => {
      authToken = interception.response.body.access_token;
    });

    cy.contains('Hello,').should('be.visible');
    cy.get('[aria-label="ClosePopup"]').click();
  });  

  it('uploads dummy audio, interacts with recording UI, and checks metrics arrive back', () => {
    cy.fixture('dummy.m4a', 'binary').then((audioBinary) => {
      const blob = Cypress.Blob.binaryStringToBlob(audioBinary, 'audio/m4a');
      const testSessionId = crypto.randomUUID();
      const testFileId = crypto.randomUUID();

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
            headers: { 'Authorization': `Bearer ${authToken}` } 
          }),
          { timeout: 30000 }
        ).then((response) => {
          expect(response.status).to.eq(200);
          cy.log('Backend successfully processed the dummy audio!');
        });
      });
    });

    cy.get('[aria-label="Record"]').click();
    cy.wait(1000); 
    cy.get('[aria-label="Stop"]').click();

    cy.request({
      method: 'GET',
      url: 'http://localhost:8000/api/v1/metrics/latest',
      failOnStatusCode: false, 
      headers: {
        'Authorization': `Bearer ${authToken}` 
      }
    }).then((response) => {
      cy.log('RAW /metrics/latest RESPONSE:', JSON.stringify(response.body));
      console.log('CYPRESS API CHECK:', response.body);
      
      expect(response.status).to.eq(200);
      expect(response.body.duration).to.be.closeTo(2.58, 0.2); 
      expect(response.body.context_mode).to.include('Online');
    });

    cy.get('[aria-label="Delete"]').click();
  });

  it('display data on the stats screen', () => {
    cy.intercept('GET', '**/api/v1/auth/me', {
      statusCode: 200,
      body: {
        id: "fake-user-uuid-123",
        email: "testuser@example.com",
        username: "test"
      }
    }).as('getMe');
    
    cy.intercept('POST', '**/api/v1/graphs*', {
      statusCode: 200,
      body: [
        {
          audio_id: "mock-uuid-999",
          name: "Perfect Mocked Speech",
          created_at: "2026-03-12T17:41:00", 
          duration: 300.5,
          wpm: 155.0,
          context_mode: '"In-Person"', 
          graph_volume: [-30.0, -25.0, -10.0],
          graph_freq: [110.0, 115.0, 120.0]
        }
      ]
    }).as('getMockedGraphs');

    cy.get('[aria-label="statsButton"]').click();

    cy.wait('@getMe');
    cy.wait('@getMockedGraphs');

    cy.contains('Perfect Mocked Speech').should('be.visible');
    cy.contains('300.5').should('be.visible'); // Duration
    cy.contains('155').should('be.visible');   // WPM
    cy.contains('In-Person').should('be.visible'); // Context Mode
  });

});
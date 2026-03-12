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



describe('Full E2E Flow: Record, Stop, Post Record Stats, Go to Stats Page', () => {
  let authToken = '';

  before(() => {
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

  it('uploads dummy audio, clicks through the UI, and checks stats', () => {
    
    // dummy audio file from fixtures folder
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
      expect(response.body.duration).to.be.closeTo(2.58, 0.2); // Allows a tiny bit of math variance
      expect(response.body.context_mode).to.include('Online');
    });

    cy.get('[aria-label="Delete"]').click();

   // intercept calls so they don't go to real server
   cy.intercept('GET', '**/api/v1/auth/me', {
      statusCode: 200,
      body: {
        id: "fake-user-uuid-123",
        email: "testuser@example.com",
        username: "test"
      }
    }).as('getMe');
    
   // intercept calls so they don't go to real server
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

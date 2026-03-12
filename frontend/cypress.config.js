const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,
  e2e: {
    setupNodeEvents(on, config) {
      
      on('before:browser:launch', (browser = {}, launchOptions) => {
        
        if (browser.family === 'chromium') {
          launchOptions.args.push('--use-fake-ui-for-media-stream');
          launchOptions.args.push('--use-fake-device-for-media-stream');
        }
        return launchOptions;
      });
    },
  },
});

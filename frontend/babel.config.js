/*
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
*/


// changed to -->
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    
    plugins: [
      
    ],
  };
};

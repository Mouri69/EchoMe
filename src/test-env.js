// Test environment variable loading
console.log('=== ENVIRONMENT VARIABLE TEST ===');
console.log('process.env:', process.env);
console.log('REACT_APP_HUGGINGFACE_TOKEN:', process.env.REACT_APP_HUGGINGFACE_TOKEN);
console.log('All REACT_APP_ variables:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')));
console.log('=== END TEST ==='); 
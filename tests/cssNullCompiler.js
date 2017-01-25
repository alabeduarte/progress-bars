// Prevent mocha from interpreting CSS @import files
require.extensions['.css'] = () => { return null };

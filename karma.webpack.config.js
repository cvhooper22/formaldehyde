let context = require.context('./tests', true, /\.js$/);
context.keys().forEach(context);
context = require.context('./src', true, /\.js$/);
context.keys().forEach(context);

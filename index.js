var Metalsmith  = require('metalsmith');
var markdown    = require('metalsmith-markdown');
var layouts     = require('metalsmith-layouts');
var permalinks  = require('metalsmith-permalinks');

Metalsmith(__dirname)
  .source('src/site/')
  .destination('build')
  .metadata({
    title: 'time fades',
    description: 'time fades your social posts',
    author: 'sujal shah'
  })
  .use(markdown())
  .use(layouts({
    engine: 'handlebars',
    default: 'layout.html',
    directory: 'layouts'
  }))
  .build((err) => {
    if (err) throw err
  })

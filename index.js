const express = require('express')
const morgan = require('morgan')
const app = express()
const port = process.env.PORT || 3000

const WolframAlphaAPI = require('@wolfram-alpha/wolfram-alpha-api')
const waApi = WolframAlphaAPI('7WG284-4W5W64E4HU')

app.use(morgan('tiny'))

app.get('/', (req, res) => {
  res.send('Welcome to use this Wolfram Alpha private API endpoint!')
})

app.get('/getAnswer/:query', (req, res, next) => {
  // Extract the query parameter from the request
  const query = req.params.query;

  // Pass the query to the WolframAlphaAPI
  waApi.getFull(query)
    .then(queryresult => {
      // Format the queryresult into human-readable text
      const pods = queryresult.pods;
      const output = pods.slice(0, 2).map((pod) => {
        const subpodContent = pod.subpods.map(subpod =>
          `<img src="${subpod.img.src}" alt="${subpod.img.alt}">`
        ).join('\n');
        return `<h2>${pod.title}</h2>\n${subpodContent}`;
      }).join('\n');
      // Send the result back in the response
      res.send(output);
    })
    .catch(err => {
      // Handle any errors
      console.error(err);
      res.status(500).send('Something went wrong. Please try again later.');
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
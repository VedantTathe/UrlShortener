const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { nanoid } = require('nanoid');
const Url = require('../models/Url');
const router = express.Router();


router.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>URL Shortener API</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; background-color: #f4f4f4; }
          h1 { color: #333; }
        </style>
      </head>
      <body>
        <h1>Welcome to the URL Shortener API!</h1>
        <p>Use the endpoints below to shorten URLs, redirect, or get stats.</p>

        <h2>POST <code>/shorten</code></h2>
        <p><strong>Description:</strong> Send a long URL and receive a shortened version.</p>
        <p><strong>Body (JSON):</strong></p>
        <p>{<br>
  "longUrl": "https://example.com"<br>
}</p>
        <p><strong>Response:</strong></p>
        <p>{<br>
  "message": "URL shortened successfully!",<br>
  "shortUrl": "${req.protocol}://${req.get('host')}/abc123"<br>
}</p>

        <h2>GET <code>/:code</code></h2>
        <p><strong>Description:</strong> Redirects to the original long URL.</p>
        <p><strong>Example:</strong> <code>${req.protocol}://${req.get('host')}/abc123</code></p>

        <h2>GET <code>/stats/:code</code></h2>
        <p><strong>Description:</strong> Get stats for a shortened URL like click count and creation date.</p>
        <p><strong>Example:</strong> <code>${req.protocol}://${req.get('host')}/stats/abc123</code></p>
      </body>
    </html>
  `);
});

router.post('/shorten',
  body('longUrl').isURL().withMessage('Invalid URL'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { longUrl } = req.body;

    let code = nanoid(6);
    while (await Url.findOne({ shortCode: code })) {
      code = nanoid(6);
    }

    const newUrl = new Url({ longUrl, shortCode: code });
    await newUrl.save();

    res.status(201).json({
      message: 'URL shortened successfully!',
      shortUrl: `${req.protocol}://${req.get('host')}/${code}`
    });
  }
);


router.get('/:code', async (req, res) => {
  const url = await Url.findOne({ shortCode: req.params.code });

  url.clickCount++;
  await url.save();
  res.redirect(url.longUrl);
});


router.get('/stats/:code',
  param('code').notEmpty().withMessage('Code is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const url = await Url.findOne({ shortCode: req.params.code });
    if (!url) {
      return res.status(404).json({ message: 'Code not found in database.' });
    }

    res.json({
      message: 'Stats fetched successfully.',
      longUrl: url.longUrl,
      shortCode: url.shortCode,
      createdAt: url.createdAt,
      clickCount: url.clickCount
    });
  }
);

module.exports = router;

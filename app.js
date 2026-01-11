#!/usr/bin/env node

// Production-ready Next.js server starter
// This file is used by hosting panels as the application entry point

// Load environment variables from .env files (Next.js built-in loader)
require('@next/env').loadEnvConfig(process.cwd());

const { createServer } = require('http');
const next = require('next');

const port = parseInt(process.env.PORT || '3000', 10);
const hostname = process.env.HOSTNAME || 'localhost';
const dev = process.env.NODE_ENV !== 'production';

// Configure Next.js with minimal worker usage for constrained environments
const app = next({ dev, hostname, port });

const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    createServer(async (req, res) => {
      try {
        await handle(req, res);
      } catch (err) {
        console.error('Error handling request:', err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    }).listen(port, hostname, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> Environment: ${dev ? 'development' : 'production'}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start Next.js:', err);
    process.exit(1);
  });

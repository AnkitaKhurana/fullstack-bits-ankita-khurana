const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const http = require('http');

// Create docs directory if it doesn't exist
const docsDir = path.join(__dirname, '../docs');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir);
}

// Start the server on a different port
function startServer() {
  console.log('Starting documentation server...');
  // Set a different port for documentation
  process.env.PORT = '5050';
  
  const server = spawn('node', ['app.js'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    env: { ...process.env }
  });

  // Handle server errors
  server.on('error', (err) => {
    console.error('Server error:', err);
  });

  return server;
}

async function generateDocs() {
  let browser;
  let server;
  try {
    // Start the server on port 5050
    server = startServer();
    
    // Give the server some time to start
    console.log('Waiting for server initialization...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Wait for server to be ready
    await waitForServer('http://localhost:5050/api-docs');
    console.log('Documentation server is ready');

    // Give extra time for Swagger to initialize
    await new Promise(resolve => setTimeout(resolve, 2000));

    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: {
        width: 1920,
        height: 1080
      }
    });

    const page = await browser.newPage();
    
    console.log('Navigating to Swagger UI...');
    await page.goto('http://localhost:5050/api-docs', {
      waitUntil: ['networkidle0', 'domcontentloaded'],
      timeout: 60000
    });

    console.log('Waiting for Swagger UI to load...');
    await page.waitForSelector('.swagger-ui', { timeout: 30000 });

    // Give time for Swagger UI to fully render
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('Expanding all sections...');
    await page.evaluate(() => {
      document.querySelectorAll('.opblock-summary').forEach(el => el.click());
      document.querySelectorAll('.models h4').forEach(el => el.click());
      return new Promise(resolve => setTimeout(resolve, 2000));
    });

    // Wait for expanded sections to render
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Generating PDF...');
    await page.pdf({
      path: path.join(docsDir, 'api-documentation.pdf'),
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      },
      displayHeaderFooter: true,
      headerTemplate: '<div style="font-size: 10px; margin-left: 20px;">School Vaccination Portal API Documentation</div>',
      footerTemplate: '<div style="font-size: 10px; margin-left: 20px; width: 100%; text-align: center;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>'
    });

    console.log('Documentation generated successfully!');
  } catch (error) {
    console.error('Error generating documentation:', error);
    console.error('Error details:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
    if (server) {
      server.kill();
      console.log('Documentation server stopped');
    }
  }
}

const waitForServer = async (url, maxAttempts = 15) => {
  const checkServer = () => new Promise((resolve, reject) => {
    http.get(url, (res) => {
      if (res.statusCode === 200) {
        resolve(true);
      } else {
        reject(new Error(`Server returned status ${res.statusCode}`));
      }
    }).on('error', reject);
  });

  for (let i = 0; i < maxAttempts; i++) {
    try {
      await checkServer();
      return true;
    } catch (err) {
      console.log(`Attempt ${i + 1}: Waiting for server to start...`);
      // Increase wait time between attempts
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  throw new Error('Server not available');
};

generateDocs().catch(err => {
  console.error('Failed to generate documentation:', err);
  process.exit(1);
}); 
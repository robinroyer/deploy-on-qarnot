const http = require('http');
const fs = require('fs');
const path = require('path');
const QarnotSDK = require('@qarnot/sdk');
const { getTemplate, listTemplates } = require('./templates');

const PORT = process.env.PORT || 3000;
const DEFAULT_TEMPLATE = 'hello-world';

function serveStaticFile(res, filePath) {
    const ext = path.extname(filePath);
    const contentTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.svg': 'image/svg+xml'
    };

    try {
        const content = fs.readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' });
        res.end(content);
    } catch {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
    }
}

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch {
                reject(new Error('Invalid JSON'));
            }
        });
        req.on('error', reject);
    });
}

function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

async function launchTask(token, templateId) {
    const template = getTemplate(templateId);
    if (!template) {
        throw new Error(`Unknown template: ${templateId}. Available: ${listTemplates().join(', ')}`);
    }

    const qarnot = new QarnotSDK({ auth: token });
    const taskConfig = {
        ...template.config,
        name: `[deploy-on-qarnot] ${template.config.name}`
    };

    const task = await qarnot.tasks.submit(taskConfig);
    const links = template.getLinks ? template.getLinks(task) : [];

    return { task, links };
}

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    // Static files
    if (req.method === 'GET' && !url.pathname.startsWith('/api/')) {
        const filePath = url.pathname === '/' ? '/index.html' : url.pathname;
        serveStaticFile(res, path.join(__dirname, filePath));
        return;
    }

    // API: List templates
    if (req.method === 'GET' && url.pathname === '/api/templates') {
        sendJson(res, 200, { templates: listTemplates() });
        return;
    }

    // API: Launch task
    if (req.method === 'POST' && url.pathname === '/api/launch') {
        try {
            const { token, template = DEFAULT_TEMPLATE } = await parseBody(req);

            if (!token) {
                sendJson(res, 400, { error: 'Token is required' });
                return;
            }

            const { task, links } = await launchTask(token, template);
            sendJson(res, 200, { success: true, template, task, links });

        } catch (err) {
            console.error('Launch error:', err.message);
            sendJson(res, 500, { error: err.message });
        }
        return;
    }

    res.writeHead(404);
    res.end('Not found');
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Available templates: ${listTemplates().join(', ')}`);
});

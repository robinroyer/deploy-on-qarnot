# Deploy on Qarnot

Deploy tasks on Qarnot Computing from a simple web UI.

## Quick Start

### With Docker

```bash
make build
make serve
```

### Without Docker

```bash
npm install
npm start
```

Open http://localhost:3000

## Usage

1. Get your API token from https://tasq.qarnot.com/settings/access-token
2. Paste the token in the input field
3. Click "Lancer Open WebUI" to launch the task

## Templates

Use the `template` query parameter to deploy different payloads:

```
http://localhost:3000/?template=hello-world
```

### Adding a new template

Edit `templates.js`:

```javascript
const templates = {
    'hello-world': { ... },
    'my-app': {
        name: 'my-app',
        profile: 'docker-batch',
        instanceCount: 1,
        constants: [{
            key: 'DOCKER_CMD',
            value: 'echo "Running my app"'
        }]
    }
};
```

Then access it at: `http://localhost:3000/?template=my-app`

### List available templates

```
GET /api/templates
```

## Badge

Add a deploy button to your GitHub README:

```markdown
[![Deploy on Qarnot](https://your-server.com/badge.svg)](https://your-server.com/?template=my-app)
```

The badge is served at `/badge.svg`.

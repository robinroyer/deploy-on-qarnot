# Deploy on Qarnot

Web application to deploy tasks on Qarnot Computing platform.

## Architecture

- `server.js` - Node.js backend using @qarnot/sdk to launch tasks
- `templates.js` - Template registry for different Qarnot payloads
- `index.html` - Frontend UI for token input and task launching

## Template System

Templates are defined in `templates.js`. To add a new template:

```javascript
const templates = {
    'hello-world': { ... },
    'my-new-template': {
        name: 'my-new-template',
        profile: 'docker-batch',
        instanceCount: 1,
        constants: [{
            key: 'DOCKER_CMD',
            value: 'my-command'
        }]
    }
};
```

Access via URL: `/?template=my-new-template`

## API

### GET /api/templates
Lists available templates.

### POST /api/launch
Launches a task on Qarnot.

**Request body:**
```json
{ "token": "qarnot-api-token", "template": "hello-world" }
```

**Response:**
```json
{ "success": true, "template": "hello-world", "task": { ... } }
```

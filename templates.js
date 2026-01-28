const templates = {
    'hello-world': {
        name: 'hello-world',
        profile: 'docker-batch',
        instanceCount: 1,
        constants: [{
            key: 'DOCKER_CMD',
            value: 'echo "Hello World from Qarnot Computing!"'
        }]
    }
};

function getTemplate(templateId) {
    return templates[templateId] || null;
}

function listTemplates() {
    return Object.keys(templates);
}

module.exports = { getTemplate, listTemplates };

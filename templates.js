const templates = {
    'hello-world': {
        config: {
            name: 'hello-world',
            profile: 'docker-batch',
            instanceCount: 1,
            constants: [{
                key: 'DOCKER_CMD',
                value: 'echo "Hello World from Qarnot Computing!"'
            }]
        },
        getLinks: (task) => [
            {
                text: 'See deployment on Qarnot platform',
                url: `https://tasq.qarnot.com/tasks/${task.uuid}`
            }
        ]
    },
    'paraview': {
        config: {
            name: 'paraview',
            profile: 'paraview-web',
            instanceCount: 1,
            constants: []
        },
        getLinks: (task) => [
            {
                text: 'See deployment on Qarnot platform',
                url: `https://tasq.qarnot.com/tasks/${task.uuid}`
            }
        ]
    },
    'remote-desktop': {
        config: {
            name: 'remote-desktop',
            profile: 'python-wan-vnc',
            instanceCount: 1,
            constants: [
                {
                    key: 'VNC_PASSWORD',
                    value: '6lI0SD'
                },
                {
                    key: 'NO_EXIT',
                    value: 'true'
                }
            ],
        },
        getLinks: (task) => [
            {
                text: 'See deployment on Qarnot platform',
                url: `https://tasq.qarnot.com/tasks/${task.uuid}`
            },
            {
                text: 'Access remote desktop',
                url: `https://${task.uuid}-0-6080.gateway.qarnotservices.com/vnc.html?password=6lI0SD`
            }
        ]
    }
};

function getTemplate(templateId) {
    return templates[templateId] || null;
}

function listTemplates() {
    return Object.keys(templates);
}

module.exports = { getTemplate, listTemplates };

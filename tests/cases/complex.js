const Fractale = require('../../lib');

module.exports.title = 'Complex model';
module.exports.name = 'complex';
module.exports.tutorialized = false;

module.exports.resolver = (resolve) => {
    const { Configuration } = module.exports.get();
    const instance = new Configuration({
        "uuid": "d2b499d1-d796-42f0-b896-7816c7634366",
        "projects": [{
            "uuid": "bd88f577-6ceb-4cae-92af-04e89e578a59",
            "title": "Project 1",
            "name": "project 1",
            "directory": "/var/www/project_1"
        }, {
            "uuid": "f2c7e695-3643-48cb-b55a-a3d19346f1ec",
            "title": "Project 2",
            "name": "project_2",
            "directory": "/var/www/project_2"
        }, {
            "uuid": "4d83beaa-c532-4c17-a10d-cff32d2f1e52",
            "title": "Project 3",
            "name": "project_3",
            "directory": "/var/www/project_3"
        }, {
            "uuid": "83cf646f-ae13-4100-9125-e0d7e406a169",
            "title": "Project 4",
            "name": "project_4",
            "directory": "/var/www/project_4"
        }],
        "repositories": [],
        "tabs": [],
        "servers": [],
        "environments": [{
            "uuid": "a03560cb-7e54-48c1-aae7-c0e550bd95aa",
            "name": "local",
            "project": "bd88f577-6ceb-4cae-92af-04e89e578a59"
        }],
        "deployments": [],
    });

    resolve(instance);
};

module.exports.create = () => {
    const Project = Fractale.create('Complex_Project', {
        title: String,
        name: String,
        directory: String,
    });

    const Environment = Fractale.create('Complex_Environment', {
        name: String,
        project: Project,
    });

    const Server = Fractale.create('Complex_Server', {
        user: String,
        password: String,
        host: String,
        to: String,
        port: Number,
        environment: Environment,
    });

    const Deployment = Fractale.create('Complex_Deployment', {
        environment: Environment,
        servers: [Server],
        workspace: String,
        branch: String,
        tag: String,
        submodules: Boolean,
        requirements: {
            locals: [String],
            remotes: [String],
        },
        commands: {
            locals: [String],
            remotes: [String],
            restarts: [String],
        },
        ignores: [String],
        shared: {
            files: [String],
            folders: [String],
        },
        releases: Number,
        internal: {
            release: String,
        }
    });

    const Repository = Fractale.create('Complex_Repository', {
        type: String,
        url: String,
        project: Project,
    });

    const Tab = Fractale.create('Complex_Tab', {
        title: String,
        command: String,
        project: Project,
    });

    const Configuration = Fractale.create('Complex_Configuration', {
        projects: [Project],
        repositories: [Repository],
        tabs: [Tab],
        servers: [Server],
        environments: [Environment],
        deployments: [Deployment],
    });

    return { Configuration, Deployment, Environment, Project, Repository, Server, Tab };
};

let models;
module.exports.get = () => {
    if (models) return models;
    return models = module.exports.create();
};

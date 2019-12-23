const Fractale = require('../../lib');

module.exports.title = 'Complex model';
module.exports.name = 'complex';
module.exports.tutorialized = false;

module.exports.resolver = (resolve) => {
    const { Calendar } = module.exports.get();

    const instance = new Calendar({
        events: [
            {
                "id": 6,
                "tracker": "Anomalie",
                "status": "En cours",
                "subject": "Informations importantes",
                "project": "Cubitus",
                "priority": "Normal",
                "level": 20,
                "author": "Jocelyn",
                "description": null,
                "assignedTo": "Jocelyn",
                "startedAt": "2019-10-14",
                "dueAt": null,
                "start": "2019-10-14",
                "end": null,
                "estimatedHours": null,
                "color": "#007bff",
                "redmine": 1
            },
            {
                "id": 9,
                "tracker": "Évolution",
                "status": "Nouveau",
                "subject": "Ticket #1",
                "project": "Rank",
                "priority": "Normal",
                "level": 20,
                "author": "Jocelyn",
                "description": null,
                "assignedTo": "Jocelyn",
                "startedAt": "2019-10-16",
                "dueAt": null,
                "start": "2019-10-16",
                "end": null,
                "estimatedHours": null,
                "color": "#007bff",
                "redmine": 7
            },
            {
                "id": 8,
                "tracker": "Évolution",
                "status": "Nouveau",
                "subject": "Ticket #1",
                "project": "Perle à tout va",
                "priority": "Normal",
                "level": 20,
                "author": "Jocelyn",
                "description": null,
                "assignedTo": "Matthias",
                "startedAt": "2019-10-25",
                "dueAt": "2019-11-01",
                "start": "2019-10-25",
                "end": "2019-11-01",
                "estimatedHours": null,
                "color": "#007bff",
                "redmine": 6
            },
            {
                "id": 1,
                "tracker": "Anomalie",
                "status": "En attente",
                "subject": "Il faut réduire les images",
                "project": "Cubitus",
                "priority": "Haut",
                "level": 30,
                "author": "Jocelyn",
                "description": null,
                "assignedTo": "Jocelyn",
                "startedAt": "2019-11-14",
                "dueAt": "2019-11-20",
                "start": "2019-11-14",
                "end": "2019-11-20",
                "estimatedHours": null,
                "color": "#28a745",
                "redmine": 5
            },
            {
                "id": 2,
                "tracker": "Tâche",
                "status": "En attente",
                "subject": "Tache test #1",
                "project": "Cubitus",
                "priority": "Normal",
                "level": 20,
                "author": "Jocelyn",
                "description": null,
                "assignedTo": "Jocelyn",
                "startedAt": "2019-10-21",
                "dueAt": "2019-10-29",
                "start": "2019-10-21",
                "end": "2019-10-29",
                "estimatedHours": null,
                "color": "#007bff",
                "redmine": 9
            },
            {
                "id": 3,
                "tracker": "Tâche",
                "status": "Résolu",
                "subject": "Tache test #",
                "project": "Cubitus",
                "priority": "Normal",
                "level": 20,
                "author": "Jocelyn",
                "description": null,
                "assignedTo": "Jocelyn",
                "startedAt": "2019-11-05",
                "dueAt": "2019-10-28",
                "start": "2019-11-05",
                "end": "2019-10-28",
                "estimatedHours": null,
                "color": "#007bff",
                "redmine": 10
            },
            {
                "id": 4,
                "tracker": "Évolution",
                "status": "En cours",
                "subject": "Afficher les étapes d'un projet",
                "project": "Cubitus",
                "priority": "Immédiat",
                "level": 100,
                "author": "Jocelyn",
                "description": null,
                "assignedTo": "Jocelyn",
                "startedAt": "2019-11-11",
                "dueAt": null,
                "start": "2019-11-11",
                "end": null,
                "estimatedHours": null,
                "color": "#dc3545",
                "redmine": 3
            },
            {
                "id": 5,
                "tracker": "Tâche",
                "status": "Nouveau",
                "subject": "Savoir qui doit aller chercher les croissants",
                "project": "Cubitus",
                "priority": "Urgent",
                "level": 50,
                "author": "Jocelyn",
                "description": null,
                "assignedTo": "Jocelyn",
                "startedAt": "2019-10-28",
                "dueAt": "2019-10-31",
                "start": "2019-10-28",
                "end": "2019-10-31",
                "estimatedHours": null,
                "color": "#ffc107",
                "redmine": 2
            },
            {
                "id": 10,
                "tracker": "Évolution",
                "status": "En attente",
                "subject": "Ticket #1",
                "project": "RHSuite",
                "priority": "Normal",
                "level": 20,
                "author": "Jocelyn",
                "description": null,
                "assignedTo": "Jocelyn",
                "startedAt": "2019-11-09",
                "dueAt": null,
                "start": "2019-11-09",
                "end": null,
                "estimatedHours": null,
                "color": "#007bff",
                "redmine": 8
            },
            {
                "id": 7,
                "tracker": "Évolution",
                "status": "En cours",
                "subject": "Afficher le tableau Kanban des tâches par semaine",
                "project": "Cubitus",
                "priority": "Urgent",
                "level": 50,
                "author": "Jocelyn",
                "description": null,
                "assignedTo": "Jocelyn",
                "startedAt": "2019-11-05",
                "dueAt": null,
                "start": "2019-11-05",
                "end": null,
                "estimatedHours": null,
                "color": "#ffc107",
                "redmine": 4
            }
        ],
    });

    resolve(instance);
};

module.exports.create = () => {
    const Event = Fractale.create('Event', {
        color: String,
        index: Number,
        start: Date,
        end: Date,
        title: String,
        value: undefined,
    });

    const Resource = Fractale.create('Resource', {
        name: String,
        height: Number,
        events: [Event],
    });

    const Calendar = Fractale.create('Calendar', {
        events: [Event],
        resources: [Resource],
    });


    return { Event, Resource, Calendar };
};

let models;
module.exports.get = () => {
    if (models) return models;
    return models = module.exports.create();
};

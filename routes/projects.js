const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');


// Create a project
// api/projects
router.post('/',
    auth,
    [
        check('name', 'the name of the project is mandatory').not().isEmpty()
    ],
    projectController.createProject
);

// get all the projects
router.get('/',
    auth,
    projectController.getProjects
);

// update a project
router.put('/:id',
    auth,
    [
        check('name', 'the name of the project is mandatory').not().isEmpty()
    ],
    projectController.updateProject
);


// delete
router.delete('/:id',
    auth,
    projectController.deleteProject
);

module.exports = router;
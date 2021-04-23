const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');



// create task
// api/tasks
router.post('/',
    auth,
    [
        check('name', 'the name is necessary').not().isEmpty(),
        check('project', 'the project is necessary').not().isEmpty()
    ],
    taskController.createTask
);

// get tasks by project
router.get('/',
    auth,
    taskController.getTasks
);

// update task
router.put('/:id',
    auth,
    taskController.updateTask
);

// delete task
router.delete('/:id',
    auth,
    taskController.deleteTask
)


module.exports = router;
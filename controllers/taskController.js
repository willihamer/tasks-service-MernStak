const Task = require('../models/Task');
const Project = require('../models/Project');
const { validationResult } = require('express-validator');

// create a new task
exports.createTask = async (req, res) => {

    // check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }



    // extract project and check if it exist

    const { project } = req.body;


    try {

        const currentProject = await Project.findById(project);
        if (!currentProject) {
            return res.status(404).json({ msg: 'Project did not found' });
        }

        // check if the owner of the project is the current user
        if (currentProject.creator.toString() !== req.user.id) {
            return res.status(401).json({ msg: "unauthorized" });
        }

        // create the task
        const task = new Task(req.body);
        await task.save();
        res.json({ task });

    } catch (error) {
        res.status(500).send('there was an error');
    }

}

// get tasks by project
exports.getTasks = async (req, res) => {


    try {

        // extract project and check if it exist
        const { project } = req.query;

        const currentProject = await Project.findById(project);
        if (!currentProject) {
            return res.status(404).json({ msg: 'Project did not found' });
        }

        // check if the owner of the project is the current user
        if (currentProject.creator.toString() !== req.user.id) {
            return res.status(401).json({ msg: "unauthorized" });
        }

        // get tasks 
        const tasks = await Task.find({ project }).sort({ createAt: -1 });
        res.json({ tasks });

    } catch (error) {
        res.status(500).send('there was an error');
    }
}

// update a task
exports.updateTask = async (req, res) => {
    try {
        // extract project and check if it exist
        const { project, name, status } = req.body;


        // check if the task exists
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ msg: "the task does not exist" });
        }


        // check if the owner of the project is the current user
        const currentProject = await Project.findById(project);

        if (currentProject.creator.toString() !== req.user.id) {
            return res.status(401).json({ msg: "unauthorized" });
        }

        // create an object with the new info
        const newTask = {};
        newTask.name = name;
        newTask.status = status;
        
        // save the task
        task = await Task.findOneAndUpdate({ _id: req.params.id }, newTask, { new: true });

        res.json({ task });

    } catch (error) {
        res.status(500).send('there was an error');
    }
}

exports.deleteTask = async (req, res) => {
    try {
        // extract project and check if it exist
        const { project } = req.query;


        // check if the task exists
        let taskExists = await Task.findById(req.params.id);

        if (!taskExists) {
            return res.status(404).json({ msg: "the task does not exist" });
        }


        // check if the owner of the project is the current user
        const currentProject = await Project.findById(project);

        if (currentProject.creator.toString() !== req.user.id) {
            return res.status(401).json({ msg: "unauthorized" });
        }

        // delete
        await Task.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Task deleted' });

    } catch (error) {
        res.status(500).send('there was an error');
    }
}
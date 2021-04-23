const Project = require('../models/Project');
const { validationResult } = require('express-validator');


exports.createProject = async (req, res) => {

    // check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        //Create a new Project
        const project = new Project(req.body);

        // extract the creator
        project.creator = req.user.id;

        // save the project
        project.save();

        res.json(project);
    } catch (error) {
        console.log(error);
        res.status(500).send('Oops something gets wrong');
    }
}

// get all the projects
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ creator: req.user.id }).sort({ date: -1 });
        res.json({ projects });
    } catch (error) {
        console.log(error);
        res.status(500).send('Oops something gets wrong');
    }
}

// update project
exports.updateProject = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // extract the project info

    const { name } = req.body;
    const newProject = {};
    if (name) {
        newProject.name = name;
    }

    try {
        // check the id
        let project = await Project.findById(req.params.id);
        // check if the project exists
        if (!project) {
            return res.status(404).json({ msg: "project did not found" });
        }

        // check the project creator
        if (project.creator.toString() !== req.user.id) {
            return res.status(401).json({ msg: "unauthorized" });
        }

        // update
        project = await Project.findByIdAndUpdate({ _id: req.params.id }, { $set: newProject }, { new: true });

        res.json({ project })

    } catch (error) {
        console.log(error);
        res.status(500).send('Oops something gets wrong');
    }
}

// delete project by id

exports.deleteProject = async (req, res) => {
    try {
        // check the id
        let project = await Project.findById(req.params.id);
        // check if the project exists
        if (!project) {
            return res.status(404).json({ msg: "project did not found" });
        }

        // check the project creator
        if (project.creator.toString() !== req.user.id) {
            return res.status(401).json({ msg: "unauthorized" });
        }
        // delete project
        await Project.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Project deleted' })
    } catch (error) {
        console.log(error);
        res.status(500).send('Oops something gets wrong');
    }
}
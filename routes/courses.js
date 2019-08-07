
const express = require('express');
const router = express.Router();
const courses = [
            {id:1, courseName: 'New to C'},
            {id:2, courseName: 'New to Python'},
            {id:3, courseName: 'New to JS'}
        ];

        router.get('/', (req, res) => {
            res.send(courses)
        });

        router.get('/:id', (req, res) => {
            const returnedCourse = courses.find((course) => { return course.id === parseInt(req.params.id) })

            if (!returnedCourse) {
                res.status(404).send('Not found');
            } else {
                res.send(returnedCourse)
            }
        })
    

        router.post('/', (req, res) => {
            const { error } = validateCourse(req.body);
            if (error) {
                res.status(400).send(error.details[0].message);
                return;
            } 
            const course = {
                id: courses.length + 1,
                courseName: req.body.courseName
            }
            courses.push(course);
            res.send(courses);
        })
    

        router.put('/:id', (req, res) => {
            const selectedObject = courses.find((course) => {
                return course.id === parseInt(req.params.id)
            })
            if (!selectedObject) {
                res.status(404).send('Course not found.')
                return;
            }
            const { error } = validateCourse(req.body);
            if (error) {
                res.status(400).send(error.details[0].message);
                return;
            } 
            selectedObject.courseName = req.body.courseName;
            res.send(courses);
        })
    

   
        router.delete('/:id', (req, res) => {
            const selectedObject = courses.find((course) => {
                return course.id === parseInt(req.params.id)
            })
            if (!selectedObject) {
                res.status(404).send('Course not found.')
                return;
            }
            const index = courses.indexOf(selectedObject);
            courses.splice(index, 1);
            res.send(courses);
        })
    


module.exports = router;
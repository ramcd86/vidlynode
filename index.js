const Joi = require('joi');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

class App {

    constructor() {
        this.app = express();
        this.joi = Joi;
        this.init();
        this.courses = [
            {id:1, courseName: 'New to C'},
            {id:2, courseName: 'New to Python'},
            {id:3, courseName: 'New to JS'}
        ]
    }

    init() {
        this.middleWareInitialiser();
        this.getRoutes();
        this.postRoutes();
        this.updateRoutes();
        this.deleteRoutes();
        this.serverIntialiser();
    }

    middleWareInitialiser() {
        this.app.use(express.json());
    }

    getRoutes() {
        this.app.get('/', (req, res) => {
            res.send('Hello World!')
        });
        this.app.get('/api/courses', (req, res) => {
            res.send(this.courses)
        });
        this.app.get('/api/courses/:id', (req, res) => {
            const returnedCourse = this.courses.find((course) => { return course.id === parseInt(req.params.id) })

            if (!returnedCourse) {
                res.status(404).send('Not found');
            } else {
                res.send(returnedCourse)
            }
        })
    }

    postRoutes() {
        this.app.post('/api/courses', (req, res) => {
            const result = this.validateCourse(req.body);
            if (result.error) {
                res.status(400).send(result.error.details[0].message);
                return;
            } 
            const course = {
                id: this.courses.length + 1,
                name: req.body.courseName
            }
            this.courses.push(course);
            res.send(this.courses);
        })
    }

    updateRoutes() {
        this.app.put('/api/courses/:id', (req, res) => {
            const selectedObject = this.courses.find((course) => {
                return course.id === parseInt(req.params.id)
            })
            if (!selectedObject) {
                res.status(404).send('Course not found.')
                return;
            }
            const result = this.validateCourse(req.body);
            if (result.error) {
                res.status(400).send(result.error.details[0].message);
                return;
            } 
            selectedObject.courseName = req.body.courseName;
            res.send(this.courses);
        })
    }

    deleteRoutes() {

    }

    serverIntialiser() {
        this.app.listen(port, () => {
            console.log(`Application Listening on Port ${port}..`)
        })
    }

    validateCourse(course) {
        const schema = {
            courseName: this.joi.string().min(3).required()
        }
        return this.joi.validate(course, schema);
    }

}

new App();

// app.get('/', (req, res) => {
//     res.send('Hello World!')
// });

// app.get('/api/courses', (req, res) => {
//     const courses = [
//         { courseName: 'My course' }
//     ]
//     res.send(courses)
// });


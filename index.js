
const Joi = require('joi');
const express = require('express');
const logger = require('./logger');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
const app = express();
const port = process.env.PORT || 3000;

const courses = require('./routes/courses');

console.log(app.get('env'))

class App {

    constructor() {
        this.app = express();
        this.joi = Joi;
        this.init();

        this.genres = [
            {id:1, genre: 'Horror'},
            {id:2, genre: 'Scifi'},
            {id:3, genre: 'Fantasy'},
            {id:4, genre: 'Comedy'},
            {id:5, genre: 'Action'}
        ];

        this.coursesRoutes = courses;
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
        this.app.set('view engine', 'pug');
        this.app.set('views', './views');
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.static('public'));
        this.app.use(helmet());
        if (this.app.get('env') === 'development') {
            this.app.use(morgan('tiny'));
        }
        this.app.use(logger)
        this.app.use((req, res, next) => {
            console.log('Authenticaing...');
            next();
        });
        this.app.use('/api/courses', courses);
    }

    getRoutes() {
        this.app.get('/', (req, res) => {
            res.render('index', {
                title: 'My express app',
                message: 'Hello!'
            });
        });
        this.app.get('/api/genres', (req, res) => {
            res.send(this.genres)
        });
        this.app.get('/api/genres/:id', (req, res) => {
            const returnedCourse = this.genres.find((course) => { return course.id === parseInt(req.params.id) })

            if (!returnedCourse) {
                res.status(404).send('Not found');
            } else {
                res.send(returnedCourse)
            }
        })
    }

    postRoutes() {
        this.app.post('/api/genres', (req, res) => {
            const { error } = this.validateCourse(req.body);
            if (error) {
                res.status(400).send(error.details[0].message);
                return;
            } 
            const course = {
                id: this.genres.length + 1,
                name: req.body.genre
            }
            this.genres.push(course);
            res.send(this.genres);
        })
    }

    updateRoutes() {
        this.app.put('/api/genres/:id', (req, res) => {
            const selectedObject = this.genres.find((course) => {
                return course.id === parseInt(req.params.id)
            })
            if (!selectedObject) {
                res.status(404).send('Course not found.')
                return;
            }
            const { error } = this.validateCourse(req.body);
            if (error) {
                res.status(400).send(error.details[0].message);
                return;
            } 
            selectedObject.genre = req.body.genre;
            res.send(this.genres);
        })
    }

    deleteRoutes() {
        this.app.delete('/api/genres/:id', (req, res) => {
            const selectedObject = this.genres.find((course) => {
                return course.id === parseInt(req.params.id)
            })
            if (!selectedObject) {
                res.status(404).send('Course not found.')
                return;
            }
            const index = this.genres.indexOf(selectedObject);
            this.genres.splice(index, 1);
            res.send(this.genres);
        })
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


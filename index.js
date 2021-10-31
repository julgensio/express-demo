const Joi = require('joi');
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Custom data
const courses = [
	{ id: 1, name: 'courses1' },
	{ id: 2, name: 'courses2' },
	{ id: 3, name: 'courses3' },
];

app.get('/', (req, res) => {
	res.send('hello world!');
});

app.get('/api/courses', (req, res) => {
	res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
	const course = courses.find((c) => c.id === parseInt(req.params.id));
	if (!course)
		return res.status(404).send('The course with the given ID was not found.');
	res.send(course);
});

app.get('/api/courses/:year/:month', (req, res) => {
	res.send(req.query);
});

app.get('/api/courses/:id', (req, res) => {
	res.send(req.query);
});

app.post('/api/courses', (req, res) => {
	const { error } = validateCourse(req.body); // result.error
	if (error) return res.status(400).send(error.details[0].message);

	const course = {
		id: courses.length + 1,
		name: req.body.name,
	};
	courses.push(course);
	res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
	// Look up the course
	const course = courses.find((c) => c.id === parseInt(req.params.id));
	// If existing, return 400
	if (!course)
		return res.status(404).send('The course with the given ID was not found.');

	// const result = validateCourse(req.body);
	// Object destructuring
	const { error } = validateCourse(req.body); // result.error
	if (error) return res.status(400).send(error.details[0].message);

	// Update course
	course.name = req.body.name;
	// Return updated courses
	res.send(course);
});

function validateCourse(course) {
	// Validate
	const schema = {
		name: Joi.string().min(3).required(),
	};
	// if invalid, return 400 - Bed request
	return Joi.validate(course, schema);
}

app.delete('/api/courses/:id', (req, res) => {
	const course = courses.find((c) => c.id === parseInt(req.params.id));
	if (!course)
		return res.status(404).send('The course with the given ID was not found.');
	// Look up the course
	// Not existing, return 404

	// Delete
	const index = courses.indexOf(course);
	courses.splice(index, 1);

	// Return same course
	res.send(course);
});

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}..`));

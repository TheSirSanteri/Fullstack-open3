require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors');
const path = require('path');
const app = express()

//const db_password = process.env.DB_PASSWORD || process.argv[2];
//const url = `mongodb+srv://Fullstack:${db_password}@cluster0.7c9rh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.set('strictQuery', false);
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    });

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Contact = mongoose.model('Contact', contactSchema);

app.use(express.static('dist'));
app.use(express.json())
app.use(cors());

//POST pyyntöjen loggaaminen morganilla
morgan.token('body', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

/* Old dummy data
let contacts = [
    {id: "1", name: "Arto Hellas", number: "040-123456"},
    {id: "2", name: "Ada Lovelace", number: "39-44-5323523"},
    {id: "3", name: "Dan Abramov", number: "12-43-234345"},
    {id: "4", name: "Mary Poppendieck", number: "39-23-6423122"}
] */

app.get('/', (request, response) => {
    response.send(
        '<h1>Hello World!</h1>'
    
    )
})

app.get('/info', async (request, response) => {
    try {
    const currentTime = new Date().toString()
    const numberOfEntries = await Contact.countDocuments({});
    response.send(
        `<p>Phonebook has info for ${numberOfEntries} people</p>
         <p>${currentTime}</p>`
    )
    }catch (error) {
        response.status(500).json({ error: "Database error" })
    }
});
  
app.get('/api/persons', async (request, response) => {
        await Contact.find({}).then(contacts => {
            response.json(contacts);
        })
    .catch(error => next(error))
});

app.get('/api/persons/:id', async (request, response, next) => {
        await Contact.findById(request.params.id).then(person => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).send({error: 'Person was not found'});
            }
    }) 
    .catch(error => next(error))
})

app.delete('/api/persons/:id', async (request, response, next) => {
    await Contact.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end)
    .catch(error => next(error))

})


app.post('/api/persons', async (request, response, next) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'name or number is missing' });
    }

    await Contact.findOne({ name: body.name }).then(existingContact => {
        if (existingContact) {
            return response.status(400).json({ error: 'name must be unique' });
        }

        const newContact = new Contact({
            name: body.name,
            number: body.number
        });

        newContact
            .save()
            .then(savedContact => response.status(201).json(savedContact))
            .catch(error => next(error));
    });
});
  
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


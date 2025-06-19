require('dotenv').config()
const mongoose = require('mongoose');
const express = require('express')
const morgan = require('morgan')
const cors = require('cors');
const path = require('path');
const app = express()

//const db_password = process.env.DB_PASSWORD || process.argv[2];
//const url = `mongodb+srv://Fullstack:${db_password}@cluster0.7c9rh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
});

const Contact = require('./models/contact');

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



/*app.get('/', (request, response) => {
    response.send(
        '<h1>Hello World!</h1>'
    
    )
})
*/

app.get('/info', async (request, response, next) => {
    try {
    const currentTime = new Date().toString()
    const numberOfEntries = await Contact.countDocuments({});
    response.send(
        `<p>Phonebook has info for ${numberOfEntries} people</p>
         <p>${currentTime}</p>`
    )
    }catch (error) {
        next(error)
    }
});
  
app.get('/api/persons', async (request, response, next) => {
    try{
    const contacts = await Contact.find({})
    response.json(contacts.map(contact => ({
        id: contact.id.toString(), // Ensure id is included
        name: contact.name,
        number: contact.number
        })));
    } catch(error) {
        next(error)
    }
});

app.get('/api/persons/:id', async (request, response, next) => {
    try {
        const person = await Contact.findById(request.params.id);
        if (person) {
            response.json(person);
        } else {
            response.status(404).send({ error: 'Person was not found' });
        }
    } catch (error) {
        next(error);
    }
});

app.put('/api/persons/:id', async (request, response, next) => {
    try {
      const { name, number } = request.body;
      const updatedContact = await Contact.findByIdAndUpdate(
        request.params.id,
        { name, number },
        { new: true, runValidators: true, context: 'query' }
      );
      if (updatedContact) {
        response.json(updatedContact);
      } else {
        response.status(404).json({ error: 'Contact not found' });
      }
    } catch (error) {
      next(error);
    }
});

app.delete('/api/persons/:id', async (request, response, next) => {
    try {
        await Contact.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } catch(error) {
        next(error)
    }

})


app.post('/api/persons', async (request, response, next) => {
    try {
        const body = request.body

        if (!body.name || !body.number) {
            return response.status(400).json({ error: 'name or number is missing' })
        }

        const existingContact = await Contact.findOne({ name: body.name })
        if (existingContact) {
            return response.status(400).json({ error: 'name must be unique' })
        }

        const newContact = new Contact({
            name: body.name,
            number: body.number
        })

        const savedContact = await newContact.save()
        response.status(201).json(savedContact)
    } catch (error) {
        next(error)
    }
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
    console.error(error.name, error.message)

    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).json({ error: 'malformatted id' })
    }

    return response.status(500).json({ error: 'internal server error' })
}

app.use(errorHandler)

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


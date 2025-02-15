const express = require('express')
const morgan = require('morgan')
const cors = require('cors');
const path = require('path');
const app = express()

app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.json())
app.use(cors());

//POST pyyntöjen loggaaminen morganilla
morgan.token('body', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let contacts = [
    {id: "1", name: "Arto Hellas", number: "040-123456"},
    {id: "2", name: "Ada Lovelace", number: "39-44-5323523"},
    {id: "3", name: "Dan Abramov", number: "12-43-234345"},
    {id: "4", name: "Mary Poppendieck", number: "39-23-6423122"}
  ]

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/', (request, response) => {
    response.send(
        '<h1>Hello World!</h1>'
    
    )
})

app.get('/info', (request, response) => {
    const currentTime = new Date().toString()
    const numberOfEntries = contacts.length
    response.send(
        `<p>Phonebook has info for ${numberOfEntries} people</p>
         <p>${currentTime}</p>`
    )
})
  
app.get('/api/persons', (request, response) => {
    response.json(contacts)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = contacts.find(contacts => contacts.id === id)

    if (person){
        response.json(person)
    } else {
        response.status(404).send({ error: "Person not found"})
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    contacts = contacts.filter(contacts => contacts.id !== id)

    response.status(204).end()

})

app.post('/api/persons', (request, response) => {
    const body = request.body;

    //Error handeling, content missing
    if (!body.name || !body.number){
        return response.status(400).json({
            error: "name or number is missing"
        });
    }

    //Error handeling, person name already exists
    if (contacts.find(contacts => contacts.name === body.name)){
        return response.status(400).json({
            error: "name must be unique"
        });
    }

    //random ID string, name String, number String
    const newContact = {
        id: Math.floor(Math.random() * 100000).toString(),
        name: body.name,
        number: body.number
    }

    contacts = contacts.concat(newContact);
    response.status(201).json(newContact);
})
  
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; //Need to install UUID
import personsService from './Services/personsService.js'
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Feedback from './components/Feedback';


const App = () => {
  const [persons, setPersons] = useState([]); 
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    console.log('effect')
    personsService
      .getAll()
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response || []); // Debugging so persons are always an array
      })
      .catch(error => {
        console.error('Failed to fetch persons:', error);
        setMessage({ text: 'Failed to fetch persons from server', type: 'error' });
        setPersons([]); // Set to empty array on error
        setTimeout(() => setMessage(null), 5000);
      });
  }, [])


  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleFiltering = (event) => {
    setFilter(event.target.value);
  }

  const addPerson = (event) => {
    event.preventDefault();

    const personObject = {
      name: newName,
      number: newNumber,
    };

    const existingPerson = persons.find(person => person.name === newName); //Checks if person already exists
    if (existingPerson) {
      if (window.confirm(`${existingPerson.name} is already added to phonebook, replace the old number with new one?`)) {
        console.log(`Change confirmed id: ${existingPerson.id}`);
        personsService
        .update(existingPerson.id, personObject)
        .then(updatedPerson => {
          console.log('updated succesfully')
          setPersons(persons.map(person => person.id !== existingPerson.id ? person : updatedPerson))
          setNewName('')
          setNewNumber('')
          setMessage({ text: `Updated ${updatedPerson.name}`, type: 'success' });
          setTimeout(() => setMessage(null), 5000);
        })
        .catch(error => {
          console.error('Failed to update person:', error);
          setMessage({ text: `Information of ${existingPerson.name} has already been removed from server`, type: 'error' });
          setTimeout(() => setMessage(null), 5000);
      });
      }
    } else {

    personsService
    .create(personObject)
    .then(response => {
      setPersons(persons.concat(response));
      console.log("Persons array before rendering:", persons);
      setNewName('');
      setNewNumber('');
      setMessage({ text: `Added ${response.name}`, type: 'success' });
      setTimeout(() => setMessage(null), 5000);
    })
    .catch(error => {
      console.error('Failed to add person:', error.response ? error.response.data : error.message);

      const errorMsg = error.response && error.response.data && error.response.data.error
        ? error.response.data.error
        : 'Failed to add person';

      setMessage({ text: errorMsg, type: 'error' });
      setTimeout(() => setMessage(null), 5000);
    });
    }
};

const removePerson = (name, id) => {
    console.log(`Attempting to remove ${name} with id ${id}`); // Debugging
  
    if (!id) {
      console.error("Invalid ID (undefined or null):", id);
      return;
    }
  
    if (window.confirm(`Delete ${name}?`)) {
      personsService
        .remove(id)
        .then(() => {
          console.log("Before state update:", persons);
          setPersons(prevPersons => 
            prevPersons.filter(person => (person.id || person._id) !== id)
          );
          setMessage({ text: `Deleted ${name}`, type: "success" });
          setTimeout(() => setMessage(null), 5000);
        })
        .catch(error => {
          console.error("Failed to delete person:", error);
          setMessage({ text: `Failed to delete ${name}`, type: "error" });
          setTimeout(() => setMessage(null), 5000);
        });
    }
};
  
const personsToShow = (persons || [])
  .filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )
  .map(person => ({
    id: person.id || person._id, // Ensure correct field is used
    name: person.name,
    number: person.number
  }));

  //console.log("Corrected personsToShow:", personsToShow);

  //console.log("Persons state:", persons);
  //console.log("Filtered persons:", personsToShow);

  return (
    <div>
      <h2>Phonebook</h2>
      <Feedback message={message} />

      <Filter filter={filter} handleFiltering={handleFiltering}/>

      <h2>Add a new</h2>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>

      <Persons persons={personsToShow} removePerson={removePerson}/>

    </div>
  );
}

export default App;

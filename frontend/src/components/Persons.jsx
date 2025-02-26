const Person = ({ person, removePerson }) => {
    return (
        <li>
            {person.name} {person.number} 
            <button onClick={() => {
                console.log(`Attempting to remove: ${person.name} with id: ${person.id}`);
                if (!person.id) {
                    console.error("Error: person.id is undefined!");
                }
                removePerson(person.name, person.id);
            }}>
                delete
            </button>
        </li>
    );
};




const Persons = ({ persons, removePerson }) => {
    console.log("Rendering persons:", persons); // Debugging
  
    return (
      <div>
        <ul>
          {persons.map(person => (
            <Person key={person.id} person={person} removePerson={removePerson} />
          ))}
        </ul>
      </div>
    );
  };

export default Persons
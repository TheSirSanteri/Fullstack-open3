const Person = ({ person, removePerson }) => {
    return (
        <li>{person.name} {person.number} <button onClick={() => removePerson(person.name, person.id)}>delete</button></li>
    );
};


const Persons = ({ persons, removePerson }) => {
    return (
        <div>
            <ul>
            {persons.map(person => (
                <Person key={person.id} person={person} removePerson={removePerson}/>
            ))}
            </ul>
        </div>
    );
};

export default Persons
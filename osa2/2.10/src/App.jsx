import { useState } from 'react';
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'


const App = () => {
  const [persons, setPersons] = useState([{ name: 'Arto Hellas', number: '040-1234567' }]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  const addPerson = (event) => {
    event.preventDefault();
    const newPerson = { name: newName, number: newNumber };
    if (persons.some(person => person.name === newName)) {
      setError(`${newName} is already added to phonebook`);
    } else {
      setPersons(persons.concat(newPerson));
      setNewName('');
      setNewNumber('');
      setError('');
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const Person = ({ person }) => {
    return <li>{person.name} {person.number}</li>;
  };

  const personsToShow = filter
    ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons;

    return (
      <div>
        <h2>Phonebook</h2>
        <Filter filter={filter} handleFilterChange={handleFilterChange} />
        <h2>add a new</h2>
        <PersonForm
          addPerson={addPerson}
          newName={newName}
          handleNameChange={handleNameChange}
          newNumber={newNumber}
          handleNumberChange={handleNumberChange}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <h2>Numbers</h2>
        <Persons personsToShow={personsToShow} />
      </div>
    );
  };
  
  export default App;

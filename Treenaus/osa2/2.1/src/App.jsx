<<<<<<< Updated upstream
const Header = ({course}) => (
  <h1>{course}</h1>
)

const Part = ({part, exercises}) => (
  <p>{part} {exercises}</p>
)

const Content = ({part1, part2, part3, exercises1, exercises2, exercises3}) => {
  return(
    <div>
      <Part part={part1} exercises={exercises1} />
      <Part part={part2} exercises={exercises2} />
      <Part part={part3} exercises={exercises3} />
  </div>
  )
}

const Total = ({exercises1, exercises2, exercises3}) => {
return(
  <p>Number of exercises {exercises1 + exercises2 + exercises3}</p>
)
}


const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header course={course} />
      <Content 
      part1={part1} exercises1={exercises1}
      part2={part2} exercises2={exercises2}
      part3={part3} exercises3={exercises3} />
      <Total exercises1={exercises1} exercises2={exercises2} exercises3={exercises3} />
    </div>
  )
}

export default App
=======
import { useState } from 'react';
import Filter from './components/filter'
import PersonForm from './components/personform'
import Persons from './components/persons'


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
>>>>>>> Stashed changes

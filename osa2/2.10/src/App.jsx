import { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import FilterForm from './components/Filter'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState({ text: null, type: null })

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        console.log('promise fulfilled')
        setPersons(initialPersons)
      })
  }, [])


  const addPerson = (event) => {
    event.preventDefault()
    const personExists = persons.find(person => person.name === newName)
    if (personExists) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = { ...personExists, number: newNumber }
        updatePerson(personExists.id, updatedPerson)
      }
    } else {
      const newPerson = { name: newName, number: newNumber }
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setMessage({
            text: `Added ${returnedPerson.name}`,
            type: 'success'
          })
          setTimeout(() => {
            setMessage({ text: null, type: null })
          }, 5000)
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          setMessage({
            text: `Failed to add ${newPerson.name}. Error: ${error.response.data.error}`,
            type: 'error'
          })
          setTimeout(() => {
            setMessage({ text: null, type: null })
          }, 5000)
          console.error('Failed to add person', error)
        })
    }
  }

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name}`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setMessage({
            text: `Deleted ${person.name}`,
            type: 'success'
          })
          setTimeout(() => {
            setMessage({ text: null, type: null })
          }, 5000)
        })
        .catch(error => {
          setMessage({
            text: `Failed to delete ${person.name} has already been removed from the server.`,
            type: 'error'
          })
          setTimeout(() => {
            setMessage({ text: null, type: null })
          }, 5000)
          console.error('Failed to delete person', error)
        })
    }
  }

  const updatePerson = (id, updatedPerson) => {
    personService
      .update(id, updatedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
        setMessage({
          text: `Updated ${returnedPerson.name}`,
          type: 'success'
        })
        setTimeout(() => {
          setMessage({ text: null, type: null })
        }, 5000)
      })
      .catch(error => {
        setMessage({
          text: `Failed to update ${updatedPerson.name} has already been removed from the server.`,
          type: 'error'
        })
        setTimeout(() => {
          setMessage({ text: null, type: null })
        }, 5000)
        console.error('Failed to update person', error)
      })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message.text} type={message.type} />
      <FilterForm filter={filter} handleFilterChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App

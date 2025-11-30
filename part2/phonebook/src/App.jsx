import { useState, useEffect } from 'react'
import personService from './services/persons'

const Notification = (({errorMessage, successMessage}) => {
  if (errorMessage===null & successMessage===null) return null

  return (
    <div>
      { (errorMessage !== null) 
      ?  <div className="error">{errorMessage}</div>
      :  null  
      }
      { (successMessage !== null)
      ? <div className='success'>{successMessage}</div>
      : null
      }
    </div>
  )
})

const Filter = ({filter, onChange}) => <div>filter shown with <input value={filter} onChange={onChange} /></div>

const PersonForm = (props) => {
  return (
      <form onSubmit={props.onSubmit}>
        <div>name: <input value={props.newName} onChange={props.onChangeName} /></div>
        <div>number: <input value={props.newNumber} onChange={props.onChangeNumber} /></div>
        <button type="submit">add</button>
      </form>
  )
}

const Person = ({person, handleDelete}) => {
  return (
  <>
    <p>{person.name} {person.number} <button onClick={() => handleDelete(person)}>delete</button></p> 
  </>
  )
}

const FilteredList = ({persons, filter, handleDelete}) => {
  return (
    <>
      {persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase())).map((person) =>
        <Person key={person.id} person={person} handleDelete={handleDelete} />
      )}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  
  useEffect(() => {
    personService
      .getAll()
      .then(initPersons => setPersons(initPersons))
  }, [])

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleDelete = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService.remove(person.id)
      setPersons(persons.filter(p => p.id != person.id))
    }
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    if (persons.map((person) => person.name).includes(newName)) {
      const currPerson = persons.find(person => person.name === newName)
      if (currPerson.number === newNumber) {
        alert(`${newName} is already listed in the phonebook with this number`)
      } else {
        if (window.confirm(`${newName} is already added to the phonebook, do you want to replace the old number?`)) {
          const updatedPerson = {...currPerson, number: newNumber}
          personService
            .update(updatedPerson)
            .then(upP => {
              setPersons(persons.map(person => (person.id === upP.id) ? upP : person))
              setTimeout(() => setSuccessMessage(null), 5000)
              setSuccessMessage(`${newName}'s number has been changed`)
            })
            .catch(error => {
              setErrorMessage(`${newName}'s information has already been deleted from the server`)
              setTimeout(() => setErrorMessage(null), 5000)
              setPersons(persons.filter(person => person.id !== updatedPerson.id))
            })
            setNewName('')
            setNewNumber('')
        }
      }
      return
    }
    const newPerson = {
      name: newName,
      number: newNumber
    }
    personService
      .create(newPerson)
      .then(returnedPerson => setPersons(persons.concat(returnedPerson)))
    setSuccessMessage(`Added ${newName}`)
    setTimeout(() => setSuccessMessage(null), 5000)
    setNewName('')
    setNewNumber('')
  }
  const handleFilterChange = (event) => {
    const newFilter = event.target.value
    setFilter(newFilter)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification errorMessage={errorMessage} successMessage={successMessage} />
      <Filter filter={filter} onChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm onSubmit={handleSubmit} onChangeName={handleNameChange} onChangeNumber={handleNumberChange} newName={newName} newNumber={newNumber} />
      <h3>Numbers</h3>
      <FilteredList persons={persons} filter={filter} handleDelete={handleDelete}/>
    </div>
  )
}

export default App
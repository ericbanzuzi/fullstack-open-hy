import { useState } from 'react'
import phoneService from '../services/phonebook'

const PersonForm = ({persons, setPersons, setNotificationMessage}) => {

    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')

    const addPerson = (event) => {
        event.preventDefault()
        const person = {
          name: newName, 
          number: newNumber, 
          id: String(persons.length + 1),
        }
        
        if (persons.some(e => e.name === person.name)) {
          const replace = window.confirm(person.name + ' is already in the phonebook, do you want to replace the old number with the new one?')
          const originalPerson = persons.find(n => n.name === person.name)
          const updatePerson = {...originalPerson, number: newNumber}
          if (replace) {
            phoneService
            .update(originalPerson.id, updatePerson)
            .then(returnedPerson => {
              setPersons(persons.map(person => person.id !== returnedPerson.id ? person : returnedPerson))
              setNotificationMessage({
                type: 'success', 
                message: `Updated ${originalPerson.name}`
              })
            })
            .catch(error => {
              setNotificationMessage({
                type: 'error', 
                message: `The person ${originalPerson.name} was already deleted from server`
              })
              setTimeout(() => {
                setNotificationMessage(null)
              }, 5000)
            })
          }
        } else {
          phoneService
            .create(person)
            .then(returnedPerson => {
                setPersons(persons.concat(returnedPerson))
                setNewName('')
                setNewNumber('')
                setNotificationMessage({
                  type: 'success', 
                  message: `Added ${returnedPerson.name}`
                })
                setTimeout(() => {
                  setNotificationMessage(null)
                }, 5000)
            })
        }
    }

    const handleNameChange = (event) => setNewName(event.target.value)
    const handleNumberChange = (event) => setNewNumber(event.target.value)

    return (
     <form onSubmit={addPerson} >
        <div>name: <input onChange={handleNameChange}/></div>
        <div>number: <input onChange={handleNumberChange}/></div>
        <div>
          <button type="submit">add</button>
        </div>
     </form>
    )
    
}

export default PersonForm
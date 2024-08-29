import { useState } from 'react'

const PersonForm = ({persons, setPersons}) => {

    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')

    const addPerson = (event) => {
        event.preventDefault()
        const person = {
          name: newName, 
          number: newNumber, 
          id: persons.length + 1,
        }
        
        if (persons.some(e => e.name === person.name)){
          alert(newName + ' is already added to phonebook')
        } else {
          setPersons(persons.concat(person))
          setNewName('')
          setNewNumber('')
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
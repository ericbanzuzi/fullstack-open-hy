import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import phoneService from './services/phonebook'
import Notification from './components/Notification'


const App = (props) => {
  const [persons, setPersons] = useState(props.phonebook) 
  const [filter, setFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)

  const hook = () => {
    phoneService
      .getAll()
      .then(intialPersons => {
        setPersons(intialPersons)
      })
  }
  useEffect(hook, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification noticationMessage={notificationMessage} />
      <Filter filter={filter} setFilter={setFilter}/>
      <h3>Add a new person</h3>
      <PersonForm persons={persons} setPersons={setPersons} setNotificationMessage={setNotificationMessage} />
      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} setPersons={setPersons} setNotificationMessage={setNotificationMessage}/>
    </div>
  )
}

export default App
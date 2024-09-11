import phoneService from '../services/phonebook'


const Persons = ({persons, filter, setPersons, setNotificationMessage}) => {

    const deletePerson = (id) => {
        const confirm = window.confirm('Delete ' + persons.find(person => person.id === id).name + '?') 
        if (confirm) {
          phoneService
            .remove(id)
            .then(returnedPerson => {
              setPersons(persons.filter(person => person.id !== returnedPerson.id))
              setNotificationMessage({
                type: 'success', 
                message: `Removed ${persons.find(person => person.id === id).name}`
              })
              setTimeout(() => {
                setNotificationMessage(null)
              }, 5000)
            })
            .catch(error => {
              setNotificationMessage({
                type: 'error', 
                message: `The person ${persons.find(person => person.id === id).name} has been already removed from server`
              })
              setTimeout(() => {
                setNotificationMessage(null)
              }, 5000)
              setPersons(persons)
            })
        }
    }

    const personsToShow = filter === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().startsWith(filter))

    return (
     <div>
        {personsToShow.map(person => 
          <div key={person.id}>{person.name} {person.number} <button onClick={() => deletePerson(person.id)}>delete</button> </div>
        )}
     </div>
    )
}

export default Persons
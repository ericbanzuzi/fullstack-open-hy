const Persons = ({persons, filter}) => {
    const personsToShow = filter === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().startsWith(filter))

    return (
     <div>
        {personsToShow.map(person => 
          <div key={person.id}>{person.name} {person.number}</div>
        )}
     </div>
    )
}

export default Persons
const Filter = ({filter, setFilter}) => {

    const handleFilterChange = (event) => setFilter(event.target.value)

    return (
      <form >
        <div>filter shown with: <input value={filter} onChange={handleFilterChange}/></div>
      </form>
    )

}

export default Filter
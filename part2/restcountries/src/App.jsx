import { useState, useEffect } from 'react'
import axios from 'axios'
import Country from './components/Country'

const App = () => {
  const [countryFilter, setCountryFilter] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all').then(response => {
      setCountries(response.data)
    })
  }, [countryFilter])

  const handleFilterChange = (event) => setCountryFilter(event.target.value)

  const countriesToShow = countryFilter === ''
    ? countries
    : countries.filter(c => c.name.common.toLowerCase().includes(countryFilter.toLowerCase()))

  console.log(countriesToShow)
  return (
    <div>
      <form >
        <div>find countries: <input value={countryFilter} onChange={handleFilterChange}/></div>
      </form>
      <Country countries={countriesToShow} setCountryFilter={setCountryFilter} />
    </div>
  )
}

export default App
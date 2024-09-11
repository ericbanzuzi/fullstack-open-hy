
const displayCountry = (country) => {
    return (
        <div>
            <h1>{country.name.common}</h1>
            <div>
                <div>capital {country.capital}</div>
                <div>area {country.area}</div>
            </div>
            <h2>Languages:</h2>
            <ul>
                {Object.keys(country.languages).map((key, i) => 
                <li key={i}>{country.languages[key]}</li>
                )}
            </ul>
            <img src={country.flags.png} alt={country.name.common}/>
        </div>
    )
}


const Country = ({countries, setCountryFilter}) => {
    if (countries.length > 10) {
        return (
        <div>
            Too many matches, specify another filter
        </div>
        )
    }
    
    if (countries.length === 1){
        return (
            displayCountry(countries[0])
        )
    }

    return (
     <div>
        {countries.map((country, i) => 
          <div key={i}>{country.name.common} <button onClick={() => {
            setCountryFilter(country.name.common)
        }}>show</button> </div>
        )}
     </div>
    )
}

export default Country
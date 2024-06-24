require('dotenv').config()
const { Pool } = require('pg')
const axios = require('axios')
const { map, flatten } = require('lodash')
const format = require('pg-format')

const {
    DB_HOST,
    DB_NAME,
    DB_PASS,
    DB_PORT,
    DB_USER
} = process.env

// Exit Codes
// 0 - Success
// 2 - Unexpected error
// 10 - Unexpected error on idle client
// 20 - Unexpected error on inserting data to the database
// 30 - Unexpected error on fetching data from the data source

async function main () {
    const config = {
        user: DB_USER,
        password: DB_PASS,
        port: DB_PORT,
        host: DB_HOST,
        database: DB_NAME
    }

    const pool = new Pool(config)
    pool.on('error', (err, client) => {
        console.error(err)
        console.error('--- Unexpected error on idle client, exiting ---')
        process.exit(10)
    })
    
    const client = await pool.connect()
    
    // check first if countries and cities already exist
    const ExpectedCountriesCount = 250
    const ExpectedCitiesCount = 77786
    const countriesQuery = 'SELECT * FROM country'
    const citiesQuery = 'SELECT * FROM city'

    const countriesExist = await client.query(countriesQuery)
    const citiesExist = await client.query(citiesQuery)

    if (countriesExist.rowCount >= ExpectedCountriesCount && citiesExist.rowCount >= ExpectedCitiesCount) {
        console.log('--- Countries and cities already exist, skipping ---')
        process.exit(0)
    } else {
        console.log('Countries or cities do not exist, creating...')
    }

    // fetch countries
    let countries = []
    try {
        countries = await getCountries()
    } catch (error) {
        console.error(error)
        console.error("--- Can't fetch countries, exiting ---")
        process.exit(30)
    }

    // fetch cities
    let cities = []
    try {
        cities = await getCities()
    } catch (error) {
        console.error(error)
        console.error("--- Can't fetch cities, exiting ---")
        process.exit(30)
    }
    
    try {
        const countryPromises = countries.data.map((country, index) => {
            const text = 'INSERT INTO country(id, country_id, name, code, region, subregion, lat, long) VALUES($1, $2, $3, $4, $5, $6, $7, $8)'
            let code = country.cca2
            if (!code) {
                code = country.cca3
            }

            let lat, long = ''
            if (country.latlng) {
                lat = country.latlng[0].toString()
                long = country.latlng[1].toString()
            }
            index++
            
            const region = country.region || "unknown region"
            const subregion = country.subregion || "unknown subregion"
            let name = country.name["common"]
            return client.query(text, [index, index, name, code, region, subregion, lat, long]) 
        })
    
        await Promise.all(countryPromises).catch(err => {
            console.error(err)
            console.error("--- Can't insert countries, exiting ---")
            process.exit(20)
        })

        const query = {
            name: 'fetch',
            text: 'select * from country'
        }

        const res = await client.query(query)
        const countryData = res.rows

        let index = 0
        const mappedCities = map(cities.data, (countryCities, country) => {
            let foundCountry = countryData.filter(c => c.name === country)[0]
            if (!foundCountry) return

            foundCountryID = foundCountry.country_id || foundCountry.id

            return countryCities.map(countryCity => {
                if (countryCity === '') {
                    countryCity = 'Unknown'
                }

                const text = 'INSERT INTO city(id, city_id, country_id, name) VALUES($1, $2, $3, $4) RETURNING *'
                index++
               
                return [index, index, foundCountryID, countryCity]
            })
        }).filter(g => g)

        const inserts = format('INSERT INTO city(id, city_id, country_id, name) VALUES %L', flatten(mappedCities))

        // console.log(inserts)
        client.query(inserts)
            .then(res => {
                console.log(res)
            })
            .catch(err => { 
                console.error(err);
                console.error("--- Can't insert cities, exiting ---")
                process.exit(20)
            })
            .then(_ => {
                console.log('--- Countries and cities inserted successfully ---');
                process.exit(0);
            })

    } catch (error) {
        console.error(error)
        console.error("--- Failed to init countries and cities, exiting ---")
        process.exit(2)
    }
}

async function getCountries () {
    return axios.get('https://raw.githubusercontent.com/threefoldtech/tfchain_graphql/master/scripts/countries.json')
}

async function getCities () {
    return axios.get('https://raw.githubusercontent.com/shivammathur/countrycity/master/data/geo.json')
}

main()
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

async function main () {
    const config = {
        user: DB_USER,
        password: DB_PASS,
        port: DB_PORT,
        host: DB_HOST,
        database: DB_NAME
    }

    let countries = []
    try {
        countries = await getCountries()
    } catch (error) {
        console.log('--- No Countries were found, a restart is suggested ---')
        process.exit(0)
    }

    let cities = []
    try {
        cities = await getCities()
    } catch (error) {
        console.log('--- No Cities were found, a restart is suggested ---')
        process.exit(0)
    }
    
    const pool = new Pool(config)
    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
    })
    
    const client = await pool.connect()

    try {
        const countryPromises = countries.data.map((country, index) => {
            const text = 'INSERT INTO country(id, country_id, name, code, region, subregion, lat, long) VALUES($1, $2, $3, $4, $5, $6, $7, $8)'
            let code = country.alpha2Code
            if (!code) {
                code = country.alpha3Code
            }

            let lat, long = ''
            if (country.latlng) {
                lat = country.latlng[0].toString()
                long = country.latlng[1].toString()
            }
            index++
            
            const region = country.continent || "unknown region"
            const subregion = country.region || "unknown subregion"

            return client.query(text, [index, index, country.name, code, region, subregion, lat, long]) 
        })
    
        await Promise.all(countryPromises)

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
            .catch(err => console.log(err))
            .then(process.exit(0))

    } catch (error) {
        console.log(error)
        process.exit(0)
    }
}

async function getCountries () {
    return axios.get('https://restcountries.com/v2/all')
}

async function getCities () {
    return axios.get('https://raw.githubusercontent.com/shivammathur/countrycity/master/data/geo.json')
}

main()
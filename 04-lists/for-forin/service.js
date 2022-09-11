const axios = require('axios')
const URL = `https://swapi.dev/api/people`

async function obterPessoas(nome) {
    const url = `${URL}/?search=${nome}`
    console.log(url)
    // console.time('axios-get')
    const response = await axios.get(url)
    // console.timeEnd('axios-get')
    return response.data
}

module.exports = {
    obterPessoas
}
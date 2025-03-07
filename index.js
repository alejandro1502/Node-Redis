const axios = require('axios');
const express = require('express');
const responseTime = require('response-time');
const { createClient } = require('redis'); 
const app = express();

const client = createClient({
    host:'127.0.0.1',
    port:6379
})

app.use(responseTime())

app.get('/characters', async (req, res) => {
    try {
        const reply = await client.get('characters')
        if(reply) return res.json(JSON.parse(reply))

        const response = await axios.get('https://rickandmortyapi.com/api/character');
        const ress = response.data
        const saveResult = await client.set('characters', JSON.stringify(ress))
        console.log(saveResult);
        return res.json(response.data); // Aquí se envía solo la data, no el objeto completo
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener datos", error: error.message });
    }
});

const main = async () => {
    await client.connect()
    app.listen(4000)
    console.log('Ejcutado el servidor');
}
main()

const express = require('express')
const app = express();
const { uuid, isUuid } = require('uuidv4')

app.use(express.json());

const Sellers = []

// Middlewares
function validateUuid(req,res,next){
    const {id} = req.params;

    if(!isUuid(id)){
        return res.status(404).send({ method: 'GET ONE  ÑOK', data: `Id is not a isUuid` })
    }
    next();
}

function writeLog(req, res, next) {
    const { method, url } = req;
    const logLabel = `[${method.toUpperCase()} ${url}] `
    console.time(logLabel)
    console.timeEnd(logLabel)
    return next();
}

// assign writeLog middleware for all calls
app.use(writeLog)


// Routes

// GET ALL
app.get('/sellers', (req, res) => {
    return res.status(200).send({ method: 'GET OK', data: Sellers })
})

// GET ONE
app.get('/sellers/:id',validateUuid, (req, res) => {
    const { id } = req.params;
    const indexOfSeller = Sellers.findIndex(item => item.Id === id);

    if (indexOfSeller < 0) {
        return res.status(404).send({ method: 'GET ONE  ÑOK', data: `Seller not found` })
    }

    return res.status(200).send({ data: Sellers[indexOfSeller] })
})

// POST
app.post('/sellers', (req, res) => {
    const { Level, Name, Cpf } = req.body;
    const newSeller = { Id: uuid(), Level, Name, Cpf }
    Sellers.push(newSeller)
    return res.status(201).send({ method: 'POST OK', data: Sellers })
})

// DELETE ONE
app.delete('/sellers/:id',validateUuid, (req, res) => {
    const { id } = req.params;
    const indexOfSeller = Sellers.findIndex(item => item.Id === id);

    if (indexOfSeller < 0) {
        return res.status(404).send({ method: `Seller not found` })
    }

    Sellers.splice(indexOfSeller, 1)

    return res.status(200).send({ method: 'DELETE OK', data: Sellers })
})

// PUT ONE
app.put('/sellers/:id',validateUuid, (req, res) => {
    const { id } = req.params;
    const {Level,Name,Cpf} = req.body;

    const indexOfSeller = Sellers.findIndex(item => item.Id === id);

    if (indexOfSeller < 0) {
        return res.status(404).send({ method: 'GET ONE  ÑOK', data: `Seller not found` })
    }    

    const newSeller = {Id:id, Level, Name, Cpf}

    Sellers[indexOfSeller] = newSeller

    return res.status(200).send({ method:'PUT OK',data: newSeller })
})


app.listen(3001)
// docker ps 
// sudo docker exec -it 00f3573cd97b mongo -u userWilliam -p userSenha --authenticationDatabase herois

//database
show dbs

//mudando o contexto para um database
use herois

// mostrar as tabelas (coleções) 
show collections

db.herois.insert({
    nome: 'Flash',
    poder: 'Velocidade',
    dataNascimento: '1998-01-01'
})

db.herois.find()
db.herois.find().pretty()

for (let i = 0; i < 1000; i++) {
    db.herois.insert({
        nome: `Clone-${i}`,
        poder: 'Velocidade',
        dataNascimento: '1998-01-01'
    })
}

db.herois.count()
db.herois.findOne()
db.herois.find().limit(1000).sort({ nome: -1 })
db.herois.find({}, { poder: 1, _id: 0 })

//create
db.herois.insert({
    nome: 'Flash',
    poder: 'Velocidade',
    dataNascimento: '1998-01-01'
})

//read
db.herois.find()
//update
db.herois.update(
    { _id: ObjectId("6331f1b8d149a9bb0f165b59") },
    { nome: "Mulher maravilha" }
)
db.herois.update(
    { _id: ObjectId("6331f2acd149a9bb0f165b5a") },
    { $set: { nome: "Lanterna Verde" } }
)

//delete
db.herois.remove({}) //todos
db.herois.remove({ nome: 'Mulher maravilha' })
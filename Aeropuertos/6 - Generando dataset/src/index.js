const fs = require('fs');
const faker = require('faker')

const aeropuertos = [];

for (let i = 0; i<3; i++) {
  id = faker.datatype.uuid()
  localizacion = faker.address.city()
  aviones = []
  rutas = []

  for (let l = 0; l<1; l++) {
    rutas.push({
      id: faker.datatype.uuid(),
      fechaHoraSalida:faker.date.between('2015-01-01', '2015-01-05'),
      kilometros:faker.datatype.number({
        'min': 1000,
        'max': 10000
      })
    })
  }

  for (let l = 0; l<3; l++) {

    pasajeros = []

    for (let z = 0; z<2; z++) {
      pasajeros.push({
        id: faker.datatype.uuid(),
        nombre: faker.name.firstName(),
        apellido: faker.name.lastName()
      })
    }

    aviones.push({
      id: faker.datatype.uuid(),
      matricula: `${faker.random.locale()} - ${faker.address.zipCode()} - ${faker.datatype.number({
        'min': 1000,
        'max': 5000
      })}`,
      velocidadHora: faker.datatype.number({
          'min': 100,
          'max': 1000
      }),
      pasajeros
    })
  }

  aeropuertos.push({
    id,
    rutas,
    localizacion,
    aviones,
  })
}


fs.writeFile('dataset.json', JSON.stringify(aeropuertos, null, 4), 'utf8', (err)=>{
  if (err) {
    throw err;
  }else{
    console.log('Save fake dataset')
  }
});
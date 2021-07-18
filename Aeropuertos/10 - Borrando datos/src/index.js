const { join } = require('path');
const { ApolloServer, assertResolveFunctionsPresent } = require('apollo-server');
const { loadTypedefsSync } = require('@graphql-tools/load');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');
const GraphQLDateTime = require('graphql-type-datetime');
const GraphQLEnumType = require('graphql/type')
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const aeropuertos = JSON.parse(fs.readFileSync(join(__dirname, './dataset.json'), 'utf8'));


const sources = loadTypedefsSync(join(__dirname, './typeDefs.gql'), {
    loaders: [
        new GraphQLFileLoader()
    ]
});

const typeDefs = sources.map(source => source.document)

const resolvers = {
  Query: {
    listarAeropuertos: () => {return aeropuertos},
    obtenerAeropuertoPorId: (obj, args) => {
      const response = aeropuertos.filter(aeropuerto => {
        aeropuerto.id === args.id;
      });
      return response[0];
    },
    obtenerAeropuerto: (obj, {id, localizacion}) => {
      const response = aeropuertos.filter(aeropuerto => {
        if (aeropuerto.localizacion === localizacion || aeropuerto.id === id){
          return aeropuerto;
        }
      }); 
      return response[0];
    }
  },
  Mutation: {
    crearPasajero: (obj, {idAvion, nombre, apellido}) => {
      const pasajero = {id: uuidv4(), nombre, apellido}
      let insertado = false
      aeropuertos
      .forEach(aeropuerto => {
        aeropuerto.aviones.forEach(avion => {
          if (avion.id === idAvion){
            avion.pasajeros.push(pasajero)
            insertado = true
            return
          }
        })
      })
      
      if (insertado) {
        return pasajero
      }

      throw 'Avion no existe';
    },

    actualizarVelocidadHora: (obj, {idAvion, velocidadHora}) => {
      let returnValue = null 

      aeropuertos.map(aeropuerto => {
        aeropuerto.aviones = aeropuerto.aviones.map(avion => {
          if(avion.id === idAvion){
            avion.velocidadHora = velocidadHora
            returnValue = avion
          }
          return avion
        })
        return aeropuerto
      })

      if(returnValue){
        return returnValue
      }else{
        throw 'Avion no existente'
      }
  },

  vaciarPasajeros: (obj, {idAvion}) => {
    console.log(obj)
    let returnValue = null 

    aeropuertos.map(aeropuerto => {
      aeropuerto.aviones = aeropuerto.aviones.map(avion => {
        if(avion.id === idAvion){
          avion.pasajeros = []
          returnValue = avion
        }
        return avion
      })
      return aeropuerto
    })

    if(returnValue){
        return returnValue
    }
    
    throw 'Avion no existente'
    
  }
}
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen({port:5000}).then(({ url }) => {
  console.log(`Servidor iniciado en ${url}`);
});

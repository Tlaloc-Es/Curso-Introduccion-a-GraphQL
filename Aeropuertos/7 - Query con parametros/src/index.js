const { join } = require('path');
const { ApolloServer } = require('apollo-server');
const { loadTypedefsSync } = require('@graphql-tools/load');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');
const GraphQLDateTime = require('graphql-type-datetime');
const GraphQLEnumType = require('graphql/type')
const fs = require('fs');

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
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Servidor iniciado en ${url}`);
});

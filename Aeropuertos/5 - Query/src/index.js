const { join } = require('path');
const { ApolloServer } = require('apollo-server');
const { loadTypedefsSync } = require('@graphql-tools/load');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');
const GraphQLDateTime = require('graphql-type-datetime');
const GraphQLEnumType = require('graphql/type')

const sources = loadTypedefsSync(join(__dirname, './typeDefs.gql'), {
    loaders: [
        new GraphQLFileLoader()
    ]
});

const typeDefs = sources.map(source => source.document)

const resolvers = {
  Query: {
    listarAeropuertos: () => {return  [{id: '1', localizacion:'Bilbao'}, {id: '2', localizacion:'Madrid'}, {id: '3', localizacion:'Lisboa'}]}
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Servidor iniciado en ${url}`);
});

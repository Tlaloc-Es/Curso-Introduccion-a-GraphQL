const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const bilbao = {nombre: 'Bilbao', conexiones: []}
const madrid = {nombre: 'madrid', conexiones: []}
const londres = {nombre: 'londres', conexiones: []}
const lisboa = {nombre: 'lisboa', conexiones: []}

bilbao.conexiones.push(madrid, londres, lisboa)
madrid.conexiones.push(bilbao, lisboa)
londres.conexiones.push(madrid)

const aeropuertos = [bilbao, madrid, londres, lisboa]

const typeDefs = gql`
  type Query {
    listarAeropuertos: [Aeropuerto],
    listarConexiones(aeropuerto: String!): [Aeropuerto]
  }

  type Aeropuerto {
    nombre: String!
    conexiones: [Aeropuerto]
  }
`;

const resolvers = {
  Query : {
    listarAeropuertos: () => {
      return aeropuertos;
    },
    listarConexiones: (obj, {aeropuerto}) => {
      const conexiones = aeropuertos
        .filter(aero => aero.nombre === aeropuerto)
        .map(aero => aero.conexiones)
        .flat()

      return conexiones
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
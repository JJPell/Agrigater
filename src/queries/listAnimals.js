import graphql from "graphql-tag";

export default graphql`

listAnimals {
    id
    type {
        type
        gender
        breed
    }
    value
  }
`
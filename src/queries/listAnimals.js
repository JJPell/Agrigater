import graphql from "graphql-tag";

export default graphql`

    query {
        listAnimals {
            id
            quantity
            type {
                name
            }
            breed {
                name
            }
        }
    }

`
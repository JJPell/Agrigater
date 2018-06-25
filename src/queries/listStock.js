import graphql from "graphql-tag";

export default graphql`

    query {
        listStock {
            id
            name
            quantity
        }
    }

`
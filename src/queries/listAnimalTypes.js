import graphql from "graphql-tag";

export default graphql`

    query {
        listAnimalTypes {
            id
            name
            breeds {
                id
                name
            }
        }
    }

`
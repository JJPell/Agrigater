import graphql from "graphql-tag";

export default graphql`

    query {
        listStockTypes {
            id
            name
        }
    }

`;
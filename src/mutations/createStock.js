import graphql from "graphql-tag";

export default graphql`
    mutation createStock($typeID: ID!, $quantity: Int!){
        createStock(typeID: $typeID, quantity: $quantity) {
            id
        }
    }
`;
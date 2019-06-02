import graphql from "graphql-tag";

export default graphql`
    mutation createStock($typeID: ID, $quantity: Int!, $name: String, $value: Float){
        createStock(input: {typeID: $typeID, quantity: $quantity, name: $name, value: $value}) {
            id
        }
    }
`
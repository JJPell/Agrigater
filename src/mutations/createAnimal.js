import graphql from "graphql-tag";

export default graphql`
    mutation createAnimal ($breed: ID!, $quantity: Int!){
        createAnimal(breed: $breed, quantity: $quantity) {
            id
        }
    }
`;
import graphql from "graphql-tag";

export default graphql`
    mutation deleteAnimal($id: ID!) {
        deleteAnimal(id: $id)
    }
`;
import graphql from "graphql-tag";

export default graphql`
    mutation deleteStock(
        $id: ID!
    ) {
        deleteStock(id: $id)
    }
`;
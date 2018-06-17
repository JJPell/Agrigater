import graphql from "graphql-tag";

export default graphql`
    mutation deleteJob(
        $id: ID!
    ) {
        deleteJob(id: $id)
    }
`;
import graphql from "graphql-tag";

export default graphql`
    mutation createJob(
        $land: ID!
        $jobType: ID!
        $date: String!
    ) {
        createJob(landID: $land, typeID: $jobType, date: $date) {
            id
        }
    }
`;
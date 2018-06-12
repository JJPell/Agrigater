import graphql from "graphql-tag";

export default graphql`
    mutation createLand(
        $name: String!
        $size: Int!
    ) {
        createLand(
            name: $name
            size: $size
        ) {
            id
        }
    }
`;
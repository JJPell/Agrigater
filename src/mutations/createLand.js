import graphql from "graphql-tag";

export default graphql`
    mutation createLand(
        $name: String!
        $size: Int!
    ) {
        createLand(input: {
            name: $name
            size: $size
        }) {
            id
            name
            size
        }
    }
`;
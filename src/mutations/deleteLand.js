import graphql from "graphql-tag";

export default graphql`
    mutation deleteLand($id: ID!) {
        deleteLand(id: $id)
    }
`;
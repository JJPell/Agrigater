import graphql from "graphql-tag";

export default graphql`

    query {
        listLands {
            id
            size
            name
        }
    }
    
`;
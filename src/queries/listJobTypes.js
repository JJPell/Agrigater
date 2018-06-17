import graphql from "graphql-tag";

export default graphql`

    query {
        listJobTypes {
            id
            name
        }
    }
    
`;
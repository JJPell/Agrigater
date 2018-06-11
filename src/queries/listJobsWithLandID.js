import graphql from "graphql-tag";

export default graphql`

    query listJobsWithLandID {
    
        listJobsWithLandID(id: "2ace3620-9cf1-4f19-b509-60b0472b1c3b") {
            items {
                id
                date
                type {
                    name
                }
            }

        }

    }
    
`;
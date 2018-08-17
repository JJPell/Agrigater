import graphql from "graphql-tag";

export default graphql`

    query {
        listLands {
            id
            name
            size
            seedCost
            fertiliserCost
            limeCost
            sprayCost
            cultivationCost
            licenceCost
            jobs {
                type {
                    name
                }
            }
        }
    }
    
`;
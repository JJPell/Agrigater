import graphql from "graphql-tag";

export default graphql`

   query getLand(
        $id: ID!
   ) {
        getLand(
            id: $id
        ){
            name
            size
            jobs {
                id
                date
                type {
                    name
                }
            }
        }
    }
`;
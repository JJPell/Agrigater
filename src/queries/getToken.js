import graphql from "graphql-tag";

export default graphql`

    query ($email: String!, $password: String!) {

        getToken(email: $email, password: $password)

    }
`;
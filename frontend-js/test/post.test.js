const {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  gql,
} = require("@apollo/client");
const fetch = require("cross-fetch");

describe("GRAPHQL ENDPOINTS", () => {
  let client = null;

  beforeEach(() => {
    client = new ApolloClient({
      link: new HttpLink({
        uri: "http://localhost:4040/graphql",
        fetch,
      }),
      cache: new InMemoryCache(),
    });
  });
  test("Should return all the posts from GraphQL Endpoint", async () => {
    const FETCH_POSTS = gql`
      query {
        posts {
          id
          title
          body
          published
        }
      }
    `;

    const response = await client.query({
      query: FETCH_POSTS,
    });

    expect(response.data.posts[0].id).not.toBeUndefined();
    expect(response.data.posts.length).toBeGreaterThan(0);
  });

  test("Should return token if correct credentials given", async () => {
    const USER_LOGIN = gql`
      mutation {
        userLogin(data: { email: "ross@test.com", password: "ross123" }) {
          token
        }
      }
    `;

    const response = await client.mutate({
      mutation: USER_LOGIN,
    });

    expect(response.data.userLogin.token).not.toBeUndefined();
  });

  xtest("Should create new user", async () => {
    const CREATE_USER = gql`
      mutation {
        createUser(
          data: {
            name: "chandler"
            email: "chandler@test.com"
            age: 25
            password: "chandler123"
            role: ANALYST
          }
        ) {
          id
          name
          email
          age
        }
      }
    `;

    const response = await client.mutate({
      mutation: CREATE_USER,
    });

    expect(response.data.createUser.id).not.toBeUndefined();
  });

  afterEach(() => {
    client = null;
  });
});

import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "http://localhost:4040/graphql",
});

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

window.onload = function () {
  const listContainer = document.querySelector("#list-container");

  // client.mutate({
  //   mutation : ""// Supply mutation here
  // })

  client
    .query({
      query: FETCH_POSTS,
    })
    .then((response) => {
      response.data.posts.forEach((post) => {
        const liElement = document.createElement("li");

        liElement.innerHTML = `
          <p> ${post.title.toUpperCase()}</p>
        `;
        listContainer.appendChild(liElement);
      });
    })
    .catch(console.error);
};

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

const USER_LOGIN = gql`
  mutation {
    userLogin(data: { email: "monica@test.com", password: "monica123" }) {
      token
    }
  }
`;

window.onload = function () {
  const listContainer = document.querySelector("#list-container");

  const btnLogin = document.querySelector("#btnLogin");

  let token = null;

  btnLogin.addEventListener("click", function (e) {
    e.preventDefault();
    client
      .mutate({
        mutation: USER_LOGIN,
      })
      .then((response) => {
        token = response.data.userLogin.token;
        console.log(token);
        localStorage.setItem("token", response.data.userLogin.token);
      })
      .catch(console.error);
  });

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

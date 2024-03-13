import { gql, useQuery } from "@apollo/client";
import { FadeLoader } from "react-spinners";
import PostItem from "./PostItem";

const FETCH_POSTS = gql`
  query {
    posts {
      id
      title
      body
      published
      author {
        id
        name
      }
    }
  }
`;

function Posts() {
  const { data, loading, error } = useQuery(FETCH_POSTS);

  if (loading)
    return (
      <FadeLoader width="10px" height="25px" radius="3px" color="#36d7b7" />
    );
  if (error) return <h2>{error.message}</h2>;

  return (
    <>
      <h2>Posts Component </h2>
      <div className="row">
        {data.posts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
    </>
  );
}

export default Posts;

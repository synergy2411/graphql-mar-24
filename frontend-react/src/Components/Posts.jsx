import { gql, useQuery } from "@apollo/client";
import { FadeLoader } from "react-spinners";
import PostItem from "./PostItem";
import PostDetail from "./PostDetail";
import { useState } from "react";

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
  const [selectedPost, setSelectedPost] = useState(null);

  const onPostSelected = (selPost) => setSelectedPost(selPost);

  return (
    <>
      <h2>Posts Component </h2>
      {loading && (
        <FadeLoader width="10px" height="25px" radius="3px" color="#36d7b7" />
      )}
      {error && <h2>{error.message}</h2>}
      {data && (
        <div className="row">
          {data.posts.map((post) => (
            <PostItem
              onPostSelected={onPostSelected}
              key={post.id}
              post={post}
            />
          ))}
        </div>
      )}

      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}

export default Posts;

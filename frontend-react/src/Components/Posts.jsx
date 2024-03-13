import { gql, useQuery } from "@apollo/client";
import { FadeLoader } from "react-spinners";
import PostItem from "./PostItem";
import PostDetail from "./PostDetail";
import { useEffect, useState } from "react";
import Auth from "./Auth";
import AddNewPost from "./AddNewPost";
import MySpace from "./MySpace";

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
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [tab, setTab] = useState(1);

  useEffect(() => {
    if (data && data.posts) {
      setPosts(data.posts);
    }
  }, [data]);

  const onPostSelected = (selPost) => setSelectedPost(selPost);

  return (
    <>
      <h2>Posts Component </h2>

      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a className="nav-link" onClick={() => setTab(1)}>
            All Posts
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" onClick={() => setTab(2)}>
            My Space
          </a>
        </li>
      </ul>

      {tab === 2 && <MySpace />}

      <div className="mb-4">
        <div className="row">
          <div className="col-4 offset-4">
            <div className="d-grid">
              <button
                className="btn btn-primary"
                onClick={() => setShowForm(!showForm)}
              >
                Login Form
              </button>
            </div>
          </div>
        </div>
        {showForm && <Auth />}
      </div>
      {loading && (
        <FadeLoader width="10px" height="25px" radius="3px" color="#36d7b7" />
      )}
      {error && <h2>{error.message}</h2>}

      {tab === 1 && (
        <div className="row">
          {posts.map((post) => (
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

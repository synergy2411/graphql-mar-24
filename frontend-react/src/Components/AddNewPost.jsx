import { gql, useMutation } from "@apollo/client";
import { useRef } from "react";
import { FadeLoader } from "react-spinners";

const CREATE_POST = gql`
  mutation createPostMutation(
    $title: String!
    $body: String!
    $published: Boolean!
  ) {
    createPost(data: { title: $title, body: $body, published: $published }) {
      id
      title
      body
      published
    }
  }
`;

function AddNewPost() {
  const [createPostMutation, { data, loading, error }] =
    useMutation(CREATE_POST);

  const titleRef = useRef();
  const bodyRef = useRef();

  const createClickHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await createPostMutation({
        variables: {
          title: titleRef.current.value,
          body: bodyRef.current.value,
          published: false,
        },
      });
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <form>
        {/* title */}
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            name="title"
            id="title"
            placeholder=""
            ref={titleRef}
          />
          <label htmlFor="title">Title: </label>
        </div>

        {/* body */}
        <div className="form-floating mb-3">
          <textarea
            type="text"
            className="form-control"
            name="body"
            id="body"
            placeholder="Write your message here"
            ref={bodyRef}
          />
        </div>

        {/* button */}
        <button className="btn btn-primary" onClick={createClickHandler}>
          Create
        </button>
      </form>

      {loading && (
        <FadeLoader width="10px" height="25px" radius="3px" color="#36d7b7" />
      )}
      {error && <h2>{error.message}</h2>}
    </>
  );
}

export default AddNewPost;

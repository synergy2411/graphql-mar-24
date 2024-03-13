function PostItem({ post, onPostSelected }) {
  const clickHandler = () => {
    onPostSelected(post);
  };
  return (
    <div className="col-4">
      <div className="card" onClick={clickHandler}>
        <div className="card-header">
          <h6 className="text-center">{post.title.toUpperCase()}</h6>
        </div>
      </div>
    </div>
  );
}

export default PostItem;

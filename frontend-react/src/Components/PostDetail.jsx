function PostDetail({ post }) {
  return (
    <>
      <div className="card">
        <div className="card-header">
          <h6 className="text-center">{post.title.toUpperCase()}</h6>
        </div>
        <div className="card-body">
          <blockquote>
            <p>
              {post.body}
              <cite className="float-end">
                -{post.author.name.toUpperCase()}
              </cite>
            </p>
          </blockquote>
        </div>
      </div>
    </>
  );
}

export default PostDetail;

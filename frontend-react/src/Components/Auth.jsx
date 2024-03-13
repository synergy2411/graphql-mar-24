import { gql, useMutation, useLazyQuery } from "@apollo/client";
import { useRef } from "react";
import { FadeLoader } from "react-spinners";

const USER_LOGIN = gql`
  mutation onLogin($email: String!, $password: String!) {
    userLogin(data: { email: $email, password: $password }) {
      token
    }
  }
`;

function Auth() {
  const [userLoginMutation, { loading, error, data }] = useMutation(USER_LOGIN);

  const emailRef = useRef();
  const passwordRef = useRef();

  const loginClickHandler = (e) => {
    e.preventDefault();
    if (
      emailRef.current.value.trim() === "" ||
      passwordRef.current.value.trim() === ""
    ) {
      return;
    }
    userLoginMutation({
      variables: {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      },
    })
      .then((response) => {
        localStorage.setItem("token", response.data.userLogin.token);
      })
      .catch(console.error);
  };

  return (
    <>
      <form>
        {/* email */}
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            name="email"
            id="email"
            placeholder=""
            ref={emailRef}
          />
          <label htmlFor="email">Email :</label>
        </div>

        {/* password */}

        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control"
            name="password"
            id="password"
            placeholder=""
            ref={passwordRef}
          />
          <label htmlFor="password">Password</label>
        </div>

        <div className="row">
          <div className="col-6">
            <div className="d-grid">
              <button className="btn btn-primary" onClick={loginClickHandler}>
                Login
              </button>
            </div>
          </div>
          <div className="col-6">
            <div className="d-grid">
              <button className="btn btn-light" onClick={loginClickHandler}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>

      {loading && <FadeLoader />}
      {error && <p>{error.message}</p>}
    </>
  );
}

export default Auth;

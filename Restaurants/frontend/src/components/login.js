import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login(props) {
  let nav = useNavigate();
  const initialUserState = {
    name: "",
    id: "",
  };

  const [user, setUser] = useState(initialUserState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    console.log(`user from login: ${user.id}`);
  };

  const login = () => {
    props.login(user);
    nav("/");
  };

  return (
    <div className='submit-form'>
      <div>
        <div className='form-group'>
          <label htmlFor='user'>Username</label>
          <input
            type='text'
            className='form-control'
            id='name'
            required
            value={user.name}
            onChange={handleInputChange}
            name='name'
          />
        </div>

        <div className='form-group'>
          <label htmlFor='id'>ID</label>
          <input
            type='text'
            className='form-control'
            id='id'
            required
            value={user.id}
            onChange={handleInputChange}
            name='id'
          />
        </div>

        <button onClick={login} className='btn btn-success'>
          Login
        </button>
      </div>
    </div>
  );
}

export { Login };

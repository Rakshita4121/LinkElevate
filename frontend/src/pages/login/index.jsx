import { loginUser, registerUser } from '@/config/redux/action/authentication';
import { emptyMessage } from '@/config/redux/reducer/authReducer';
import UserLayout from '@/layout/UserLayout';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './style.module.css';

export default function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const [userLoginMethod, setUserLoginMethod] = useState(false); // false = signup, true = login
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (authState.loggedIn) {
      router.push('/dashboard');
    }
  }, [authState.loggedIn]);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push('/dashboard');
    }
  }, []);
  // Clear message when toggling between login/signup
  useEffect(() => {
    dispatch(emptyMessage());
  }, [userLoginMethod]);

  // Clear inputs after successful registration
  useEffect(() => {
    if (authState.isSuccess && !userLoginMethod) {
      setUsername('');
      setName('');
      setEmail('');
      setPassword('');
    }
  }, [authState.isSuccess]);

  // Clear login inputs after successful login
  useEffect(() => {
    if (authState.loggedIn) {
      setEmail('');
      setPassword('');
    }
  }, [authState.loggedIn]);

  const handleRegister = () => {
    dispatch(registerUser({ username, name, email, password }));
  };

  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer_left}>
            <p className={styles.cardleft_heading}>
              {userLoginMethod ? 'Log In' : 'Sign Up'}
            </p>

            {/* Feedback Message */}
            {authState.message && (
              <p style={{ color: authState.isError ? 'red' : 'green' }}>
                {authState.message}
              </p>
            )}

            <div className={styles.inputContainer}>
              {/* Only show username and name during Sign Up */}
              {!userLoginMethod && (
                <div className={styles.inputRow}>
                  <input
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.inputField}
                    type="text"
                    placeholder="Username"
                    value={username}
                  />
                  <input
                    onChange={(e) => setName(e.target.value)}
                    className={styles.inputField}
                    type="text"
                    placeholder="Name"
                    value={name}
                  />
                </div>
              )}

              <input
                onChange={(e) => setEmail(e.target.value)}
                className={styles.inputField}
                type="text"
                placeholder="Email"
                value={email}
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputField}
                type="password"
                placeholder="Password"
                value={password}
              />
            </div>

            <button
              className={styles.buttonStyle}
              disabled={authState.isLoading}
              onClick={() => {
                if (userLoginMethod) {
                  handleLogin();
                } else {
                  handleRegister();
                }
              }}
            >
              {userLoginMethod ? 'Log In' : 'Sign Up'}
            </button>
          </div>

          <div className={styles.cardContainer_right}>
            <p>
              {userLoginMethod
                ? "Don't Have an Account?"
                : 'Already Have an Account?'}
            </p>
            <button
              className={styles.rightbuttonStyle}
              onClick={() => setUserLoginMethod(!userLoginMethod)}
            >
              {userLoginMethod ? 'Sign Up' : 'Log In'}
            </button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

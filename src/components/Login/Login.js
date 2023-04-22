// react
import React, { useState, useEffect, useReducer, useContext } from 'react';

// components
import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/input';

// context
import AuthContext from '../../context/auth-context';


// for email reducer
const emailInitialState = {
  value: '',
  isValid: undefined
}

const emailReducerFunction = (state, action) => {
  if (action.type === 'NEW_EMAIL_VALUE'){
    return { value: action.payload, isValid: action.payload.includes('@') }
  }
  if (action.type === 'ON_BLUR'){
    return { ...state, isValid: state.value.includes('@') }
  }
  return emailInitialState;
}

// for password reducer
const passwordInitialState = {
  value: '',
  isValid: undefined
}

const passwordReducerFunction = (state, action) => {
  if (action.type === 'NEW_PASSWORD_VALUE'){
    return { value: action.payload, isValid: action.payload.trim().length > 6 }
  }
  if (action.type === 'ON_BLUR'){
    return { ...state, isValid: state.value.trim().length > 6 }
  }
  return passwordInitialState;
}

const Login = (props) => {

  const { onLogin } = useContext(AuthContext)

  const [emailState, dispatchEmail] = useReducer(emailReducerFunction, emailInitialState);
  const [passwordState, dispatchPassword] = useReducer(passwordReducerFunction, passwordInitialState);

  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: 'NEW_EMAIL_VALUE', payload: event.target.value });
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: 'NEW_PASSWORD_VALUE', payload: event.target.value })
  };

  // this is how you create aliases for destructured properties
  // this is not fully neccessary, we can also just use emailState.isValid and it will work just as well.
  // cool trick for aliasing though
  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  // undisables the button upon these validation logics
  // with the cleanup function like this this idea is called debouncing. Hwere you wait a little while for the code to execute/validate.
  // THIS IS AWESOME
  useEffect(() => {

    const identifier = setTimeout(() => {
      setFormIsValid(
        emailIsValid && passwordIsValid
      );
    }, 1000);

    return () => {
      clearTimeout(identifier);
    };

  }, [emailIsValid, passwordIsValid])

  const validateEmailHandler = (event) => {
    dispatchEmail({ type: 'ON_BLUR' })
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: 'ON_BLUR' })
  };

  const submitHandler = (event) => {
    event.preventDefault();
    onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input 
          isValid={emailState.isValid} 
          type='email'
          id='email'
          label='E-mail'
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input 
          isValid={passwordState.isValid} 
          type='password'
          id='password'
          label='Password'
          value={passwordState.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;

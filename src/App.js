// hooks
import React, { useContext } from 'react';

// components
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import MainHeader from './components/MainHeader/MainHeader';

// context

import AuthContext from './context/auth-context';

function App() {

  const { isLoggedIn } = useContext(AuthContext);

  return (
      <>
        <MainHeader />
        <main>
          {!isLoggedIn && <Login />}
          {isLoggedIn && <Home />}
        </main>
      </>
  );  
}

export default App;

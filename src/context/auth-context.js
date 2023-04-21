import React, { useState, useEffect } from 'react';

// React.createContext return an object which also contains components.
// while it is named as if it is a component it is acutally an ojbect which contains a component. This is how Max named it.
// these are only dummy properties. We use them so that the IDE can autofill when we need it to. It is best practice to use the same datatypes as we will for our real values.
const AuthContext = React.createContext({
    isLoggedIn: false,
    onLogout: () => {},
    onLogin: (email, password) => {}
});

// this is a new component which wraps the AuthContext.Provider component and provides all of the user logic.

export const AuthContextProvider = props => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const loginHandler = (email, password) => {
        localStorage.setItem('isLoggedIn', '1');
        setIsLoggedIn(true);
    };

        const logoutHandler = () => {
        localStorage.setItem('isLoggedIn', '0');
        setIsLoggedIn(false);
    };

    useEffect(() => {

        const storedUserLoggedInInformation = localStorage.getItem('isLoggedIn');

        if(storedUserLoggedInInformation === '1'){
            setIsLoggedIn(true);
        }else{
            setIsLoggedIn(false);
        }
    }, [])

    return (
        <AuthContext.Provider value={{ isLoggedIn: isLoggedIn, onLogout: logoutHandler, onLogin: loginHandler }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
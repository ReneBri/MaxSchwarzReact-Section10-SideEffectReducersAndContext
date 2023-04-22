What are "Side Effects" and introducing useEffect()
    Effect, is also Side Effect. These terms are interchangable.

    The whole idea of React is based around this job: to render UI, to react to our user input and to rerender the UI accordingly.

    Side Effects are anything besides those previously mentioned, such as storing data in browser storage, sending HTTP requests, setting and managing timers, etc. These are all not exactly directly to do with bringing something onto the screen.

    Since a component is re-rendered often depending on the state, if we were to have a http request sitting there raw in the component, it would get re-sent EVERY SINGLE TIME the component is rerendered. That is not ideal. That can also easily set up an infinite loop.

    The useEffect hook solves this problem. It is called with two arguments: the first is a function which gets called at least once upon initial load of the component. The second argument is a dependency array, which is an array of state which, if changed, will trigger the initial function to run again.

    {
        useEffect(() => {
            // initial function
        }, [dependency array])
    }

    An empty dependency array means the function only runs upon initial load.

    Things you don't need to add to a dependency array:     
        1. state updating functions like setState(). React guarantees those functions never change.
        2. built in APIs or functions such as fetch() or localStorage... (functions and features built into the browser and hence globally available) These are not related to the React component and thus never change.
        3. Variables / functions defined outside of your component.

    CLEAN UP FUNCTIONS!!!!!!!!! LET'S GOOOOOO -
    Check the login component for a cool example of debouncing. Debouncing is when you want to check if a user has a valid input not after every keystroke but after a pause in their typing.
    For clean up functions we actually return a function from useEffect.
    This cleanup function actually does not run on the first instance of useEffect loading BUT instead it runs at the BEFORE the initial function call of the primary function on the subsequent running of useEffect.

    This is how it looks {
        useEffect(() => {
            console.log(bob.haircut);

            return () => {console.log(ben.haircut)}
        }, [bob.haircut])
    }

    Here's how it should actually look on the second/third, etc calls of useEffect {
        useEffect(() => {console.log(ben.haircut)}, () => {
            console.log(bob.haircut);

        }, [bob.haircut])
    }

    As mentioned, a better example of a use case for this can be found in Login.js. 

    The cleanup function also runs whenever the component unmounts from the dom. Mounting is the initial load of the component. Then each time it updates, thats called the updating phase, then when its destroyed or leaves the screen, it is unmounted.

    So the cleanup only runs on updates and just before it unmounts. NOT on the mounting stage.

    useEffect() without a dependency array will run EVERYTIME there is a state update/the component reloads.

    useEffect runs AFTER every components render cycle. So anything in a useEffect will be processed last.

    I guess useEffects get called at the end of the render because if they were called first or in the middle or wherever they sat in the code, then when the state altering code was executed afterwards, which changed state in its dependency array, it would get called again instantly, then that other code would run again.


Introducing useReducer() and Reducers in General 
    Just like useState, useReducer is for State Management. It's a way of controlling more complex state. For example if you have multiple values/peices of state, multiple ways of changing that state or dependencies to other state. Think of fetching something and having the data, isPending and an error message.

    useState can often become hard to use or error-prone. Its easy to write bad or ineffecient code in those cases.

    useReducer() can be used as a replacement for useState() if you need 'more powerful state management' 

    Downsides are its harder to set up than useState.

    Updating state based on other state, even if its external state, not itsself is bad practice as, with how React schedules updates, that peice of state we are evaluating might be old state. This is an example of bad practice - setFormIsValid(enteredEmail.length > 7). Normally we would use the function form of the state, such as setFormIsValid(prevFormValidity => {}) but there we cant because we aren't updating the state based on a previous version of the setFormIsValid() state. So instead we can use useReducer(). Also, useEffect only runs when state changes, so if this kind of function is inside of a useEffect, then that is okay as it will by default always run on the latest state values.

    useReducer syntax looks like this: 
        const [state, dispatchFn] = useReducer(reducerFn, initialState, initFn);

    So with this, we receive back the latest snapshot of the state, and a dispatch function. These work much in the same way of state and setState with useState except with the dispatchFn we have to create that ourselves. Instead of just setting a state value, you will dispatch an 'action'. That action will then be sent to the first argument in the useReducer method along with a snapshot of the current state, the reducer function, which is what activly manages and sets the state depending on what action you feed it with the dispatch function. The reducer sets the state by returning the updated version.

    The initial function, which is the last argument in the useReducer function is the initial function which is used to set that initial state, for example if your state dpeneds on a http request or something of the like.

    You should declare the reducer function OUTSIDE of the component, because inside of the reducer function we wont need any data created inside of the component function. 

    ///////////////////////////////////////////////////////////////////////////////////////////

    Alright, heres a full example of changing input state and isValid state with a reducer.

    import { useReducer } from 'react';

    const initialInputState = {
        value: '',
        isValid: null
    }

    const inputReducer = (state, action) => {
        if(action.type === 'NEW_INPUT_VALUE'){
            return { value: action.payload, isValid: action.payload.includes('@') }
        }
        if(action.type === 'ON_BLUR'){
            return { ...state, isValid: state.value.includes('@') }
        }

        return { value: '', isValid: null }
    }

    const Component = props => {

        const [inputState, dispatchInput] = useReducer(inputReducer, initialInputState)

        return <input
                    type='text'
                    value={inputState.value}
                    onChange={(e) => {dispatchInput({ type: 'NEW_INPUT_VALUE', payload: e.target.value })}}
                    onBlur={(e) => {dispatchInput({ type: 'ON_BLUR' })}}
                />
    }

    ///////////////////////////////////////////////////////////////////////////////////////////


120. Introducting React Context (Context API)
    The Context API is a way of solving a problem in React called prop drilling or prop chaining. This is where state is passed through multiple components, where it isnt used, just so it can reach a component where it is needed. This usually makes for a very messy developer experience and a very messy app.js file. Think of situations such as user data once theyve logged in, or items in a customers cart. 

    The Context API is basically a component-wide, behind the scenes state storage system!

    To use context in your app you need to do three things: 
        1. declare it in an initial context.js file like the one we have in the context folder in this project 
        2. wrap it / provide it. Say all components that are wrapped by it should have access to it
        3. you then need to consume it. Hook into it/listen to it.

    When you declare your initial context, having content in the object is actually optional. It is handy to have it in there because of VSCode's intellisense BUT the only values that actually get passed are the values in the <AuthContext.Provider value={ { isLoggedIn: true } }>. Weird, I know. When adding values in the initial AuthContext object you should always use the correct datatype, for example: { isLoggedIn: true, onLogout: () => {} }.

    'Providing' means that you have to wrap in the jsx code all the components you want to have access to your context. Any component which is not wrapped will not be able to listen.

    When wrapping we use: 
        <AuthContext.Provider value={ {isLoggedIn: false} }> 
            <AllOtherComponentsHere /> 
            <AllOtherComponentsHere /> 
            <AllOtherComponentsHere /> 
        </AuthContext.Provider>

    Remember here the AuthContext is a object and the .Provider is a component in that object.

    NOW FOR THE CONSUMPTION OF THE CONTEXT 

    We can also use another property of the AuthContext object - AuthContext.Consumer - We don't typically use this, we normally make a hook BUT this is an option.

    The consumer works in much the same way as the provider in the sense that we then wrap it around some jsx code. The consumer takes a child which is actually a function, where we get access to the context. It goes like so: 

    ///////////////////////////////////////////////////////////////////////////////////////////

    import AuthContext from '../context/auth-context';

    const Navigation = (props) => {
        return (
            <AuthContext.Consumer>
            {(ctx) => {
                <nav className={classes.nav}>
                <ul>
                    {ctx.isLoggedIn && (
                    <li>
                        <a href="/">Users</a>
                    </li>
                    )}
                    {ctx.isLoggedIn && (
                    <li>
                        <a href="/">Admin</a>
                    </li>
                    )}
                    {ctx.isLoggedIn && (
                    <li>
                        <button onClick={props.onLogout}>Logout</button>
                    </li>
                    )}
                </ul>
                </nav>
            }}
            </AuthContext.Consumer>
        );
    };

    ///////////////////////////////////////////////////////////////////////////////////////////

    NOW FOR THE MORE ELEGENT WAY OF CONSUMING THE CONTEXT API! 

    So the more elegent way is way friggin easier.

    Heres the same cade as before but using the useContext hook instead of the Comsumer component.

    ///////////////////////////////////////////////////////////////////////////////////////////

    import { useContext } from 'react';
    import AuthContext from '../context/auth-context';


    const Navigation = (props) => {

        const { isLoggedIn } = useContext(AuthContext)
        
        return (
                <nav className={classes.nav}>
                    <ul>
                    {isLoggedIn && (
                        <li>
                        <a href="/">Users</a>
                        </li>
                    )}
                    {isLoggedIn && (
                        <li>
                        <a href="/">Admin</a>
                        </li>
                    )}
                    {isLoggedIn && (
                        <li>
                        <button onClick={props.onLogout}>Logout</button>
                        </li>
                    )}
                    </ul>
                </nav>
        );
    };

    ///////////////////////////////////////////////////////////////////////////////////////////

    In addition to this we can also make our own Context Provider component. The benefits of this is that we can have all of the functionality associated with, lets say, the user login, user info and user logout, in one place, which wraps all of the components that need that information.

    We add this component into the auth-context file which houses the original auth context object.

    We can then wrap the App component in this new custom context provider and then use the useContext hook in whichever component we need that piece of state! YEEEHAWWWW!

    Heres the new auth-context file 

    ///////////////////////////////////////////////////////////////////////////////////////////

    import React, { useState, useEffect } from 'react';

    // initialize the AuthContext object
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

    ///////////////////////////////////////////////////////////////////////////////////////////

    Once we wrap the <App /> in this then in each component we just have to do this to access the context.

    ///////////////////////////////////////////////////////////////////////////////////////////

    import { useContext } from 'react';

    import AuthContext from '../context/AuthContext';

    const Component = props => {
        const { isLoggedIn } = useContext(AuthContext);

        return (
            <div className=color isLoggedIn ? 'green' : 'red'>
            </div>
        )
    }

    export default Component;

    ///////////////////////////////////////////////////////////////////////////////////////////

    Context limitations: 
        Context is not optimised for high frequency changes. No input onChange, etc. Redux is apparently a solution for this!

        Context should not be used to replace all component communications and props.


126. Learning the 'Rules of Hooks'
    Formal definition for rules 

        1. You must only call React hooks in React component functions (or custom hooks). For example we cant declare state before/outside of out component declarations. Also, as another example, we cant declare state or a useEffect or whatever hook inside of a handler function. We can set the state, but we CANNOT call a hook inside of one.

        2. You must only call react hooks at the top level of a functional component. Don't call them in nested functions and dont call them in any block statements. Block statements are groups of code between {}, for example after an if() statement. 

        Bonus rule on useEffect: Always add everything you use inside of a useEffect as a dependency, unless there is a really good reason not to do that. And dont add browser APIs/global APIs.


128. Diving into 'Forward Refs'
    So, let's make a couple of terms clear here before we begin: 
        1. Imperative programming is a way of programming where your code shows exactly what you want to happen in your code. 
        2. Declarative programming is when your code shows what you want to happen.

        Lets show this in a couple of real world analogies: 

            If you wanted the gutters of your house cleaned and the roof painted, you would tell the workmen 'I want my roof painted red and all of the leaves scooped out of the gutters'. This is an analogy for declarative programming.
            You wouldnt tell the to pressure hose the tiles, scrub any extra bits of grit away with a wire brush, use a hand spade to scoop our the leaves from the gutter into the bin, get spray paint, etc. That there would be an imperative way of programming.

        When we uses functional components react uses vanilla javascript behind the scenes to turn out jsx code into working html, css and js. React is built to be a declarative way of programming, so declaring things like the UI imperativly goes against the react philosophy and should be avoided whenever possible. But when things get rough, we have the useImperativeHandle() hook.

    useImperativeHandle() is a hook which instead of passing state to a component that then changes the component (declarative), actually calls a function inside of a component in an imperative way.

    Through useImperitiveHandle and React.forwardRef() we can expose a parent component to functions inside of the child component, to then use the child component inside of the parent component through refs and trigger certain functionalities. Also, not only functions actually but values.

    We use this on something like an input, when the input is not called by html like code directly inside of the jsx, rather when it is a nested component. If it was just html like code inside of the parent, one - it wouldnt be the parent anymore and two - in that case we could just use a normal ref.

    useImperativeHandler kinda makes an api which is only meant for the parent to access.

    This really isn't as complicated as Max made it so heres the gist: 
        React functional components do not have the ability to accept a ref prop. So to add this functionality we then wrap the functional component in another React function called React.forwardRef. 

        This is how you declare a component using the React.forwardRef (this is the child component): 

        //////////////////////////////////////////////////////////////////////////////////////////////////

            import React, { useState } from 'react';

            const Input = React.forwardRef((props, ref) => {
                const [state, setState] = useState();
                const newFunction = () => {
                    console.log('its valid!!!');
                };

                useImperativeHandle(ref, () => {
                    return {
                        state: state,
                        newFunction: newFunction
                    };
                }); 
            });

        //////////////////////////////////////////////////////////////////////////////////////////////////

        In this example, you can see here that the useImperativeHandle is basically a hook that returns an object. This object is what is accessable from the parent component and can contain whatever values or functions you need from within that component. It takes in two arguments: 

            The first is the ref, which don't forget, comes from the parent component, which you passed in alongside the props.

            The second is a handle. Here we just made an empty arrow function which returns an object containing whatever values or functions we need.

            It does take a optional third argument which is dependencies, but I will not be learning about there here.

        So in the parent component all we really need to do is this.

        //////////////////////////////////////////////////////////////////////////////////////////////////

        import { useRef } from 'react';

        const ParentComponent = props => {
            const inputRef = useRef();

            if(props.isValid){
                inputRef.current.newFunction();
            }

            return (
                <>
                    <Input ref={inputRef} />
                </>
            )
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////

        See here we can access the newFunction() inside of the child component but from the parent with our inputRef.current.newFunction().

        



LOCAL STORAGE IN THE BROWSER 
    How did I not hear of this earlier? Super cool! You can use 'localStorage.setItem('key', 'value');'. More examples on the App.js file.
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





LOCAL STORAGE IN THE BROWSER 
    How did I not hear of this earlier? Super cool! You can use 'localStorage.setItem('key', 'value');'. More examples on the App.js file.
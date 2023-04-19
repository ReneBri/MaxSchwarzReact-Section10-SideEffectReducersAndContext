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
        1. state updating functions like setState(). React guarentees those functions never change.
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

    A better example of a use case for this can be found in Login.js. 

    The cleanup function also runs whenever the component unmounts from the dom. Mounting is the initial load of the component. Then each time it updates, thats called the updating phase, then when its destroyed or leaves the screen, it is unmounted.

    So the cleanup only runs on updates and just before it unmounts. NOT on the mounting stage.

    useEffect() without a dependency array will run EVERYTIME there is a state update/the component reloads.

    useEffect runs AFTER every components render cycle. So anything in a useEffect will be processed last.



LOCAL STORAGE IN THE BROWSER 
    How did I not hear of this earlier? Super cool! You can use 'localStorage.setItem('key', 'value');'. More examples on the App.js file.
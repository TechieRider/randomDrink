import React, {useState, useEffect, useCallback, useRef, createContext} from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core'


const Twitch = () => {
    const [drink, setDrink] = useState('')
    const [drinkImg, setDrinkImg] = useState('')
    const [drinkIngredient, setDrinkIngredient] = useState('')
    const [searchString, setSearchString] = useState('')
    const inputEl = useRef(null);
    const DisplayDrink = createContext();
    
    
    const btnStyle = css`
    color: hotpink;
  `

    useEffect(() => {
        getADrink();
    }, [])

    
    const getADrink = useCallback(() => {
    fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php').then(
        response => response.json()
    ).then((result) => {console.log(result.drinks[0].strDrink)
       setDrink(result.drinks[0].strDrink);
        setDrinkImg(result.drinks[0].strDrinkThumb)
        setDrinkIngredient(result.drinks[0].strIngredient1)
    })
}, [])

    function focusBar() {
        inputEl.current.focus();
    }

    const getADrinkByIngredient = () => {
        console.log('searchString', searchString)
        fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + searchString
        ).then(function (response) {
            if (!response.ok) {
                return Promise.reject('some reason');
            }
        
            return response.json();
        }
       // response => response.json() 
    ).then((result) => {
        console.log(result)
        var randomisedDrink = result.drinks.splice(Math.random() * result.drinks.length | 0, 1)[0];
        console.log(randomisedDrink)
        setDrink(randomisedDrink.strDrink);
        setDrinkImg(randomisedDrink.strDrinkThumb)
        setDrinkIngredient(searchString)
    } 
    )}

   

    function Display() {
        return (
          <DisplayDrink.Consumer>
            {value => <div>The main ingredient is {value}.</div>}
          </DisplayDrink.Consumer>
        );
      }


   return (
   <div>
       <div >
            <img src={drinkImg} css={{ maxHeight: '30rem' }} alt=""></img>
       </div>
       <br/>
       <div css={css`
            background-color: hotpink;
            &:hover {
            color: green;
        }`}>
            {drink}
       </div>
       <br/>
      <DisplayDrink.Provider value={drinkIngredient}>
        <div> 
            <Display/>
        </div>
      </DisplayDrink.Provider>
       <button onClick={getADrink}>Get a new drink</button>
       <p>Get a drink based on ingredient</p><p>{searchString}</p>
       <input ref={inputEl} type="text" onChange={e => setSearchString(e.target.value)} value={searchString}/><button onClick={focusBar}>Focus the input</button>
      <br/>
      <button onClick={getADrinkByIngredient}>Get that drink!</button>
   </div>)
}

export default Twitch;
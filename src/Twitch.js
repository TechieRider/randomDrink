import React, {useState, useEffect, useCallback, useRef, createContext} from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { Provider, inject, observer } from 'mobx-react';

const Twitch = () => {
    const [drink, setDrink] = useState('')
    const [drinkImg, setDrinkImg] = useState('')
    const [drinkIngredient, setDrinkIngredient] = useState('')
    const [searchString, setSearchString] = useState('')
    const inputEl = useRef(null);
    const DisplayDrink = createContext();

    const history = [];

    useEffect(() => {
        getADrink();
    }, [])

    const drinkButton = css({
     backgroundColor:'#db1f6a',
	borderRadius: '28px',
	border: '1px solid #ffffff',
	display:'inline-block',
	color: '#ffffff',
	padding: '10px 20px'
})
    
    const getADrink = useCallback(() => {
    fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php').then(
        response => response.json()
    ).then((result) => {console.log(result.drinks[0].strDrink)
       setDrink(result.drinks[0].strDrink);
        setDrinkImg(result.drinks[0].strDrinkThumb)
        setDrinkIngredient(result.drinks[0].strIngredient1)
        var validDrinkSyntax = {name: result.drinks[0].strDrink, img: result.drinks[0].strDrinkThumb, id: result.drinks[0].idDrink, main: result.drinks[0].strIngredient1}
        searchHistory(validDrinkSyntax);
    }).catch((result) => {
        console.log(result)
        setDrink('No drink for you')
        setDrinkImg('https://i.pinimg.com/originals/70/e6/d4/70e6d45d537df0749ab8dafa8db43a27.gif')
    })
}, [])

    function searchHistory(drink) {
        console.log(drink)
        history.push(drink);
        console.log(history)
    }

    function focusBar() {
        inputEl.current.focus();
    }

    const getADrinkByIngredient = () => {
        console.log('searchString', searchString)
        fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + searchString
        ).then(function (response) {
            console.log(response)
            if (response.ok) {
                var resp = response.json();
                console.log(resp)
                return resp;
               
            } else {
                
            }
        
        }
       // response => response.json() 
    ).then((result) => {
        console.log(result)
        var randomisedDrink = result.drinks.splice(Math.random() * result.drinks.length | 0, 1)[0];
        console.log(randomisedDrink)
        setDrink(randomisedDrink.strDrink);
        setDrinkImg(randomisedDrink.strDrinkThumb)
        setDrinkIngredient(searchString)
        var validDrinkSyntax = {name: randomisedDrink.strDrink, img: randomisedDrink.strDrinkThumb, id: randomisedDrink.idDrink, main: drinkIngredient}
        searchHistory(validDrinkSyntax);
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
      <Provider>

      </Provider>
       <button onClick={getADrink} css={drinkButton}> Get a new drink</button>
       <p>Get a drink based on ingredient</p>
       <input ref={inputEl} type="text" onChange={e => setSearchString(e.target.value)} value={searchString}/><button onClick={focusBar} css={drinkButton}>Focus the input</button>
      <br/>
      <button onClick={getADrinkByIngredient} css={drinkButton}>Get that drink!</button>
   </div>)
}

export default Twitch;
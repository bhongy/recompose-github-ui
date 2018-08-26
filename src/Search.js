import React from "react";
import { componentFromStream, createEventHandler } from "recompose";
import { combineLatest } from "rxjs";
import { map, startWith, tap } from "rxjs/operators";

import User from './User';
import './Search.css';

const Search = componentFromStream(props$ => {
  const {
    handler: handleInputChange,
    stream: inputChange$
  } = createEventHandler();

  const value$ = inputChange$.pipe(
    map(event => event.currentTarget.value),
    startWith("")
  );

  return combineLatest(props$, value$).pipe(
    tap(console.log),
    map(([props, value]) => (
      <div>
        <input
          className="Search_Input"
          onChange={handleInputChange}
          placeholder="GitHub username"
        />
        <User user={value} />
      </div>
    ))
  );
});

export default Search;

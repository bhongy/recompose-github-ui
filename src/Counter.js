import React from "react";
import { combineLatest, mapTo, merge, startWith, scan } from "rxjs/operators";
import { createEventHandler, componentFromStream } from "recompose";

const Counter = componentFromStream(props$ => {
  const { handler: handleIncrement, stream: increment$ } = createEventHandler();
  const { handler: handleDecrement, stream: decrement$ } = createEventHandler();
  const count$ = merge(
    increment$.pipe(mapTo(1)),
    decrement$.pipe(mapTo(-1))
  ).pipe(
    startWith(0),
    scan((count, n) => count + n)
  );

  return combineLatest(props$, count$, (props, count) => (
    <div {...props}>
      <span>Count: {count}</span>
      <button onClick={handleIncrement}>+</button>
      <button onClick={handleDecrement}>-</button>
    </div>
  ));
});

export default Counter;

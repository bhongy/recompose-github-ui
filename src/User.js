import React from "react";
import { componentFromStream } from "recompose";
import { BehaviorSubject, merge, of } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  catchError,
  debounceTime,
  delay,
  filter,
  map,
  pluck,
  switchMap,
  tap
} from "rxjs/operators";
import Error from "./Error";
import "./User.css";

const GithubUserComponent = ({
  login,
  avatar_url,
  name,
  public_repos,
  public_gists,
  followers
}) => (
  <div className="github-card user-card">
    <div className="header User" />
    <a className="avatar" href={`https://github.com/${login}`}>
      <img src={`${avatar_url}&amp;s=80`} alt={name} />
    </a>
    <div className="content">
      <h1>{name}</h1>
      <ul className="status">
        <li>
          <a href={`https://github.com/${login}?tab=repositories`}>
            <strong>{public_repos}</strong>
            Repos
          </a>
        </li>
        <li>
          <a href={`https://gist.github.com/${login}`}>
            <strong>{public_gists}</strong>
            Gists
          </a>
        </li>
        <li>
          <a href={`https://github.com/${login}/followers`}>
            <strong>{followers}</strong>
            Followers
          </a>
        </li>
      </ul>
    </div>
  </div>
);

const toUserUrl = user => `https://api.github.com/users/${user}`;
export default componentFromStream(props$ => {
  const loading$ = new BehaviorSubject(false);
  const getUser$ = props$.pipe(
    debounceTime(300),
    pluck("user"),
    filter(Boolean),
    map(toUserUrl),
    tap(() => loading$.next(true)),
    switchMap(url =>
      /* alternatively, ...
      from(fetch(url)).pipe(
        flatMap(res => res.json()),
        map(User)
      )
      */

      // creates a new observable (new pipe) rather than using the original pipe
      // so the original stream is not terminated
      // because when "error" a stream completes
      ajax(url).pipe(
        tap(() => loading$.next(false)),
        pluck("response"),
        delay(1500),
        map(GithubUserComponent),
        catchError(error =>
          of(
            <Error statusCode={error.status} message={error.response.message} />
          )
        )
      )
    )
  );

  return merge(loading$, getUser$).pipe(
    map(result => (result === true ? <h3>Loading ...</h3> : result))
  );
});

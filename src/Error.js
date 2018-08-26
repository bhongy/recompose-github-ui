import React from "react";

const Error = ({ statusCode, message }) => (
  <div className="error">
    <h2>Oops!</h2>
    <strong>{statusCode}: {message}</strong>
    <p>Please try searching again.</p>
  </div>
)

export default Error;
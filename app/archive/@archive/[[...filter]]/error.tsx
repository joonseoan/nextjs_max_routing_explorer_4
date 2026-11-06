// Just reminds that the client side component pre-renders in the server.
// Then, it can render again in the client side.
// The reason the Error component implements `use client`,
// is because the error can occur in both client and server sides.


'use client';

function FilterError() {
  return (
    <div id="error">
      <h2>An error occurred.</h2>
      <p>Invalid path.</p>

    </div>
  );
}

export default FilterError;
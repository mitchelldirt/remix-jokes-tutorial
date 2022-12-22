export default function NewJokeForm() {
  return (
    <>
      <p>add your own joke!</p>
      <form method="post">
        <label>
          Name: <input type='text'></input>
        </label>

        <label>
          Content: <textarea name="content" />
        </label>

        <button type="submit">
          Add Joke
        </button>
      </form>
    </>
  );
}

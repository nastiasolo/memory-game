export default function EmojiButton({
  content,
  handleClick,
  selectedCartEntry,
  matchedCardEntry,
}) {
  const btnContent = selectedCartEntry || matchedCardEntry ? content : "?";
  const btnStyle = matchedCardEntry
    ? "btn--emoji__back--matched"
    : selectedCartEntry
    ? "btn--emoji__back--seklected"
    : "btn--emoji__front";

  return (
    <button className={`btn btn--emoji ${btnStyle}`} onClick={handleClick}>
      {btnContent}
    </button>
  );
}

import { useEffect } from "react";
import RegularButton from "./RegularButton";
import Select from "./Select";

export default function Form({ handleSubmit, handleChange, isFirstRender }) {
  const divRef = useRef(null);

  useEffect(() => {
    !isFirstRender && divRef.current.focus();
  }, []);

  return (
    <div className="form-container">
      <p className="form-container">
        Customize the game by selection an emoji category and a number of memory
        cards
      </p>
      <form className="wrapper">
        <Select handleChange={handleChange} />
        <RegularButton handleClick={handleSubmit}>Start Game</RegularButton>
      </form>
    </div>
  );
}

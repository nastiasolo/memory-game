import { useEffect, useState } from "react";
import AssistiveTechInfo from "./components/AssistiveTechInfo";
import Form from "./components/Form";
import MemoryCard from "./components/MemoryCard";
import GameOver from "./components/GameOver";
import ErrorCard from "./components/ErrorCard";

function App() {
  const initialFormData = {
    category: "food-and-drink",
    number: 10,
  };

  const [isFirstRender, setIsFirstRender] = useState(true);
  const [formData, setFormData] = useState(initialFormData);
  const [isGameOn, setIsGameOn] = useState(false);
  const [emojisData, setEmojisData] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [areAllCardsMatched, setAreAllCardsMatched] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (
      selectedCards.length === 2 &&
      selectedCards[0].name === selectedCards[1].name
    ) {
      setMatchedCards((prevMatchedCards) => [
        ...prevMatchedCards,
        ...selectedCards,
      ]);
    } else if (
      selectedCards.length === 2 &&
      selectedCards[0].name != selectedCards[1].name
    ) {
      setTimeout(() => {
        setSelectedCards([]);
      }, 1000);
    }
  }, [selectedCards]);

  useEffect(() => {
    if (emojisData.length && matchedCards.length === emojisData.length) {
      setAreAllCardsMatched(true);
    }
  }, [matchedCards]);

  function handleFormChange(e) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
  }

  async function startGame(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://emojihub.yurace.pro/api/all/category/${formData.category}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      const dataSlice = await getDataSlice(data);
      const emojisArray = await getEmojisArray(dataSlice);

      setEmojisData(emojisArray);

      setIsGameOn(true);
      setIsFirstRender(false);
    } catch (error) {
      console.error("Failed to fetch:", error);
      setIsError(true);
    } finally {
      setIsFirstRender(false);
    }
  }

  async function getDataSlice(data) {
    const randomIndices = getRandomIndices(data);
    const dataSLice = randomIndices.reduce((array, index) => {
      array.push(data[index]);
      return array;
    }, []);
    return dataSLice;
  }

  function getRandomIndices(data) {
    const randomIndicesArray = [];
    for (let i = 0; i < formData.number / 2; i++) {
      const randomIndex = Math.floor(Math.random() * data.length);
      if (!randomIndicesArray.includes(randomIndex)) {
        randomIndicesArray.push(randomIndex);
      } else {
        i--;
      }
    }
    return randomIndicesArray;
  }

  async function getEmojisArray(data) {
    const pairedEmojisArray = [...data, ...data];

    for (let i = pairedEmojisArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = pairedEmojisArray[i];
      pairedEmojisArray[i] = pairedEmojisArray[j];
      pairedEmojisArray[j] = temp;
    }
    return pairedEmojisArray;
  }

  function turnCard(name, index) {
    if (selectedCards.length < 2) {
      setSelectedCards((prevSelectedCards) => [
        ...prevSelectedCards,
        { name, index },
      ]);
    } else if (selectedCards.length === 2) {
      setSelectedCards([{ name, index }]);
    }
  }

  function resetGame() {
    setIsGameOn(false);
    setSelectedCards([]);
    setMatchedCards([]);
    setAreAllCardsMatched(false);
  }

  function resetError() {
    setIsError(false);
  }

  return (
    <>
      <main>
        <h1>Memory Game</h1>
        {!isGameOn && !isError && (
          <Form
            handleSubmit={startGame}
            handleChange={handleFormChange}
            isFirstRender={isFirstRender}
          />
        )}
        {isGameOn && !areAllCardsMatched && (
          <AssistiveTechInfo
            emojiData={emojisData}
            matchedCards={matchedCards}
          />
        )}
        {areAllCardsMatched && <GameOver handleClick={resetGame} />}
        {isGameOn && (
          <MemoryCard
            data={emojisData}
            handleClick={turnCard}
            selectedCards={selectedCards}
            matchedCards={matchedCards}
          />
        )}
        {isError && <ErrorCard handleClick={resetError} />}
      </main>
    </>
  );
}

export default App;

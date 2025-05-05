import { useEffect, useState } from "react";
import Form from "./components/Form";
import MemoryCard from "./components/MemoryCard";

function App() {
  const [isGameOn, setIsGameOn] = useState(false);
  const [emojisData, setEmojisData] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [isGameOver, setGameOver] = useState(false);

  console.log(selectedCards);

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
      setGameOver(true);
    }
  }, [matchedCards]);

  async function startGame(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://emojihub.yurace.pro/api/all/category/food-and-drink"
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      const dataSlice = await getDataSlice(data);
      const emojisArray = await getEmojisArray(dataSlice);

      setEmojisData(emojisArray);

      setIsGameOn(true);
    } catch (error) {
      console.error("Failed to fetch:", error);
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
    for (let i = 0; i < 5; i++) {
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

  return (
    <>
      <main>
        <h1>Memory Game</h1>
        {!isGameOn && <Form handleSubmit={startGame} />}
        {isGameOn && (
          <MemoryCard
            data={emojisData}
            handleClick={turnCard}
            selectedCards={selectedCards}
            matchedCards={matchedCards}
          />
        )}
      </main>
    </>
  );
}

export default App;

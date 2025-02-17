import { useEffect, useState } from "react"

function App() {
  const [gridSize, setGridSize] = useState(4);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disable, setDisable] = useState(false);
  const [won, setWon] = useState(false); 

  const handleGridSize = (e) => {
    const size = parseInt(e.target.value);
    if (size >= 2 && size <= 10) setGridSize(size)
    
  }
  const intializeGame = () => {
    const totalCards = gridSize * gridSize;
    const pairs = Math.floor(totalCards / 2);
    const numbers = [...Array(pairs).keys()].map((n) => n + 1);
    const suffleCards = [...numbers, ...numbers].sort(() => Math.random() - 0.5).slice(0, totalCards).map((number, index) => ({ id: index, number }))
    setCards(suffleCards);
    setFlipped([]);
    setSolved([]);
    setWon(false);
  }
  useEffect(() => {
    intializeGame();
  }, [gridSize]);
  const checkId = (secondId) => {
    const [firstId] = flipped;
    if (cards[firstId].number === cards[secondId].number) {
      setSolved([...solved, firstId, secondId]);
      setFlipped([]);
      setDisable(false);
    } else {
      setTimeout(() => {
        setFlipped([]);
        setDisable(false);
      },1000)
    }
  }

  const handleCard = (id) => {
    if (disable || won) return;
    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }
    if (flipped.length === 1) {
      setDisable(true);
      if (id !== flipped[0]) {
        setFlipped([...flipped, id]);
        checkId(id);
      } else {
        setFlipped([]);
        setDisable(false);
      }
    }
  }
  useEffect(() => {
    if (solved.length === cards.length && cards.length > 0) {
      setWon(true);
  }
  }, [solved, cards])
  useEffect(() => {
    if (won) {
      setTimeout(() => {
        setWon(false);
        setFlipped([]);
        setDisable(false);
        setSolved([]);

      },5000)
    }
  })

  const isFlipped = (id) => flipped.includes(id) || solved.includes(id);
  const isSolved = (id) => solved.includes(id);
  return (
    <div className="flex flex-col justify-center items-center  min-h-screen  " style={{backgroundColor:'#242424'}}>
        <h1 className=" text-4xl font-bold  m-2 p-2 text-red-500 ">
          <span className="redText mr-2 span">Memory</span>
          <span className="blueText span ">Game</span>
        </h1>
        <div className=" m-4 p-4 text-3xl   flex items-center justify-center ">
          <label
            htmlFor="gridSize"
            className=" text-white font-semibold yellowText"
          >
            GridSize :
          </label>
          <input
            type="number"
            id="gridSize"
            min={2}
            max={10}
            value={gridSize}
            onChange={handleGridSize}
            className=" bg-inherit text-white yellowText rounded-md  py-1 num"
          />
        </div>
        {/* cards */}
        <div
          className={` grid gap-4 mb-2 `}
          style={{
            gridTemplateColumns: `repeat(${gridSize},minmax(0,1fr))`,
            width: `min(100%,${gridSize * 5}rem)`,
          }}
        >
          {cards.map((card) => {
            return (
              <div
                className={`btn flex aspect-square text-lg text-white items-center justify-center ${
                  isFlipped(card.id)
                    ? isSolved(card.id)
                      ? "s bg-green-500 "
                      : " f bg-blue-500 animate-bounce"
                    : " n"
                }`}
                key={card.id}
                onClick={() => handleCard(card.id)}
              >
                {" "}
                {isFlipped(card.id) ? card.number : "?"}{" "}
              </div>
            );
          })}
        </div>
        {/* result */}
        {won && <div className="text-2xl m-4 text-white  w "> YOU WON !! </div>}

        {/* reset */}
        <button
          onClick={intializeGame}
          className=" r n text-white text-xl p-2 m-4"
        >
          {won ? "play again" : "reset"}
        </button>
      </div>
  );
}

export default App

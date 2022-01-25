import logo from "./logo.svg";
import React from "react";
import "./App.css";
import Title from "./components/Title";

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};

function CatItem(props) {
  return (
    <li>
      <img src={props.img} style={{ width: "150px" }} />
    </li>
  );
}

function Favourites({ favourites }) {
  if (favourites.length === 0) {
    // conditional rendering
    return <div>사진 위 하트를 눌러 고양이를 저장해 봐요</div>;
  }
  return (
    <ul className="favorites">
      {favourites.map((cat) => (
        <CatItem img={cat} key={cat} />
      ))}
    </ul>
  );
}

const MainCard = ({ img, handleHeartClick, alreadyFavourited }) => {
  const heartIcon = alreadyFavourited ? "💖" : "🤍";
  return (
    <div className="main-card">
      <img src={img} />
      <button onClick={handleHeartClick}>{heartIcon}</button>
    </div>
  );
};

const Form = ({ updateMainCat }) => {
  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);
  const [value, setValue] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  function handleInputChange(e) {
    const userValue = e.target.value;
    setErrorMessage("");

    if (includesHangul(e.target.value) == true) {
      setErrorMessage("한글은 입력할 수 없습니다.");
      // setValue 위치에 따라서 한글 입력은 되는데 보이지 않을 수 있음
    }
    setValue(e.target.value.toUpperCase());
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    setErrorMessage(""); // 시작할 때마다 빈값으로 초기화
    if (value === "") {
      setErrorMessage("빈값으로 만들 수 없습니다.");
      return;
    }

    updateMainCat(value);
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        name="name"
        placeholder="영어 대사를 입력해주세요"
        value={value}
        onChange={handleInputChange}
      />
      <button type="submit">생성2</button>
      <p style={{ color: "red" }}>{errorMessage}</p>
    </form>
  );
};

const App = () => {
  const CAT1 = "https://cataas.com/cat/60b73094e04e18001194a309/says/react";
  const CAT2 = "https://cataas.com//cat/5e9970351b7a400011744233/says/inflearn";
  const CAT3 =
    "https://cataas.com/cat/595f280b557291a9750ebf65/says/JavaScript";

  //const [counter, setCounter] = React.useState(1);
  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem("counter");
  });
  const [mainCat, setMainCat] = React.useState(CAT1);
  const [favourites, setFavourites] = React.useState(() => {
    return jsonLocalStorage.getItem("favourites") || [];
  });

  async function setInitialCat() {
    const newCat = await fetchCat("first cat");
    console.log(newCat);
    setMainCat(newCat);
  }
  React.useEffect(() => {
    setInitialCat();
  }, []);

  async function updateMainCat(value) {
    const newCat = await fetchCat(value);

    setMainCat(newCat);

    setCounter((prev) => {
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem("counter", nextCounter);
      return nextCounter;
    });
  }

  function handleHeartClick() {
    const nextFavourites = [...favourites, mainCat];
    setFavourites(nextFavourites);
    jsonLocalStorage.setItem("favourites", nextFavourites);
  }

  const alreadyFavourited = favourites.includes(mainCat);

  const counterTitle = counter === null ? "" : counter + "번째 ";

  return (
    <div>
      <Title>{counterTitle}고양이 가라사대</Title>
      <Form updateMainCat={updateMainCat} />
      <MainCard
        img={mainCat}
        handleHeartClick={handleHeartClick}
        alreadyFavourited={alreadyFavourited}
      />
      <Favourites favourites={favourites} />
    </div>
  );
};

export default App;

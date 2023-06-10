import { useCallback, useEffect, useState } from "react";

// @emotion/css
import { css } from "@emotion/css";

// components
import Button from "./components/Button/Button";

// styles
import styles from "./styles.module.css";
import Auxiliary from "./components/Auxiliary/Auxiliary";

function App() {
  const [error, setError] = useState("");
  const [input, setInput] = useState("");

  const [aux, setAux] = useState([]);
  const [shake, setShake] = useState(false);
  const [caretPositionI, setCaretPositionI] = useState(0);
  const [caretPositionE, setCaretPositionE] = useState(0);

  const handleInput = useCallback((e) => {
    const pattern = /^\s*-?\d*\.?\d+(?:\s*[-+*/]\s*-?\d*\.?\d+)*\s*$/;
    if (pattern.test(e.target.value)) setInput(e.target.value);
    else setShake(true);
  }, []);

  const focus = useCallback(() => {
    const input = document.getElementById("input");
    input?.focus();
    input?.setSelectionRange(caretPositionI, caretPositionI);
  }, [caretPositionI]);

  useEffect(() => {
    focus();
    if (shake) setTimeout(() => setShake(false), 400);
  }, [shake]);

  const calculate = useCallback(
    (e) => {
      e.preventDefault();
      try {
        if (aux.length === 2) {
          const [operand1, operator] = aux;
          switch (operator) {
            case "/":
              setInput(Number(operand1) / Number(input));
              break;
            case "x":
              setInput(Number(operand1) * Number(input));
              break;
            case "-":
              setInput(Number(operand1) - Number(input));
              break;
            default:
              setInput(Number(operand1) + Number(input));
              break;
          }
          setAux([]);
        }
      } catch (err) {
        console.error(err);
        setError("ERROR");
      }
    },
    [aux, input]
  );

  const backspace = useCallback(() => {
    setInput(input.substring(0, input.length - 1));
    focus();
  }, [input, focus]);

  const cleanInput = useCallback(() => {
    setInput("");
    focus();
  }, [focus]);

  const clean = useCallback(() => {
    setAux([]);
    cleanInput();
  }, [cleanInput]);

  const addCharacter = useCallback(
    (character) => {
      if (caretPositionE === caretPositionI) {
        let set = false;
        console.log(input);
        let newString = "";
        for (let i = 0; i < input.length; i += 1) {
          if (caretPositionE === i) {
            newString += character;
            newString += input[i];
            set = true;
          } else newString += input[i];
        }
        if (!set) newString += character;
        handleInput({ target: { value: newString } });
      } else {
        let set = false;
        let newString = "";
        for (let i = 0; i < input.length; i += 1) {
          if (i < caretPositionI && i < caretPositionE) newString += input[i];
          else if (caretPositionI < i && i < caretPositionE && !set) {
            newString += character;
            set = true;
            // nothing
          } else if (i >= caretPositionE) newString += input[i];
        }
        handleInput({ target: { value: newString } });
      }
      focus();
    },
    [input, focus, handleInput, caretPositionI, caretPositionE]
  );

  const isNotOperator = (value) => {
    switch (value) {
      case "/":
      case "x":
      case "+":
      case "-":
        return true;
      default:
        return false;
    }
  };

  const addOperation = useCallback(
    (operator) => {
      if (isNotOperator(aux.at(-1))) {
        const newAux = [...aux];
        newAux[newAux.length - 1] = operator;
        setAux(newAux);
      } else setAux([input, operator]);
    },
    [aux, input]
  );

  const updateCaret = useCallback(() => {
    const input = document.getElementById("input");
    setCaretPositionI(input?.selectionStart);
    setCaretPositionE(input?.selectionEnd);
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black">
      <form onSubmit={calculate} className={styles.form}>
        <Auxiliary aux={aux} />
        <div className="flex flex-col">
          <input
            id="input"
            className={`${styles.input} ${
              shake ? "shake" : ""
            } text-white bg-primary`}
            value={input}
            onBlur={updateCaret}
            onChange={handleInput}
            readOnly
          />
          <div
            className={`grid transition-all ${css({
              gridTemplateRows: error.length ? "1fr" : "0fr",
            })}`}
          >
            <span className={`text-error text-end overflow-hidden`}>
              {error}
            </span>
          </div>
        </div>
        <div className={styles.firstRow}>
          <Button number="CE" onClick={cleanInput} className="!text-xl" />
          <Button number="C" onClick={clean} className="!text-xl" />
          <Button
            onClick={backspace}
            number={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.7427 8.46448L19.1569 9.87869L17.0356 12L19.157 14.1214L17.7428 15.5356L15.6214 13.4142L13.5 15.5355L12.0858 14.1213L14.2072 12L12.0859 9.87878L13.5002 8.46457L15.6214 10.5858L17.7427 8.46448Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.58579 19L2.29289 12.7071C1.90237 12.3166 1.90237 11.6834 2.29289 11.2929L8.58579 5H22.5857V19H8.58579ZM9.41421 7L4.41421 12L9.41421 17H20.5857V7H9.41421Z"
                  fill="currentColor"
                />
              </svg>
            }
          />
          <Button
            onClick={() => addOperation("/")}
            number={"/"}
            className="font-bold pb-1"
          />
        </div>
        <div className={styles.numbers}>
          <div className={styles.row}>
            <Button onClick={() => addCharacter("7")} number={7} />
            <Button onClick={() => addCharacter("8")} number={8} />
            <Button onClick={() => addCharacter("9")} number={9} />
            <Button
              onClick={() => addOperation("x")}
              number={<span className="text-xl">&#10005;</span>}
            />
          </div>
          <div className={styles.row}>
            <Button onClick={() => addCharacter("4")} number={4} />
            <Button onClick={() => addCharacter("5")} number={5} />
            <Button onClick={() => addCharacter("6")} number={6} />

            <Button
              onClick={() => addOperation("-")}
              number={<span className="text-xl">&#9866;</span>}
            />
          </div>
          <div className={styles.row}>
            <Button onClick={() => addCharacter("1")} number={1} />
            <Button onClick={() => addCharacter("2")} number={2} />
            <Button onClick={() => addCharacter("3")} number={3} />
            <Button
              onClick={() => addOperation("+")}
              number={"+"}
              className="font-bold pb-1 !text-3xl !h-8"
            />
          </div>
          <div className={styles.row}>
            <Button onClick={() => addCharacter("1")} number={"+/-"} />
            <Button onClick={() => addCharacter("0")} number={0} />
            <Button onClick={() => addCharacter(".")} number={"."} />
            <Button
              type="submit"
              number={"="}
              className="font-bold pb-1 !text-3xl !h-8"
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default App;

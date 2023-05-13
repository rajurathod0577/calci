import React, { FunctionComponent, useState } from "react";
import styled from "styled-components";
import Display from "../Display/Display";
import Pad from "../Pad/Pad";
import { Digit, Operator } from "../../lib/types";

const StyledApp = styled.div`
  font-family: "Consolas", Arial, sans-serif;
  font-size: 16px;
  width: 100%;
  max-width: 320px;
  background: #4c4c4c;
  padding: 20px;
  border-radius: 10px;
`;

export const App: FunctionComponent = () => {
  // Calculator's states
  const [result, setResult] = useState<number>(0);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(true);
  const [pendingOperator, setPendingOperator] = useState<Operator>();
  const [display, setDisplay] = useState<string>("0");

  const calculate = (
    rightOperand: number,
    pendingOperator: Operator
  ): boolean => {
    let newResult = result;

    switch (pendingOperator) {
      case "+":
        newResult += rightOperand;
        break;
      case "-":
        newResult -= rightOperand;
        break;
      case "×":
        newResult *= rightOperand;
        break;
      case "÷":
        if (rightOperand === 0) {
          return false;
        }

        newResult /= rightOperand;
    }

    setResult(newResult);
    setDisplay(newResult.toString().toString().slice(0, 12));

    return true;
  };

  // Pad buttons handlers
  const onDigitButtonClick = (digit: Digit) => {
    let newDisplay = display;

    if ((display === "0" && digit === 0) || display.length > 12) {
      return;
    }

    if (waitingForOperand) {
      newDisplay = "";
      setWaitingForOperand(false);
    }

    if (display !== "0") {
      newDisplay = newDisplay + digit.toString();
    } else {
      newDisplay = digit.toString();
    }

    setDisplay(newDisplay);
  };

  const onPointButtonClick = () => {
    let newDisplay = display;

    if (waitingForOperand) {
      newDisplay = "0";
    }

    if (newDisplay.indexOf(".") === -1) {
      newDisplay = newDisplay + ".";
    }

    setDisplay(newDisplay);
    setWaitingForOperand(false);
  };

  const onOperatorButtonClick = (operator: Operator) => {
    const operand = Number(display);

    if (typeof pendingOperator !== "undefined" && !waitingForOperand) {
      if (!calculate(operand, pendingOperator)) {
        return;
      }
    } else {
      setResult(operand);
    }

    setPendingOperator(operator);
    setWaitingForOperand(true);
  };

  const onChangeSignButtonClick = () => {
    const value = Number(display);

    if (value > 0) {
      setDisplay("-" + display);
    } else if (value < 0) {
      setDisplay(display.slice(1));
    }
  };

  const onEqualButtonClick = () => {
    const operand = Number(display);

    if (typeof pendingOperator !== "undefined" && !waitingForOperand) {
      if (!calculate(operand, pendingOperator)) {
        return;
      }

      setPendingOperator(undefined);
    } else {
      setDisplay(operand.toString());
    }

    setResult(operand);
    setWaitingForOperand(true);
  };

  const onAllClearButtonClick = () => {
    setResult(0);
    setPendingOperator(undefined);
    setDisplay("0");
    setWaitingForOperand(true);
  };

  const onClearEntryButtonClick = () => {
    const operand = Number(display);
    const operandInString = operand.toString();

    if (operand > 0) {
      setDisplay(operandInString.slice(0, -1));
    } else if (operand <= 0) {
      setDisplay("0");
    }
  };

  return (
    <StyledApp>
      <Display
        value={display}
        expression={
          typeof pendingOperator !== "undefined"
            ? `${result}${pendingOperator}${waitingForOperand ? "" : display}`
            : ""
        }
      />
      <Pad
        onDigitButtonClick={onDigitButtonClick}
        onPointButtonClick={onPointButtonClick}
        onOperatorButtonClick={onOperatorButtonClick}
        onChangeSignButtonClick={onChangeSignButtonClick}
        onEqualButtonClick={onEqualButtonClick}
        onAllClearButtonClick={onAllClearButtonClick}
        onClearEntryButtonClick={onClearEntryButtonClick}
      />
    </StyledApp>
  );
};

export default App;

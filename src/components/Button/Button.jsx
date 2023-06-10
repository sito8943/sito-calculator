import { memo } from "react";
import PropTypes from "prop-types";

// styles
import styles from "./styles.module.css";

function Button({ onClick, number, className, type }) {
  return (
    <button
      type={type || "button"}
      onClick={onClick}
      className={`${styles.button} bg-primary hover:bg-primary-99 text-white ${className}`}
    >
      {number}
    </button>
  );
}

Button.propTypes = {
  type: PropTypes.string,
  number: PropTypes.any,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

const ButtonMemo = memo(
  (props) => <Button {...props} />,
  (oldProps, newProps) => {
    return (
      oldProps.type === newProps.type &&
      oldProps.number === newProps.number &&
      oldProps.onClick === newProps.onClick &&
      oldProps.className === newProps.className
    );
  }
);

ButtonMemo.displayName = "Button";

export default ButtonMemo;

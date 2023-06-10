import PropTypes from "prop-types";
import { memo } from "react";

function Auxiliary({ aux }) {
  console.log(aux);
  return (
    <div className="text-end text-primary-99 w-full">{`${
      aux.length === 2 ? aux[1] : ""
    } ${aux.length ? aux[0] : ""}`}</div>
  );
}

Auxiliary.propTypes = {
  aux: PropTypes.array,
};

const AuxiliaryMemo = memo(
  (props) => <Auxiliary {...props} />,
  (oldProps, newProps) => {
    console.log(oldProps.aux.at(-1), newProps.aux.at(-1));
    return oldProps.aux.at(-1) === newProps.aux.at(-1);
  }
);

AuxiliaryMemo.displayName = "Auxiliary";

export default AuxiliaryMemo;

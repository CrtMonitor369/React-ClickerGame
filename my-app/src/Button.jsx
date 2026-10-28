import "./Button.css"

function Button({ onClick, buttonImage }) {
  return (
    <img src={buttonImage} onClick={onClick} alt="Button" width = "10%"  height = "10%"/>
   
  );
}

export default Button;
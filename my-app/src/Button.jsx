import "./Button.css"
function Button({onPressed, points, content})
{
return(
    <button onClick={
                ()=>{onPressed()
                    document.querySelector("h1").classList.add("DownwardMotion");
                    setTimeout(()=>{document.querySelector("h1").classList.remove("DownwardMotion");}, 150)
                }}>{content}</button>
)
}


export default Button
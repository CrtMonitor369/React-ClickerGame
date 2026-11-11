import "./Button.css"
function Button({onPressed, points, content, shouldRender = true})
{
    if(!shouldRender){return}
return(
    <button onClick={
                ()=>{onPressed()
                    document.querySelector("h1").classList.add("DownwardMotion");
                    setTimeout(()=>{document.querySelector("h1").classList.remove("DownwardMotion");}, 150)
                }}>{content}</button>
)
}


export default Button
import "./Button.css"
import * as Tone from "tone";
function Button({onPressed, points, content, shouldRender = true, note="C3", duration="8n"})
{
    if(!shouldRender){return}
return(
    <button onClick={
                ()=>{onPressed()
                     const synth = new Tone.Synth().toDestination();
                    synth.triggerAttackRelease(note, duration);
                    document.querySelector("h1").classList.add("DownwardMotion");
                    setTimeout(()=>{document.querySelector("h1").classList.remove("DownwardMotion");}, 150)
                }}>{content}</button>
)
}


export default Button
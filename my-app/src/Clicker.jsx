import "./Clicker.css"


function Clicker({onPressed, points})
{
    
    
    return (
        <div className="Clicker-Area">
            
            <button onClick={
                ()=>{onPressed()
                    document.querySelector("h1").classList.add("DownwardMotion");
                    setTimeout(()=>{document.querySelector("h1").classList.remove("DownwardMotion");}, 150)
                }}>Click Me!</button>

            <h1>{points}</h1>
        </div>
    )

}

export default Clicker
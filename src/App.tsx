/**
 * App - Componente raíz del prototipo HTML-in-Canvas + Vinilo 3D
 * Este es el punto de entrada, accesible en "/"
 */

import { useState } from "react";
import { Index } from "./pages";
import { HtmlAnimated } from "./pages/html-animated";

function App() {

  // const [ switch, setSwitch ] = useState(false);
  const [switchMode, setSwitchMode] = useState(true);

  return (
    <>
      <div className="w-full h-full">
        <button onClick={()=>setSwitchMode(prev => !prev)}>mostrar otra animacion</button>
        { switchMode 
        ? <HtmlAnimated />
        : <Index /> }
      </div>
    </>
  );
}



export default App;
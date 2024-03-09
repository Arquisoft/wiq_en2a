import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./Router";

/** The old code is not in /pages/init/index.tsx and is shown as default */
function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;

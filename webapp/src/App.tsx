import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./Router";
import { createContext, useContext, useState } from "react"
import { User, UserContexType } from "./common/types";

export const UserContext = createContext<UserContexType>({} as UserContexType);
export const UserData = () => useContext(UserContext);

/** The old code is not in /pages/init/index.tsx and is shown as default */
function App() {
  let myUser: User = {
    name: "Usuario", points: "0", isAuthenticated: false
  }
  const [user, setUser] = useState<User>(myUser);

  //const userProviderValue: UserContexType = useMemo(()=>({AuthUser : user, setAuthUser: setUser}), [user, setUser])
  
  return (
    <UserContext.Provider value={{AuthUser : user, setAuthUser: setUser}}>
      <BrowserRouter>
        <AppRouter />      
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;

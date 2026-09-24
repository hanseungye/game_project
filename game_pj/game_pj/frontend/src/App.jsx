import Account from "./Account_Human/human_acoount";
import {Routes,Route} from 'react-router-dom';
import Login from "./LoginPage/Login";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/account" element = {<Account/>}/>
    </Routes>
  );
}

export default App;

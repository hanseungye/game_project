import Account from "./Account_Human/human_acoount";
import { Routes, Route } from 'react-router-dom';
import Login from "./LoginPage/Login";
import Password_Check from "./LoginPage/password_page";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/account" element={<Account />} />
      
      {/*비밀번호 찾기*/}
      <Route
        path="/forget-password"
        element={<Password_Check/>}
      />
      {/*이메일 찾기*/}
    </Routes>
  );
}

export default App;

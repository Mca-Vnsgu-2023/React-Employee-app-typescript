import { Routes, Route } from 'react-router-dom';
import Employee from './Components/Employee/employee';
import Home from './Components/Home/home';

const Main = () => {
return (         
    <Routes>
    <Route path='/' element={<Home/>} />
    <Route path='/employee' element={<Employee/>} />
  </Routes>
);
}
export default Main;
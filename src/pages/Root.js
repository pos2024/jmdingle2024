import { Outlet } from "react-router-dom";
import MainNavigation from "./MainNavigation"
import Header from "../components/Header";






const Root = () => {
    
    
     return (
       <div className="flex flex-col ">
<Header/>
  <div className="flex bg-gray-100 w-full">
  <MainNavigation/>
         <Outlet/> 

  </div>

        
         </div>  
         
            
)
}
export default Root;
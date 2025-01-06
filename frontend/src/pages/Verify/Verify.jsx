import React, { useContext, useEffect } from 'react'
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'

const Verify = () => {
  
    // we can get the success from the url by using useSearchParams hook
    const [searchParams,setSearchParams] = useSearchParams()
    const success = searchParams.get("success"); 
    const orderId = searchParams.get("orderId"); 
    const navigate = useNavigate();
    
    const {url} = useContext(StoreContext); //getting the backend url
    
    const verifyPayment = async()=>{
        const response = await axios.post(url+"/api/order/verify",{success,orderId});
        if(response.data.success){
            /* if the payment is success then we will navigate to my orders page*/
            navigate("/myorders");
        }
        else{
            // if payment is failure we navigate user to home page
            navigate("/")
        }
    }

    useEffect(()=>{
        verifyPayment()
    },[])

  return (
    <div className='verify'>
        <div className="spinner">

        </div>
    </div>
  )
}

export default Verify
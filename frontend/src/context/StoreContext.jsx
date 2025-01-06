import axios from "axios";
import { createContext, useEffect, useState } from "react";


export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

  const [cartItems, setCartItems] = useState({});
  const url = "https://food-del-copy-backend.onrender.com"
  const [token,setToken] = useState(""); // to store token when logged in
  const [food_list,setFoodList] = useState([])

  const addToCart = async(itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 })); //User adds 1st time to the cart
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 })); //if already the item is present in the cart
    }
    // if we have token hen we update the cart itmes to the db
    await axios.post(url+'/api/cart/add',{itemId},{headers:{token}})
  };

  const removeFromCart = async(itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if(token){
      await axios.post(url+'/api/cart/remove',{itemId},{headers:{token}})
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  // fetching foodlist from db

  const fetchFoodList = async ()=>{
    const response = await axios.get(url+'/api/food/list');
    setFoodList(response.data.data)
  }

  const loadCartData =async(token)=>{
    const response = await axios.post(url+'/api/cart/get',{},{headers:{token}});
    setCartItems(response.data.cartData);
  }

  /* if we refresh the page it should not logout so for that we are storing the token
     from localstorage to token state variable */

  useEffect(()=>{   
    async function loadData() {
      await fetchFoodList();
      if(localStorage.getItem("token")){
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"))
      }
    }
    loadData();
  },[])

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;

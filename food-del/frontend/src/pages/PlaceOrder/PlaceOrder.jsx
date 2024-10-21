import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./PlaceOrder.css";
import { deliveryFee } from "../Cart/Cart";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PlaceOrder = () => {
  
  const navigate = useNavigate();

  const { getTotalCartAmount,token,food_list,cartItems,url } = useContext(StoreContext);

  const [data,setData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"",
    state:"",
    zipcode:"",
    country:"",
    phone:""
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data=>({...data,[name]:value}))
  }
  
  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item)=>{
      if (cartItems[item._id]>0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo)
      }
    })
    let orderData = {
      address:data,
      items: orderItems,
      amount:getTotalCartAmount()+2,
    }
    let response = await axios.post(url+"/api/order/place",orderData,{headers:{token}});
    if (response.data.success) {
      const {session_url} = response.data;
      window.location.replace(session_url);
    }
    else{
      alert("Error");
    }
  }
 
    useEffect(()=>{
      if (!token) {
        navigate('/cart')
      }
      else if(getTotalCartAmount()===0)
      {
        navigate('/cart')
      }
    },token)
  return (
    <>
      <button className="GoBack" onClick={() => navigate("/cart")}>
        ⬅️ Go Back to Cart Page
      </button>

      <form onSubmit={placeOrder} className="place-order">
        <div className="place-order-left">
          <h2 className="title">Delivery Information</h2>
          <div className="multi-fields">
            <input required name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder="First Name" />
            <input required name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder="Last Name" />
          </div>
          <input required name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Email Address" />
          <input required name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder="Street" />
          <div className="multi-fields">
            <input required name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder="City" />
            <input required name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder="State" />
          </div>
          <div className="multi-fields">
            <input required name="zipcode" pattern='[0-9]{6}' onChange={onChangeHandler} value={data.zipcode} type="number" placeholder="Pin Code" maxLength={6} minLength={6} />
            <input required name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder="Country" />
          </div>
          <input required name="phone" pattern='[0-9]{10}' onChange={onChangeHandler} value={data.phone} type="number" placeholder="Phone" maxLength={10} minLength={10} />
        </div>

        <div className="place-order-right">
          <div className="cart-total">
            <h2 className="title">Cart Total</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>${getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Free</p>
                <p>${getTotalCartAmount() === 0 ? 0 : deliveryFee}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <b>
                  $
                  {getTotalCartAmount() === 0
                    ? 0
                    : getTotalCartAmount() + deliveryFee}
                </b>
              </div>
            </div>
            <button type="submit" disabled={getTotalCartAmount() === 0}>
              PROCEED TO Payment
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default PlaceOrder;

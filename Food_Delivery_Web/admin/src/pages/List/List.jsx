import React, { useState, useEffect } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editItem, setEditItem] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null,
  });

  // Fetch list of food items
  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error('Error fetching list');
    }
  };

  // Remove food item
  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  };

  // Open edit form with selected food details
  const openEditForm = (item) => {
    setEditMode(true);
    setEditItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: null,
    });
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Update food details
  const updateFood = async () => {
    const formDataObj = new FormData();
    formDataObj.append('name', formData.name);
    formDataObj.append('description', formData.description);
    formDataObj.append('price', formData.price);
    formDataObj.append('category', formData.category);
    if (formData.image) {
      formDataObj.append('image', formData.image);
    }

    try {
      const response = await axios.put(`${url}/api/food/update/${editItem._id}`, formDataObj);
      if (response.data.success) {
        toast.success('Food updated successfully');
        fetchList();
        setEditMode(false);
      } else {
        toast.error('Failed to update food');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error updating food');
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className='list-table'>
        <div className='list-table-format title'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>

        {list.map((item, index) => (
          <div key={index} className='list-table-format'>
            <img src={`${url}/images/${item.image}`} alt='' />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>₹{item.price}</p>
            <div className='edit_remove'>
            <button onClick={() => openEditForm(item)} className='custom-button'>
              Edit
            </button>
            <button onClick={() => removeFood(item._id)} className='custom-button-remove'>
              Remove
            </button>
            </div>
          </div>
        ))}
      </div>

      {editMode && (
  <div className="edit-overlay"> {/* Overlay background */}
    <div className="edit-modal"> {/* Modal content */}
      <h3>Edit Food</h3>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        type="text"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price"
      />
      <input
        type="text"
        name="category"
        value={formData.category}
        onChange={handleChange}
        placeholder="Category"
      />
      <input type="file" name="image" onChange={handleFileChange} />
      <div className='save_cancel'>
      <button onClick={updateFood} className="custom-button">
        Save
      </button>
      <button onClick={() => setEditMode(false)} className="custom-button">
        Cancel
      </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default List;


// Original code -> 


// import React from 'react'
// import './List.css'
// import { useState } from 'react'
// import axios from 'axios'
// import { toast } from 'react-toastify'
// import { useEffect } from 'react'

// const List = ({url}) => {

//      const [list , setList] = useState([]);

//      const fetchList = async () => {
//           const response = await axios.get(`${url}/api/food/list`);
//           if(response.data.success){
//                setList(response.data.data);
//           }else{
//                toast.error("Error")
//           }
//      }

//      const removeFood = async(foodId)=>{
//           const response = await axios.post(`${url}/api/food/remove`, {id:foodId})
//           await fetchList();
//           if(response.data.success){
//                toast.success(response.data.message);
//           }else{
//                toast.error(response.data.message);
//           }
//      }

//      useEffect(()=>{
//          fetchList(); 
//      },[])

//   return (
//     <div className='list add flex-col'>
//      <p>All Foods List</p>
//      <div className="list-table">
//           <div className="list-table-format title">
//                <b>Image</b>
//                <b>Name</b>
//                <b>Category</b>
//                <b>Price</b>
//                <b>Action</b>
//           </div>
//           {list.map((item, index)=>{
//                return (
//                     <div key={index} className='list-table-format'>
//                          <img src={`${url}/images/`+item.image} alt="" />
//                          <p>{item.name}</p>
//                          <p>{item.category}</p>
//                          <p>₹{item.price}</p>
//                          {/* <p onClick={()=>removeFood(item._id)} className='cursor' >x</p> */}
//                          <button onClick={()=>removeFood(item._id)} class="custom-button">Remove</button>
//                     </div>
//                )
//           })}
//      </div>
//     </div>
//   )
// }

// export default List
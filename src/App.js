import { useEffect, useState } from "react";

const API_URL = "http://localhost:4000/api/items";

export default function App() {
  const [items, setItems] = useState([]);
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Fetch items from Redis via the backend
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then(setItems)
      .catch(console.error);
  }, []);

  // Save items to Redis via the backend
  const saveItemsToServer = (updatedItems) => {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedItems),
    }).catch(console.error);
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!description) return;
    const newItem = { id: Date.now(), description, quantity, packed: false };
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    saveItemsToServer(updatedItems);
    setDescription("");
    setQuantity(1);
  };

  const handleDeleteItem = (id) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    saveItemsToServer(updatedItems);
  };

  const handleToggleItem = (id) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, packed: !item.packed } : item
    );
    setItems(updatedItems);
    saveItemsToServer(updatedItems);
  };

  const handleClearList = () => {
    if (window.confirm("Are you sure you want to clear the list?")) {
      setItems([]);
      saveItemsToServer([]);
    }
  };

  return (
    <div>
      <h1>Packing List App</h1>

      {/* Form to Add Items */}
      <form onSubmit={handleAddItem}>
        <input
          type="text"
          placeholder="Item description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        >
          {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
            <option value={num} key={num}>
              {num}
            </option>
          ))}
        </select>
        <button type="submit">Add Item</button>
      </form>

      {/* Packing List */}
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <input
              type="checkbox"
              checked={item.packed}
              onChange={() => handleToggleItem(item.id)}
            />
            {item.quantity} {item.description}
            <button onClick={() => handleDeleteItem(item.id)}>❌</button>
          </li>
        ))}
      </ul>

      {/* Clear List Button */}
      <button onClick={handleClearList}>Clear List</button>
    </div>
  );
}

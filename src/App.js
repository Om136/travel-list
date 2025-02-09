import { useEffect, useState } from "react";

const API_URL = "http://localhost:4000/api/items";

export default function App() {
  const [items, setItems] = useState([]);
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then(setItems)
      .catch(console.error);
  }, []);

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
    <div className="app">
      <header className="header">
        <h1>Packing List</h1>
      </header>

      <form className="add-form" onSubmit={handleAddItem}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Add new item..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-text"
          />
          <select
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="select-quantity"
          >
            {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
              <option value={num} key={num}>
                {num}
              </option>
            ))}
          </select>
          <button type="submit" className="btn btn-add">
            Add to list
          </button>
        </div>
      </form>

      <main className="list-container">
        <ul className="items-list">
          {items.map((item) => (
            <li
              key={item.id}
              className={`list-item ${item.packed ? "packed" : ""}`}
            >
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={item.packed}
                  onChange={() => handleToggleItem(item.id)}
                />
                <span className="checkbox-custom"></span>
              </label>
              <span className="item-text">
                {item.quantity} × {item.description}
              </span>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="btn-delete"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </main>

      <footer className="footer">
        <button onClick={handleClearList} className="btn btn-clear">
          Clear list
        </button>
      </footer>
    </div>
  );
}

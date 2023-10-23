import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowFriend() {
    setShowAddFriend((value) => !value);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => (friends = [...friends, friend]));
    setShowAddFriend(false);
  }

  function handleSelected(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        selectedFriend.id === friend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onHandleSelect={handleSelected}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && <FormAddFreiend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowFriend}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendList({ friends, onHandleSelect, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onHandleSelect={onHandleSelect}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onHandleSelect, selectedFriend }) {
  return (
    <li className={selectedFriend?.id === friend.id ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={() => onHandleSelect(friend)}>
        {selectedFriend?.id === friend.id ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFreiend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={(e) => handleSubmit(e)}>
      <label>🧑‍🤝‍🧑Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🖼️ Image URL </label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [userExpense, setUserExpense] = useState("");
  const friendExpense = bill ? bill - userExpense : "";
  const [paidBy, setPaidBy] = useState("you");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !userExpense) return;
    onSplitBill(paidBy === "you" ? -friendExpense : userExpense);
  }

  return (
    <form className="form-split-bill" onSubmit={(e) => handleSubmit(e)}>
      <h2>SPLIT A BILL WITH {selectedFriend.name}</h2>
      <label>💰 Bill Value </label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🧍‍♂️Your Expense </label>
      <input
        type="text"
        value={userExpense}
        onChange={(e) =>
          setUserExpense(
            Number(e.target.value) > bill ? userExpense : Number(e.target.value)
          )
        }
      />

      <label>🧑‍🤝‍🧑 {selectedFriend.name}'s expense</label>
      <input type="text" disabled value={friendExpense} />

      <label>🤑 Who is paying the bill? </label>
      <select
        name=""
        id=""
        value={paidBy}
        onChange={(e) => setPaidBy(e.target.value)}
      >
        <option value="you">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}

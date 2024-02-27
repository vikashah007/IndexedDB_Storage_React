import { useEffect, useState } from "react";


const idb = window.indexedDB;
const createCollectionsInIndexDB = () => {
  if (!idb) {
    console.log("this Browser Doesnot Support indexDb");
    return;
  }
  console.log(idb);
  const request = idb.open("test-db", 2);
  request.onerror = (event) => {
    console.log("Error : ", event);
    console.log("An Error occured at IndexedDB");
  };
  request.onupgradeneeded = (event) => {
    const db = request.result;
    if (!db.objectStoreNames.contains("userData")) {
      db.createObjectStore("userData", {
        keyPath: "id",
      });
    }
  };
};

const App = () => {
  const [allUsersData, setAllUsersData] = useState([]);
  const [all, setAll] = useState([]);
  const [firstName, setFirstname] = useState("");
  const [lastName, setlastname] = useState("");
  const [email, setEmail] = useState("");
  const getAllData = () => {
    const dbPromise = idb.open("test-db", 2);
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
      const tx = db.transaction("userData", "readonly");
      const userData = tx.objectStore("userData");
      const users = userData.getAll();
      users.onsuccess = (query) => {
        setAllUsersData(query.srcElement.result);
      };
      users.onerror = (query) => {
        alert("error occured while loading the data : ", query);
      };
      tx.oncomplete = function () {
        db.close();
      };
    };
  };
  const handleSubmit = () => {
    const dbPromise = idb.open("test-db", 2);
    if (firstName && lastName && email) {
      dbPromise.onsuccess = () => {
        const db = dbPromise.result;
        const tx = db.transaction("userData", "readwrite");
        const userData = tx.objectStore("userData");

        const user = userData.put({
          id: allUsersData.length + 1,
          firstName,
          lastName,
          email,
        });
        user.onsuccess = () => {
          tx.oncomplete = () => {
            db.close();
          };
          getAllData();
          alert("User Added");
        };
        user.onerror = (event) => {
          console.log(event);
          alert("Error Occured");
        };
      };
    }
  };
  
  console.log(allUsersData);
  useEffect(() => {
    createCollectionsInIndexDB();
    getAllData();
   
  }, []);
  
  console.log(allUsersData);
  
  return (
    <div className="row" style={{ padding: "100px" }}>
      <div className="col-md-6">
        <div className="card" style={{ padding: "20px" }}>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              className="form-control"
              name="firstName"
              onChange={(e) => setFirstname(e.target.value)}
              value={firstName}
            ></input>
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              className="form-control"
              name="lastName"
              onChange={(e) => setlastname(e.target.value)}
              value={lastName}
            ></input>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            ></input>
          </div>
          <div className="form-group">
            <button className="btn btn-primary mt-2" onClick={handleSubmit}>
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

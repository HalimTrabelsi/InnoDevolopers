import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css"; // Make sure Bootstrap is installed

const DeleteUsers = () => {
  const [users, setUsers] = useState([]);
  const [hoveredUserId, setHoveredUserId] = useState(null); // State to track the hovered user

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error loading users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action is irreversible!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:5001/api/users/delete/${userId}`)
          .then(() => {
            setUsers(users.filter((user) => user._id !== userId));
            Swal.fire("Deleted!", "The user has been deleted.", "success");
          })
          .catch((error) =>
            Swal.fire("Error", "Unable to delete.", "error")
          );
      }
    });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">List of Users to Delete</h2>
      <div className="row">
        {users.length > 0 ? (
          users.map((user) => (
            <div className="col-md-4 mb-3" key={user._id}>
              <div
                className="card shadow border-primary"
                style={{
                  backgroundColor: hoveredUserId === user._id ? 'rgba(0, 123, 255, 0.2)' : 'white',
                  transition: 'background-color 0.3s ease', // Smooth transition
                }}
                onMouseEnter={() => setHoveredUserId(user._id)} // Set hovered user ID on mouse enter
                onMouseLeave={() => setHoveredUserId(null)} // Clear hovered user ID on mouse leave
              >
                <div className="card-body text-center">
                  <h5 className="card-title">{user.name}</h5>
                  <p className="card-text">
                    <strong>Email:</strong> {user.email} <br />
                    <strong>Role:</strong> {user.role}
                  </p>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p className="alert alert-info">No users found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteUsers;

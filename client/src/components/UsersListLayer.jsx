import { Icon } from '@iconify/react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UsersListLayer = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortOrder, setSortOrder] = useState('A-Z');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [editUserId, setEditUserId] = useState(null);
    const [editedUserData, setEditedUserData] = useState({});
    const token = localStorage.getItem('token');

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            if (!token) {
                setError('Not authenticated. Please log in.');
                setLoading(false);
                return;
            }

            const response = await axios.get('http://localhost:5001/api/users/view-users', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                const sortedUsers = response.data.sort((a, b) => {
                    if (a.isVerified && !b.isVerified) return -1;
                    if (!a.isVerified && b.isVerified) return 1;
                    return 0;
                });
                setUsers(sortedUsers);
                setFilteredUsers(sortedUsers);
            } else {
                setError('Unexpected response from server.');
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('An error occurred while fetching users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        let filtered = [...users];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((user) => user.name.toLowerCase().includes(query));
        }

        if (statusFilter !== 'All') {
            const isVerified = statusFilter === 'Active';
            filtered = filtered.filter((user) => user.isVerified === isVerified);
        }

        if (sortOrder === 'A-Z') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else {
            filtered.sort((a, b) => b.name.localeCompare(a.name));
        }

        setFilteredUsers(filtered);
    }, [searchQuery, statusFilter, sortOrder, users]);

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleEditClick = (user) => {
        setEditUserId(user._id);
        setEditedUserData({
            name: user.name,
            email: user.email,
            role: user.role,
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUserData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveClick = async (userId) => {
        try {
            const response = await axios.put(
                `http://localhost:5001/api/list/edit-user/${userId}`,
                editedUserData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.status === 200) {
                fetchUsers();
                alert('User updated successfully');
                setEditUserId(null);
                setEditedUserData({});
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user');
        }
    };

    const handleDeleteClick = async (userId) => {
        try {
            const response = await axios.delete(
                `http://localhost:5001/api/list/delete-user/${userId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (response.status === 200) {
                fetchUsers();
                alert('User deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                <div className="d-flex align-items-center flex-wrap gap-3">
                    <form className="navbar-search">
                        <input
                            type="text"
                            className="bg-base h-40-px w-auto"
                            name="search"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Icon icon="ion:search-outline" className="icon" />
                    </form>
                    <select
                        className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                    <select
                        className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="A-Z">A-Z</option>
                        <option value="Z-A">Z-A</option>
                    </select>
                </div>
            </div>
            <div className="card-body p-24">
                <div className="table-responsive">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th className="text-center">Status</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.length > 0 ? (
                                currentUsers.map((user) => (
                                    <tr key={user._id} className={!user.isVerified ? 'bg-neutral-200' : ''}>
                                        <td>
                                            <input type="checkbox" className="form-check-input" />
                                        </td>
                                        <td>
                                            {editUserId === user._id ? (
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={editedUserData.name}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                user.name
                                            )}
                                        </td>
                                        <td>
                                            {editUserId === user._id ? (
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={editedUserData.email}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                user.email
                                            )}
                                        </td>
                                    
                                        <td>
                                            {editUserId === user._id ? (
                                                <select
                                                    name="role"
                                                    value={editedUserData.role}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="admin">admin</option>
                                                    <option value="user">user</option>
                                                </select>
                                            ) : (
                                                user.role
                                            )}
                                        </td>
                                        <td className="text-center">
                                            <span
                                                className={`px-24 py-4 radius-4 fw-medium text-sm ${
                                                    user.isVerified
                                                        ? 'bg-success-focus text-success-600 border border-success-main'
                                                        : 'bg-neutral-300 text-neutral-600 border border-neutral-400'
                                                }`}
                                            >
                                                {user.isVerified ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <div className="d-flex align-items-center gap-10 justify-content-center">
                                                {editUserId === user._id ? (
                                                    <button
                                                        className="btn btn-success btn-sm"
                                                        onClick={() => handleSaveClick(user._id)}
                                                    >
                                                        Save
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="bg-info-focus text-info-600 rounded-circle w-40-px h-40-px"
                                                        onClick={() => handleEditClick(user)}
                                                    >
                                                        <Icon icon="lucide:edit" />
                                                    </button>
                                                )}
                                                <button
                                                    className="bg-danger-focus text-danger-600 rounded-circle w-40-px h-40-px"
                                                    onClick={() => handleDeleteClick(user._id)}
                                                >
                                                    <Icon icon="fluent:delete-24-regular" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24">
                    <span>
                        Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of{' '}
                        {filteredUsers.length} users
                    </span>
                    <nav>
                        <ul className="pagination">
                            {[...Array(Math.ceil(filteredUsers.length / usersPerPage))].map((_, index) => (
                                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => paginate(index + 1)}>
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default UsersListLayer;

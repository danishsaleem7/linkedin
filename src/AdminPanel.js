// src/components/AdminPanel.js
import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) console.error(error);
    else setUsers(data);
  };

  const handleDeleteUser = async (userId) => {
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) console.error(error);
    else fetchUsers();
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <button onClick={fetchUsers}>Reload Articles</button>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.email} 
            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;

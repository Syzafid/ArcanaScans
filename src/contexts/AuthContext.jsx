// import { createContext, useContext, useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
// import Cookies from 'js-cookie';

// const AuthContext = createContext();

// // Dummy data untuk login
// const DUMMY_USERS = [
//   {
//     id: 1,
//     email: 'admin@example.com',
//     password: '123456',
//     role: 'admin',
//     name: 'Admin User'
//   },
//   {
//     id: 2,
//     email: 'user@example.com',
//     password: '123456',
//     role: 'user',
//     name: 'Regular User'
//   }
// ];

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   // Load user from cookies or localStorage
//   useEffect(() => {
//     const savedUser = Cookies.get('authUser') || localStorage.getItem('authUser');
//     if (savedUser) {
//       try {
//         setUser(JSON.parse(savedUser));
//       } catch (error) {
//         console.error('Error parsing saved user:', error);
//         Cookies.remove('authUser');
//         localStorage.removeItem('authUser');
//       }
//     }
//     setLoading(false);
//   }, []);

//   // Save user to both cookie & localStorage
//   useEffect(() => {
//     if (user) {
//       const data = JSON.stringify(user);
//       Cookies.set('authUser', data, { expires: 1 }); // 1 hari
//       Cookies.set('role', user.role, { expires: 1 });
//       localStorage.setItem('authUser', data);
//     } else {
//       Cookies.remove('authUser');
//       Cookies.remove('role');
//       localStorage.removeItem('authUser');
//     }
//   }, [user]);

//   const login = (email, password) => {
//     const foundUser = DUMMY_USERS.find(
//       u => u.email === email && u.password === password
//     );

//     if (foundUser) {
//       const userWithoutPassword = { ...foundUser };
//       delete userWithoutPassword.password;
//       setUser(userWithoutPassword);

//       // Redirect berdasarkan role
//       router.push(foundUser.role === 'admin' ? '/admin' : '/library');

//       return { success: true };
//     }

//     return { success: false, error: 'Invalid email or password' };
//   };

//   const signup = (email, password, name) => {
//     const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');

//     const alreadyExists = existingUsers.some(u => u.email === email);
//     if (alreadyExists) {
//       return { success: false, error: 'Email already exists' };
//     }

//     const newUser = {
//       id: Date.now(),
//       email,
//       password,
//       name,
//       role: 'user'
//     };

//     const updatedUsers = [...existingUsers, newUser];
//     localStorage.setItem('users', JSON.stringify(updatedUsers));
//     DUMMY_USERS.push(newUser);

//     const userWithoutPassword = { ...newUser };
//     delete userWithoutPassword.password;
//     setUser(userWithoutPassword);

//     router.push('/library');
//     return { success: true };
//   };

//   const createAdmin = (email, password, name) => {
//     if (!user || user.role !== 'admin') {
//       return { success: false, error: 'Unauthorized' };
//     }

//     const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
//     const alreadyExists = existingUsers.some(u => u.email === email);
//     if (alreadyExists) {
//       return { success: false, error: 'Email already exists' };
//     }

//     const newAdmin = {
//       id: Date.now(),
//       email,
//       name,
//       role: 'admin',
//       password
//     };

//     const updatedUsers = [...existingUsers, newAdmin];
//     localStorage.setItem('users', JSON.stringify(updatedUsers));
//     DUMMY_USERS.push(newAdmin);

//     return { success: true };
//   };

//   const logout = () => {
//     setUser(null);
//     router.push('/login');
//   };

//   const value = {
//     user,
//     loading,
//     login,
//     signup,
//     createAdmin,
//     logout,
//     isAuthenticated: !!user,
//     isAdmin: user?.role === 'admin',
//     isUser: user?.role === 'user'
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

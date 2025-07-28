import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Import motion and AnimatePresence

// Page transition variants for framer-motion
const pageVariants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, x: 50, transition: { duration: 0.3, ease: 'easeIn' } },
};

// Main App component for routing and authentication state management
export default function App() {
  // State to manage the current page ('login', 'register', 'dashboard', 'blog-list', 'create-post', 'post-detail', 'profile', 'admin-dashboard')
  const [currentPage, setCurrentPage] = useState('login');
  // State to store the currently logged-in user's data (e.g., { id: 'user1', username: 'Alice', role: 'user' })
  const [currentUser, setCurrentUser] = useState(null);
  // State to simulate registered users (in a real app, this would be a database)
  const [registeredUsers, setRegisteredUsers] = useState([
    { id: 'user-1', username: 'Alice', email: 'alice@example.com', password: 'password123', role: 'user', createdPostIds: ['post-1', 'post-3'], likedPostIds: ['post-2'], madeCommentIds: ['c2'] },
    { id: 'user-2', username: 'Bob', email: 'bob@example.com', password: 'password123', role: 'admin', createdPostIds: ['post-2'], likedPostIds: ['post-1'], madeCommentIds: ['c1'] }, // Admin user
  ]);
  // State to simulate blog posts
  const [blogPosts, setBlogPosts] = useState([
    {
      id: 'post-1',
      title: 'Getting Started with React Hooks',
      author: 'Alice',
      date: '2025-07-20',
      content: 'This is the full content of the first blog post about React Hooks. Hooks allow you to use state and and other React features without writing a class. They were introduced in React 16.8. Common hooks include useState, useEffect, useContext, useRef, etc.',
      contentSnippet: 'Learn the basics of React Hooks and how they simplify state management in functional components...',
      imageUrl: 'https://placehold.co/600x400/000000/FFFFFF?text=React+Hooks',
      likes: 15,
      comments: [{ id: 'c1', author: 'Bob', text: 'Great post!', userId: 'user-2' }],
      category: 'Web Development',
      userId: 'user-1'
    },
    {
      id: 'post-2',
      title: 'Mastering Tailwind CSS for Responsive Design',
      author: 'Bob',
      date: '2025-07-22',
      content: 'Dive deep into Tailwind CSS and discover how to build highly responsive and customizable user interfaces with utility-first approach. This post covers breakpoints, custom configurations, and best practices.',
      contentSnippet: 'A comprehensive guide to building responsive UIs efficiently with Tailwind CSS...',
      imageUrl: 'https://placehold.co/600x400/3B82F6/FFFFFF?text=Tailwind+CSS',
      likes: 22,
      comments: [{ id: 'c2', author: 'Alice', text: 'Very helpful!', userId: 'user-1' }],
      category: 'CSS',
      userId: 'user-2'
    },
    {
      id: 'post-3',
      title: 'The Power of Node.js and Express.js',
      author: 'Alice',
      date: '2025-07-25',
      content: 'Explore how Node.js and Express.js form a powerful combination for building scalable and efficient backend APIs. We will cover routing, middleware, and connecting to databases.',
      contentSnippet: 'Building robust backend APIs with Node.js and Express.js...',
      imageUrl: 'https://placehold.co/600x400/4CAF50/FFFFFF?text=Node+Express',
      likes: 8,
      comments: [],
      category: 'Backend',
      userId: 'user-1'
    }
  ]);
  const [categories, setCategories] = useState(['Web Development', 'CSS', 'Backend', 'Technology', 'Lifestyle']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Function to handle page navigation
  const navigateTo = (page, postId = null) => {
    setCurrentPage(page);
    // If navigating to post-detail, store the ID
    if (page === 'post-detail' && postId) {
      setPostDetailId(postId);
    } else {
      setPostDetailId(null);
    }
  };

  const [postDetailId, setPostDetailId] = useState(null); // State to hold the ID of the post to display

  // Function to handle user login
  const handleLogin = (username, password) => {
    const user = registeredUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      setCurrentUser(user); // Set the logged-in user
      navigateTo('dashboard'); // Redirect to dashboard
      // In a real app, a JWT would be received and stored here (e.g., in localStorage)
      return true;
    } else {
      console.log('Login failed: Invalid credentials');
      return false;
    }
  };

  // Function to handle user registration
  const handleRegister = (username, email, password) => {
    const usernameExists = registeredUsers.some((u) => u.username.toLowerCase() === username.toLowerCase());
    const emailExists = registeredUsers.some((u) => u.email.toLowerCase() === email.toLowerCase());

    if (usernameExists) {
      return 'username_taken'; // Specific error for username
    }
    if (emailExists) {
      return 'email_taken'; // Specific error for email
    }

    const newUser = {
      id: `user-${registeredUsers.length + 1}`,
      username,
      email,
      password,
      role: 'user', // Default role for new registrations
      createdPostIds: [], // Initialize new activity arrays
      likedPostIds: [],
      madeCommentIds: []
    };
    setRegisteredUsers([...registeredUsers, newUser]);
    navigateTo('login');
    return 'success'; // Registration successful
  };

  // Function to handle user logout
  const handleLogout = () => {
    setCurrentUser(null);
    navigateTo('login');
    // In a real app, the stored JWT would be removed here
  };

  // Blog Post Actions (Simulated)
  const handleCreatePost = (newPost) => {
    const postId = `post-${blogPosts.length + 1}`;
    const postWithId = { ...newPost, id: postId, author: currentUser.username, userId: currentUser.id, date: new Date().toISOString().slice(0, 10), likes: 0, comments: [] };
    setBlogPosts([...blogPosts, postWithId]);

    // Update currentUser's created posts
    setRegisteredUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === currentUser.id
          ? { ...user, createdPostIds: [...user.createdPostIds, postId] }
          : user
      )
    );
    setCurrentUser(prevUser => ({ ...prevUser, createdPostIds: [...prevUser.createdPostIds, postId] }));

    navigateTo('blog-list'); // Go back to blog list after creating
  };

  const handleUpdatePost = (updatedPost) => {
    setBlogPosts(blogPosts.map(post => post.id === updatedPost.id ? updatedPost : post));
    navigateTo('post-detail', updatedPost.id); // Go back to post detail after editing
  };

  const handleDeletePost = (postId) => {
    setBlogPosts(blogPosts.filter(post => post.id !== postId));

    // Remove post from author's createdPostIds
    setRegisteredUsers(prevUsers =>
      prevUsers.map(user =>
        user.createdPostIds.includes(postId)
          ? { ...user, createdPostIds: user.createdPostIds.filter(id => id !== postId) }
          : user
      )
    );
    // Also remove from any user's likedPostIds
    setRegisteredUsers(prevUsers =>
      prevUsers.map(user =>
        user.likedPostIds.includes(postId)
          ? { ...user, likedPostIds: user.likedPostIds.filter(id => id !== postId) }
          : user
      )
    );
    // In a real app, comments associated with this post would also be deleted from users' madeCommentIds

    navigateTo('blog-list'); // Go back to blog list after deleting
  };

  const handleLikePost = (postId) => {
    const isLiked = currentUser.likedPostIds.includes(postId);

    setBlogPosts(blogPosts.map(post =>
      post.id === postId
        ? { ...post, likes: isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));

    // Update currentUser's liked posts
    setRegisteredUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === currentUser.id
          ? {
              ...user,
              likedPostIds: isLiked
                ? user.likedPostIds.filter(id => id !== postId)
                : [...user.likedPostIds, postId]
            }
          : user
      )
    );
    setCurrentUser(prevUser => ({
      ...prevUser,
      likedPostIds: isLiked
        ? prevUser.likedPostIds.filter(id => id !== postId)
        : [...prevUser.likedPostIds, postId]
    }));
  };

  const handleAddComment = (postId, commentText) => {
    const newCommentId = `comment-${Date.now()}`;
    const newComment = { id: newCommentId, author: currentUser.username, text: commentText, userId: currentUser.id, postId: postId }; // Added userId and postId to comment
    setBlogPosts(blogPosts.map(post =>
      post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post
    ));

    // Update currentUser's made comments
    setRegisteredUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === currentUser.id
          ? { ...user, madeCommentIds: [...user.madeCommentIds, newCommentId] }
          : user
      )
    );
    setCurrentUser(prevUser => ({ ...prevUser, madeCommentIds: [...prevUser.madeCommentIds, newCommentId] }));
  };

  // Filtered and searched posts for BlogListPage
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.contentSnippet.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Conditional rendering based on currentPage state
  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigateToRegister={() => navigateTo('register')} />;
      case 'register':
        return <RegisterPage onRegister={handleRegister} onNavigateToLogin={() => navigateTo('login')} />;
      case 'dashboard':
        if (currentUser) {
          return <DashboardPage currentUser={currentUser} allBlogPosts={blogPosts} onLogout={handleLogout} onViewPost={(postId) => navigateTo('post-detail', postId)} />;
        } else {
          navigateTo('login'); // Redirect if direct access without login
          return null;
        }
      case 'blog-list':
        // Protected route: Only accessible if logged in
        if (!currentUser) { navigateTo('login'); return null; }
        return (
          <BlogListPage
            posts={filteredPosts}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onViewPost={(postId) => navigateTo('post-detail', postId)}
            onCreatePost={() => navigateTo('create-post')}
            currentUser={currentUser}
          />
        );
      case 'create-post':
        // Protected route: Only accessible if logged in
        if (!currentUser) { navigateTo('login'); return null; }
        return <CreatePostPage onCreatePost={handleCreatePost} onCancel={() => navigateTo('blog-list')} />;
      case 'post-detail':
        // Protected route: Only accessible if logged in
        if (!currentUser) { navigateTo('login'); return null; }
        const post = blogPosts.find(p => p.id === postDetailId);
        if (!post) {
          navigateTo('blog-list'); // If post not found, go back to list
          return null;
        }
        return (
          <PostDetailPage
            post={post}
            onLikePost={handleLikePost}
            onAddComment={handleAddComment}
            onEditPost={() => navigateTo('edit-post', post.id)} // Pass post ID to edit
            onDeletePost={handleDeletePost}
            onBackToList={() => navigateTo('blog-list')}
            currentUser={currentUser}
          />
        );
      case 'edit-post':
        // Protected route: Only accessible if logged in and user is author
        if (!currentUser) { navigateTo('login'); return null; }
        const postToEdit = blogPosts.find(p => p.id === postDetailId);
        if (!postToEdit || postToEdit.userId !== currentUser.id) { // Only author can edit
          navigateTo('blog-list');
          return null;
        }
        return <CreatePostPage postToEdit={postToEdit} onCreatePost={handleUpdatePost} onCancel={() => navigateTo('post-detail', postDetailId)} />;
      case 'profile':
        // Protected route: Only accessible if logged in
        if (!currentUser) { navigateTo('login'); return null; }
        return <ProfilePage currentUser={currentUser} onUpdateProfile={(updatedUser) => {
          setRegisteredUsers(registeredUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
          setCurrentUser(updatedUser);
          navigateTo('dashboard'); // Or back to profile
        }} />;
      case 'admin-dashboard':
        // Protected route: Only accessible if logged in and role is admin
        if (!currentUser || currentUser.role !== 'admin') {
          navigateTo('dashboard'); // Redirect non-admins
          return null;
        }
        return <AdminDashboardPage users={registeredUsers} posts={blogPosts} />;
      default:
        return <LoginPage onLogin={handleLogin} onNavigateToRegister={() => navigateTo('register')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-200 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-inter">
      {/* Universal Header for all pages */}
      <header className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-4 mb-4 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900">Blogging Platform</h1>
      </header>

      {/* Navigation Bar */}
      {currentUser && ( // Show navigation only if logged in
        <nav className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-4 mb-4 flex flex-wrap justify-center sm:justify-between items-center space-y-2 sm:space-y-0 text-sm sm:text-base">
          <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2">
            <motion.button
              whileHover={{ scale: 1.05, color: '#4F46E5' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateTo('dashboard')} className="text-gray-700 hover:text-indigo-600 font-medium px-3 py-1 rounded-md transition-colors duration-200">
              Dashboard
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, color: '#4F46E5' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateTo('blog-list')} className="text-gray-700 hover:text-indigo-600 font-medium px-3 py-1 rounded-md transition-colors duration-200">
              Blogs
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, color: '#4F46E5' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateTo('create-post')} className="text-gray-700 hover:text-indigo-600 font-medium px-3 py-1 rounded-md transition-colors duration-200">
              Create Post
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, color: '#4F46E5' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateTo('profile')} className="text-gray-700 hover:text-indigo-600 font-medium px-3 py-1 rounded-md transition-colors duration-200">
              Profile
            </motion.button>
            {currentUser.role === 'admin' && (
              <motion.button
                whileHover={{ scale: 1.05, color: '#4F46E5' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigateTo('admin-dashboard')} className="text-gray-700 hover:text-indigo-600 font-medium px-3 py-1 rounded-md transition-colors duration-200">
                Admin
              </motion.button>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout} className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-1 px-4 rounded-md shadow-md hover:shadow-lg transition-all duration-300">
            Logout
          </motion.button>
        </nav>
      )}

      {/* Main Content Area with Page Transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage} // Key changes to trigger exit/enter animations
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full max-w-4xl bg-white rounded-xl shadow-2xl p-6 sm:p-8"
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// --- Authentication Components (from previous version, slightly modified) ---

const LoginPage = ({ onLogin, onNavigateToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!onLogin(username, password)) {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="text-center">
      {/* Removed Blogging Platform heading from LoginPage */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
        >
          Login
        </motion.button>
      </form>
      <p className="mt-6 text-gray-600">
        Don't have an account?{' '}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNavigateToRegister}
          className="text-indigo-600 hover:text-indigo-800 font-medium focus:outline-none transition-colors duration-200"
        >
          Sign Up
        </motion.button>
      </p>
    </div>
  );
};

const RegisterPage = ({ onRegister, onNavigateToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    const result = onRegister(username, email, password);
    if (result === 'username_taken') {
      setError('This username is already taken. Please choose a different one.');
    } else if (result === 'email_taken') {
      setError('This email address is already registered. Please use a different one or login.');
    } else if (result === 'success') {
      // Registration successful, App component handles redirection
    } else {
      setError('An unexpected error occurred during registration.');
    }
  };

  return (
    <div className="text-center">
      {/* Removed Blogging Platform heading from RegisterPage */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
        >
          Sign Up
        </motion.button>
      </form>
      <p className="mt-6 text-gray-600">
        Already have an account?{' '}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNavigateToLogin}
          className="text-indigo-600 hover:text-indigo-800 font-medium focus:outline-none transition-colors duration-200"
        >
          Login
        </motion.button>
      </p>
    </div>
  );
};

const DashboardPage = ({ currentUser, allBlogPosts, onLogout, onViewPost }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // Simulate 0.8 second loading
    return () => clearTimeout(timer);
  }, [currentUser]);

  // Filter posts created by the current user
  const myPosts = allBlogPosts.filter(post => currentUser.createdPostIds.includes(post.id));

  // Filter posts liked by the current user
  const likedPosts = allBlogPosts.filter(post => currentUser.likedPostIds.includes(post.id));

  // Filter comments made by the current user
  const myComments = allBlogPosts.flatMap(post =>
    post.comments
      .filter(comment => comment.userId === currentUser.id)
      .map(comment => ({ ...comment, postTitle: post.title })) // Add post title for display
  );

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Welcome, {currentUser ? currentUser.username : 'Guest'}!
      </h2>
      <p className="text-gray-600 mb-8">This is your personalized dashboard.</p>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        </div>
      ) : (
        <>
          {/* My Blog Posts */}
          <div className="bg-blue-50 p-4 rounded-lg shadow-inner mb-8 text-left">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">My Blog Posts</h3>
            {myPosts.length > 0 ? (
              <ul className="space-y-3">
                {myPosts.map((post, index) => (
                  <motion.li
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ x: 5, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                    className="bg-white p-3 rounded-md shadow-sm flex justify-between items-center transition-all duration-200"
                  >
                    <span className="font-medium text-indigo-700 cursor-pointer hover:underline" onClick={() => onViewPost(post.id)}>
                      {post.title}
                    </span>
                    <span className="text-sm text-gray-500">{post.date}</span>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">You haven't created any blog posts yet.</p>
            )}
          </div>

          {/* Posts I've Liked */}
          <div className="bg-purple-50 p-4 rounded-lg shadow-inner mb-8 text-left">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Posts I've Liked</h3>
            {likedPosts.length > 0 ? (
              <ul className="space-y-3">
                {likedPosts.map((post, index) => (
                  <motion.li
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ x: 5, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                    className="bg-white p-3 rounded-md shadow-sm flex justify-between items-center transition-all duration-200"
                  >
                    <span className="font-medium text-indigo-700 cursor-pointer hover:underline" onClick={() => onViewPost(post.id)}>
                      {post.title} by {post.author}
                    </span>
                    <span className="text-sm text-gray-500">({post.likes} likes)</span>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">You haven't liked any posts yet.</p>
            )}
          </div>

          {/* My Comments */}
          <div className="bg-green-50 p-4 rounded-lg shadow-inner mb-8 text-left">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">My Comments</h3>
            {myComments.length > 0 ? (
              <ul className="space-y-3">
                {myComments.map((comment, index) => (
                  <motion.li
                    key={comment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ x: 5, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                    className="bg-white p-3 rounded-md shadow-sm transition-all duration-200"
                  >
                    <p className="font-medium text-gray-800">On "<span className="text-indigo-700 cursor-pointer hover:underline" onClick={() => onViewPost(comment.postId)}>{comment.postTitle}</span>":</p>
                    <p className="text-gray-700 text-sm">{comment.text}</p>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">You haven't made any comments yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// --- New Blogging Platform Components ---

// BlogListPage Component
const BlogListPage = ({ posts, categories, selectedCategory, onSelectCategory, searchTerm, onSearchChange, onViewPost, onCreatePost, currentUser }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // Simulate 0.8 second loading
    return () => clearTimeout(timer);
  }, [posts, selectedCategory, searchTerm]); // Re-trigger loading if filters change

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">All Blog Posts</h2>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search posts..."
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <select
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white transition-all duration-200 shadow-sm hover:shadow-md"
          value={selectedCategory}
          onChange={(e) => onSelectCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        </div>
      ) : (
        /* Blog Post List */
        posts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {posts.map((post, index) => (
              <BlogPostCard key={post.id} post={post} onViewPost={onViewPost} currentUser={currentUser} index={index} />
            ))}
          </motion.div>
        ) : (
          <p className="text-center text-gray-600">No posts found matching your criteria.</p>
        )
      )}
    </div>
  );
};

// BlogPostCard Component (reused from previous response, slightly modified for view action)
const BlogPostCard = ({ post, onViewPost, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -8, boxShadow: '0 15px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.08)' }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 cursor-pointer border border-gray-100"
      onClick={() => onViewPost(post.id)}
    >
      <div className="relative">
        <img
          className="w-full h-48 sm:h-64 object-cover"
          src={post.imageUrl}
          alt={post.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/600x400/E0E0E0/333333?text=Image+Not+Found`;
          }}
        />
        <span className="absolute bottom-3 left-3 bg-gradient-to-r from-teal-500 to-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
          {post.category}
        </span>
      </div>
      <div className="p-5 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 leading-tight">
          {post.title}
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          By <span className="font-medium text-indigo-700">{post.author}</span> on {post.date}
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          {post.contentSnippet}
        </p>
        <div className="flex items-center space-x-4 text-gray-600">
          <div className="flex items-center space-x-1">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span>{post.likes} Likes</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.336-3.11c-.813-1.333-1.336-2.984-1.336-4.89C2 6.134 5.582 3 10 3s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            <span>{post.comments.length} Comments</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// PostDetailPage Component
const PostDetailPage = ({ post, onLikePost, onAddComment, onEditPost, onDeletePost, onBackToList, currentUser }) => {
  const [commentText, setCommentText] = useState('');

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(post.id, commentText);
      setCommentText('');
    }
  };

  const isAuthor = currentUser && currentUser.id === post.userId;
  const isLikedByCurrentUser = currentUser && currentUser.likedPostIds.includes(post.id);


  return (
    <div className="space-y-6">
      <motion.button
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBackToList}
        className="mb-4 text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 focus:outline-none transition-all duration-200"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Blogs
      </motion.button>

      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{post.title}</h2>
      <p className="text-sm text-gray-600 mb-4">
        By <span className="font-medium text-indigo-700">{post.author}</span> on {post.date} | Category: {post.category}
      </p>

      <img
        className="w-full h-64 sm:h-80 object-cover rounded-lg shadow-md mb-6"
        src={post.imageUrl}
        alt={post.title}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `https://placehold.co/800x600/E0E0E0/333333?text=Image+Not+Found`;
        }}
      />

      <div className="prose max-w-none text-gray-800 leading-relaxed mb-6">
        {/* In a real app, this would render HTML from Quill.js */}
        <p>{post.content}</p>
      </div>

      <div className="flex items-center justify-between border-t border-b border-gray-200 py-4 mb-6">
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onLikePost(post.id)}
            className={`flex items-center space-x-1 font-medium transition-colors duration-200 focus:outline-none ${isLikedByCurrentUser ? 'text-red-600' : 'text-red-500 hover:text-red-700'}`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span>{post.likes} Likes</span>
          </motion.button>
          <div className="flex items-center space-x-1 text-blue-500">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.336-3.11c-.813-1.333-1.336-2.984-1.336-4.89C2 6.134 5.582 3 10 3s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            <span>{post.comments.length} Comments</span>
          </div>
        </div>
        {isAuthor && (
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}
              whileTap={{ scale: 0.95 }}
              onClick={onEditPost}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
              Edit Post
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDeletePost(post.id)}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
            >
              Delete Post
            </motion.button>
          </div>
        )}
      </div>

      {/* Comments Section */}
      <div className="bg-gray-50 p-5 rounded-lg shadow-inner">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Comments</h3>
        {post.comments.length > 0 ? (
          <ul className="space-y-4 mb-6">
            {post.comments.map(comment => (
              <motion.li
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-3 rounded-md shadow-sm"
              >
                <p className="font-semibold text-gray-800">{comment.author}</p>
                <p className="text-gray-700 text-sm">{comment.text}</p>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 mb-6">No comments yet. Be the first to comment!</p>
        )}

        <form onSubmit={handleCommentSubmit} className="space-y-3">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md"
            rows="3"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
          ></textarea>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
          >
            Submit Comment
          </motion.button>
        </form>
      </div>
    </div>
  );
};

// CreatePostPage Component (also handles EditPost)
const CreatePostPage = ({ onCreatePost, onCancel, postToEdit }) => {
  const [title, setTitle] = useState(postToEdit ? postToEdit.title : '');
  const [content, setContent] = useState(postToEdit ? postToEdit.content : '');
  const [contentSnippet, setContentSnippet] = useState(postToEdit ? postToEdit.contentSnippet : '');
  const [imageUrl, setImageUrl] = useState(postToEdit ? postToEdit.imageUrl : '');
  const [category, setCategory] = useState(postToEdit ? postToEdit.category : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const postData = {
      title,
      content,
      contentSnippet,
      imageUrl,
      category,
      ...(postToEdit && { id: postToEdit.id }) // Include ID if editing
    };
    onCreatePost(postData);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
        {postToEdit ? 'Edit Blog Post' : 'Create New Blog Post'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-gray-700 text-sm font-semibold mb-2">Title</label>
          <input
            type="text"
            id="title"
            placeholder="Post Title"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="contentSnippet" className="block text-gray-700 text-sm font-semibold mb-2">Short Description / Snippet</label>
          <textarea
            id="contentSnippet"
            rows="3"
            placeholder="A brief summary of your post..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md"
            value={contentSnippet}
            onChange={(e) => setContentSnippet(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="content" className="block text-gray-700 text-sm font-semibold mb-2">Content</label>
          {/* This is where Quill.js would be integrated in a real app */}
          <textarea
            id="content"
            rows="10"
            placeholder="Write your blog post here..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
          <p className="text-sm text-gray-500 mt-1">
            (In a full application, a rich text editor like Quill.js would be here.)
          </p>
        </div>
        <div>
          <label htmlFor="imageUrl" className="block text-gray-700 text-sm font-semibold mb-2">Image URL</label>
          <input
            type="text"
            id="imageUrl"
            placeholder="URL for featured image (e.g., from Cloudinary)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required // Added required attribute
            />
        </div>
        <div>
          <label htmlFor="category" className="block text-gray-700 text-sm font-semibold mb-2">Category</label>
          <input
            type="text"
            id="category"
            placeholder="e.g., Web Development, Lifestyle"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-end space-x-4">
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
          >
            {postToEdit ? 'Update Post' : 'Create Post'}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

// ProfilePage Component
const ProfilePage = ({ currentUser, onUpdateProfile }) => {
  const [username, setUsername] = useState(currentUser.username);
  const [email, setEmail] = useState(currentUser.email);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    // Simulate API call to update profile
    if (username.trim() === '' || email.trim() === '') {
      setError('Username and Email cannot be empty.');
      return;
    }
    const updatedUser = { ...currentUser, username, email };
    onUpdateProfile(updatedUser);
    setSuccess('Profile updated successfully!');
    // In a real app, this would involve a backend call and updating JWT if username/email changes affect it
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="profileUsername" className="block text-gray-700 text-sm font-semibold mb-2 text-left">Username</label>
          <input
            type="text"
            id="profileUsername"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="profileEmail" className="block text-gray-700 text-sm font-semibold mb-2 text-left">Email</label>
          <input
            type="email"
            id="profileEmail"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
        >
          Update Profile
        </motion.button>
      </form>
      <p className="mt-6 text-gray-600">
        You are logged in as <span className="font-semibold">{currentUser.username}</span> (Role: <span className="font-semibold capitalize">{currentUser.role}</span>).
      </p>
    </div>
  );
};

// AdminDashboardPage Component
const AdminDashboardPage = ({ users, posts }) => {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Admin Dashboard</h2>

      {/* User Management Section */}
      <div className="bg-blue-50 p-5 rounded-lg shadow-inner">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">User Management</h3>
        {users.length > 0 ? (
          <ul className="space-y-3">
            {users.map((user, index) => (
              <motion.li
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ x: 5, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                className="bg-white p-3 rounded-md shadow-sm flex justify-between items-center transition-all duration-200"
              >
                <span>{user.username} ({user.email}) - <span className="font-medium capitalize">{user.role}</span></span>
                {/* In a real app, add buttons for Edit Role, Delete User */}
                <button className="text-blue-500 hover:text-blue-700 text-sm">Manage</button>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No users registered.</p>
        )}
      </div>

      {/* Content Management Section */}
      <div className="bg-purple-50 p-5 rounded-lg shadow-inner">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Content Management</h3>
        {posts.length > 0 ? (
          <ul className="space-y-3">
            {posts.map((post, index) => (
              <motion.li
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ x: 5, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                className="bg-white p-3 rounded-md shadow-sm flex justify-between items-center transition-all duration-200"
              >
                <span>{post.title} by {post.author}</span>
                {/* In a real app, add buttons for Edit Post, Delete Post */}
                <button className="text-blue-500 hover:text-blue-700 text-sm">Manage</button>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No blog posts available.</p>
        )}
      </div>
    </div>
  );
};

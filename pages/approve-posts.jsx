import React, { useEffect, useState } from "react";
import * as adminApi from "../services/adminApi";
import AdminSidebar from "../components/AdminSidebar";

const ApprovePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const { data } = await adminApi.getPendingPosts();
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch pending posts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, []);

  const approve = async (id) => {
    await adminApi.approvePost(id);
    setPosts(posts.filter((p) => p._id !== id));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Approve Community Posts</h1>
        {loading && <p>Loading posts to approve...</p>}
        {!loading && posts.length === 0 && <p>No posts are pending for approval.</p>}
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
              <p className="mb-0">{post.content}</p>
              <button onClick={() => approve(post._id)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Approve
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ApprovePosts;
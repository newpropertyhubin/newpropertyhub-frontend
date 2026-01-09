document.addEventListener("DOMContentLoaded", () => {
  console.log("Broker page loaded");
  
  // Example fetch broker list
  async function loadBrokers() {
    const res = await fetch("/api/brokers");
    const brokers = await res.json();
    console.log("Brokers:", brokers);
  }
  
  loadBrokers();

  /* -------------------------------
     Follow / Follower Logic
  --------------------------------*/
  const followBtn = document.getElementById('followBtn');
  const followerCount = document.getElementById('followerCount');
  if (followBtn && followerCount) {
      let followers = parseInt(followerCount.textContent) || 0;
      followBtn.addEventListener('click', () => {
          // This is a demo. In a real app, you'd send an API request.
          followers++;
          followerCount.textContent = followers;
          console.log('Follow button clicked. API call to be implemented.');
      });
  }

  /* -------------------------------
     Blog / Post Form Logic
  --------------------------------*/
  const blogForm = document.getElementById('blogForm');
  const myPosts = document.getElementById('myPosts');
  if (blogForm && myPosts) {
      blogForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const title = document.getElementById('blogTitle').value;
          const content = document.getElementById('blogContent').value;

          console.log("New Blog Post:", { title, content });
          alert("Blog post submitted for approval! (Demo)");
          e.target.reset();
      });
  }
});
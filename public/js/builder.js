document.addEventListener("DOMContentLoaded", () => {
  console.log("Builder page loaded");

  async function loadBuilders() {
    const res = await fetch("/api/builders");
    const builders = await res.json();
    console.log("Builders:", builders);
  }

  loadBuilders();

  // Load reviews for the builder
  async function loadReviews() {
    const reviewsList = document.getElementById('reviewsList');
    if (!reviewsList) return;

    try {
      // Note: You might need to pass a builder ID to get specific reviews
      const response = await fetch('/api/reviews/builder/some-builder-id'); 
      if (!response.ok) throw new Error('Failed to load reviews');

      const reviews = await response.json();
      reviewsList.innerHTML = ''; // Clear existing content
      reviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review-item'; // Add a class for styling
        reviewElement.innerHTML = `<p><strong>${review.author}</strong>: ${review.comment} <span>(${review.rating} stars)</span></p>`;
        reviewsList.appendChild(reviewElement);
      });
    } catch (error) {
      reviewsList.innerHTML = '<p>Could not load reviews at this time.</p>';
      console.error('Error loading reviews:', error);
    }
  }

  loadReviews();

  /* -------------------------------
     Blog / Post Form Logic
  --------------------------------*/
  const blogForm = document.getElementById('blogForm');
  const postsList = document.getElementById('postsList');
  if (blogForm && postsList) {
      blogForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const title = document.getElementById('blogTitle').value;
          const content = document.getElementById('blogContent').value;

          console.log("New Blog Post:", { title, content });
          alert("Blog post submitted for approval! (Demo)");

          const postItem = document.createElement('li');
          postItem.innerHTML = `<strong>${title}</strong> - <em>Pending Approval</em>`;
          postsList.appendChild(postItem);
          e.target.reset();
      });
  }
});
console.log("dashboard.js loaded");

const ctx = document.getElementById('viewsChart')?.getContext('2d');
if(ctx){
    // TODO: Replace static data with dynamic data from your backend API.
    // Fetch user's property views and populate the labels and data arrays.
    new Chart(ctx, {
        type:'bar',
        data:{
            labels:['Property 1','Property 2','Property 3'],
            datasets:[{
                label:'Views',
                data:[10,20,5],
                backgroundColor:['#007BFF','#28a745','#ffc107']
            }]
        },
        options:{
            responsive:true,
            plugins:{
                legend:{ position:'top' },
                title:{ display:true, text:'Property Views' }
            }
        }
    });
}

// Note: The 'Follow' button logic has been removed from this file
// to prevent duplication, as it is already handled in 'main.js'.
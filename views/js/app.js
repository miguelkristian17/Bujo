const logoutButton = document.getElementById('logout-button');
const deleteButton = document.getElementById('delete-handler');
const templateID = document.getElementById('template_id');

logoutButton.addEventListener('click', () => {
   fetch('/api/auth/logout', {
        method: 'POST'
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            window.location = '/login';
        }
    }
    )
    window.location = '/login';
});

deleteButton.addEventListener('click', () => {
    alert("Hit");
    // fetch('/api/templates/' + deleteButton.dataset.id, {
    //     method: 'DELETE'
    // })
    // .then(res => res.json())
    // .then(data => {
    //     if (data.success) {
    //         window.location = '/index';
    //     }
    // }
    // )
    // window.location = '/index';
});
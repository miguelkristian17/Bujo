const logoutButton = document.getElementById('logout-button');

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

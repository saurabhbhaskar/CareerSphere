const form = [...document.querySelector('.form').children];

form.forEach((item, i) => {
    setTimeout(() => {
        if (item instanceof HTMLElement) {
            item.style.opacity = '1';
        }
    }, i * 100);
});

const name = document.querySelector('.name');
const email = document.querySelector('.email');
const password = document.querySelector('.password');
const submitBtn = document.querySelector('.submit-btn');

if (name) {
    // This is the signup page
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();

        fetch('/signup-user', {
            method: 'POST',
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify({
                name: name.value,
                email: email.value,
                password: password.value
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.name) {
                alert('Successfully signed up');
            } else {
                alert(data);
            }
        })
        .catch(error => {
            console.error('Error during signup:', error);
        });
    });
} else {
    // This is the login page
submitBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/login-user', {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.name) {
            alert('Successfully logged in');
        } else {
            alert('Login failed: ' + data);
        }
    })
    .catch(error => {
        console.error('Error during login:', error);
        alert('An error occurred during login. Please check the console for details.');
    });
});

}

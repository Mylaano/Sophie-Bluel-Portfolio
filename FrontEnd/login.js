const form = document.getElementById('form-login');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            email: [...data][0][1],
            password: [...data][1][1]
        })
    })

    console.log(response);

    if(response.ok) {
        const result = await response.json();

        sessionStorage.setItem('token', result.token);
        window.location = "index.html";
    } else {
        const errorLogin = document.getElementById('error-login');
        errorLogin.style.visibility = 'visible';
    }
})
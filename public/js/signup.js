async function signupFormHandler(event) {
    event.prevenDefault();

    const username = document.querySelector('#form5Example1').value.trim();
    const password = document.querySelector('#form5Example2').value.trim();

    if (username && email && password) {
        const response = await fetch('/api/users', {
          method: 'post',
          body: JSON.stringify({
            username,
            password
          }),
        });

        if(response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }


}}
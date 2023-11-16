
let form = document.getElementById('login-id')
let submit = document.getElementById('submit-id')

form.addEventListener('submit',loginUser)


async function loginUser(e){
    e.preventDefault();
   
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    const result = await fetch('/api/login',{
        method:'POST',
        headers:{
            "Content-Type":'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    })
    .then((res) =>  res.json())
    if(result.status === 'ok'){
        console.log('got the token',result.data)
        localStorage.setItem('token',result.data)
       alert('success')
    }
    else{
        alert(result.error)
    }
   

   
}

let form = document.getElementById('change-password-id')

form.addEventListener('submit',changePassword)

async function changePassword(e){
    e.preventDefault();
   
    const password = document.getElementById('password').value
    const result = await fetch('/api/changepassword',{
        method:'POST',
        headers:{
            "Content-Type":'application/json'
        },
        body: JSON.stringify({
            newpassword:password,
            token:localStorage.getItem("token")
        })
    })
    .then((res) =>  res.json())
    if(result.status === 'ok'){
       alert('success')
    }
    else{
        alert(result.error)
    }
   

   
}
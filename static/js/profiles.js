const avatarbox = document.getElementById('avatar-box')
const alertBox = document.getElementById('alert-box')
const profileForm = document.getElementById('profile-form')
const csrf = document.getElementsByName('csrfmiddlewaretoken')
const bioInput = document.getElementById('id_bio')
const avatarinput = document.getElementById('id_avatar')
const btn = document.querySelector('button')
const url = btn.getAttribute('data-url')


profileForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    
    const formData = new FormData()
    formData.append('csrfmiddlewaretoken',csrf[0].value)
    formData.append('bio',bioInput.value)
    formData.append('avatar',avatarinput.files[0])

    $.ajax({
        type:'POST',
        url: url,
        enctype: 'multipart/form-data',
        data:formData,
        success: function(response){
            avatarbox.innerHTML = `
            <img src="${response.avatar}" class="rounded" height="200px" width="auto" alt="${response.username}">
            `
            bioInput.value = response.bio;
            handleAlerts('success','Your profile has been updated')
        },
        error: function(response){
            console.log(response);
        },
        processData: false,
        contentType: false,
        cache: false,
    })
})

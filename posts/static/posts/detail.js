const back = document.getElementById("back-btn");
const update = document.getElementById('update-btn');
const delete_post = document.getElementById('delete-btn');
const spinnerBox = document.getElementById('spinner-box')
const url = window.location.href+'/data/'
const postBox = document.getElementById('post-box')
const titleInput = document.getElementById('id_title')
const bodyInput = document.getElementById('id_body')
const update_url = window.location.href+'/update/'
const delete_url = window.location.href+'/delete/'
const update_form = document.getElementById('update-form')
const delete_form = document.getElementById('delete-form')
const csrf = document.getElementsByName('csrfmiddlewaretoken')
const alertBox = document.querySelector('#alert-box')


// back.addEventListener('click',function(){
//     window.history.back()
// })

$.ajax({
    type: "GET",
    url: url,
    success: function(response){  
        const data = response.data;
        if(data.logged_in !== data.author){
            console.log('different');
        }
        else{
            console.log('same');    
            update.classList.remove('not-visible')
            delete_post.classList.remove('not-visible')
        }
        spinnerBox.classList.add('not-visible')
        
        const titleEl = document.createElement('h3')
        titleEl.setAttribute('class','m-3')
        titleEl.setAttribute('id','title')
        const bodyEl = document.createElement('p')
        bodyEl.setAttribute('class','m-1')
        bodyEl.setAttribute('id','body')
        titleEl.textContent = data.title
        bodyEl.textContent = data.body
        postBox.appendChild(titleEl)
        postBox.appendChild(bodyEl)
        titleInput.value = data.title
        bodyInput.value - data.value
    },
    error: function(response){
        console.log(response);
    }
})

update_form.addEventListener('submit',function(e){
    e.preventDefault()
    const title = document.getElementById('title')
    const body = document.getElementById('body')
    $.ajax({
        type: 'POST',
        url: update_url,
        data : {
            'csrfmiddlewaretoken':csrf[0].value,
            'title':titleInput.value,
            'body':bodyInput.value,
        },
        success: function(response){
            console.log(response);
            handleAlerts('success','Post has been updated');
            title.textContent = response.title;
            body.textContent = response.body
        },
        error: function(response){
            handleAlerts('danger','Some error occured');
            console.log(response);
        }
    })
})

// Delete request
delete_form.addEventListener('submit',function(e){
    e.preventDefault()
    $.ajax({
        type: 'POST',
        url: delete_url,
        data : {
            'csrfmiddlewaretoken':csrf[0].value,
        },
        success: function(response){
            window.location.href = window.location.origin
            localStorage.setItem('title', titleInput.value)
        },
        error: function(response){
            console.log(response);
        }
    })
})
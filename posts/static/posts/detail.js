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



update_form.addEventListener('submit',function(e){
    e.preventDefault()
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
        },
        error: function(response){
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
            console.log(response);
        },
        error: function(response){
            console.log(response);
        }
    })
})


back.addEventListener('click',function(){
    window.history.back()
})

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
        const bodyEl = document.createElement('p')
        bodyEl.setAttribute('class','m-1')
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
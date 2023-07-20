const post = document.querySelector('#posts-box')
const spinnerBox = document.querySelector('#spinner-box')
const loadBtn = document.getElementById("load-btn")
const endBox = document.getElementById("end-box")
const postForm = document.getElementById('post-form')
const title = document.getElementById('id_title')
const body = document.getElementById('id_body')
const csrf = document.getElementsByName('csrfmiddlewaretoken')
const alertBox = document.querySelector('.alert-box')
const addBtn = document.getElementById('add-btn')
const closeBtns = [...document.getElementsByClassName('add-modal-close')]
const dropzone = document.getElementById('my-dropzone')
const url = window.location.href



const deleted = localStorage.getItem('title')

if (deleted){
    handleAlerts('danger',`Post ${deleted} has been deleted`)
    localStorage.clear();
}

const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');
const likeUnlikePosts = (e) =>{
    const likeUnkileForms = [...document.getElementsByClassName('like-unlike-forms')]
    likeUnkileForms.forEach(form=> form.addEventListener('submit',e=>{
        e.preventDefault();
        const clickedId = e.target.getAttribute('data-form-id')
        const clickedBtn = document.getElementById(`like-unlike-${clickedId}`)

        $.ajax({
            type: "POST",
            url: "/like-unlike/",
            data: {
                'csrfmiddlewaretoken':csrftoken,
                'pk':clickedId,
            },
            success: function(response){
                clickedBtn.textContent = response.liked ? `Unkile(${response.count})`: `Like(${response.count})`
            },
            error: function(error){
                console.log(error);
            }
        })

    }))
}


const getData = () =>{
    $.ajax({
        type: "GET",
        url: `data/${visible}`,
        success: function(response){
            const data=response.data_list
            spinnerBox.classList.add('not-visible')
            data.forEach(element => {
                post.innerHTML += `
                    <div class="card mb-2">
                        <div class="card-body">
                            <h5 class="card-title">${element.title}</h5>
                            <p class="card-text">${element.body}</p>
                        </div>
                        <div class="card-footer">
                            <div class="row">
                                <div class="col-1">
                                    <a href="${url}${element.id}" class="btn btn-primary">Details</a>
                                </div>
                                <div class="col-1">
                                    <form class="like-unlike-forms" data-form-id="${element.id}">
                                        <button class="btn btn-primary" id="like-unlike-${element.id}">${element.liked ? `Unkile(${element.count})`: `Like(${element.count})`}</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            });
            likeUnlikePosts();
            if(response.size === 0){
                endBox.innerHTML = "No post added yet"
            }
            else if(response.size <= visible){
                loadBtn.classList.add("not-visible")
                endBox.innerHTML = "No more post to load..."
            }
        },
        error: function(error){
            console.log(error);
        }
    })
}

loadBtn.addEventListener('click',()=>{
    spinnerBox.classList.remove("not-visible")
    visible += 3;
    getData()
})

let newPostId = null

postForm.addEventListener('submit',e=>{
    e.preventDefault();
    $.ajax({
        type: 'POST',
        url: '',
        data: {
            'csrfmiddlewaretoken':csrf[0].value,
            'title':title.value,
            'body':body.value,
        },
        success: function(response){
            newPostId = response.id
            post.insertAdjacentHTML('afterbegin',`
                <div class="card mb-2">
                        <div class="card-body">
                            <h5 class="card-title">${response.title}</h5>
                            <p class="card-text">${response.body}</p>
                        </div>
                        <div class="card-footer">
                            <div class="row">
                                <div class="col-1">
                                    <a href="${url}${response.id}" class="btn btn-primary">Details</a>
                                </div>
                                <div class="col-1">
                                    <form class="like-unlike-forms" data-form-id="${response.id}">
                                        <button class="btn btn-primary" id="like-unlike-${response.id}">Like (0)</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
            `)
            likeUnlikePosts();
            // $("#addPostModal").modal('hide')
            // postForm.reset();
            handleAlerts('success','New post added');
            setTimeout(() => {
                const close_alert = document.querySelector('.alert-box');
                close_alert.innerHTML = ''
            }, 5000);
        },
        error: function(response){
            handleAlerts('danger','Something went wrong...')
            console.log(data);
            console.log(response);
            setTimeout(() => {
                const close_alert = document.querySelector('.alert-box');
                close_alert.innerHTML = ''
            }, 5000);
        }
    })
})

let visible = 3;


addBtn.addEventListener('click',(e)=>{
    dropzone.classList.remove('not-visible')
})

closeBtns.forEach(btn=> btn.addEventListener('click',(e)=>{
    postForm.reset();
    if(!dropzone.classList.contains('not-visibble')){
        dropzone.classList.add("not-visible")
    }
    const myDropzone = Dropzone.forElement("#my-dropzone")
    myDropzone.removeAllFiles(true)

}))

Dropzone.autoDiscover = false

const myDropzone = new Dropzone('#my-dropzone',{
    url: 'upload/',
    init: function(){
        this.on('sending',function(file, xhr, formData){
            formData.append('csrfmiddlewaretoken', csrftoken)
            formData.append('new_post_id', newPostId)
        })
    },
    maxFiles: 5,
    maxFilesize: 4,
    acceptedFiles: '.png, .jpg, .jpeg'
})


getData();
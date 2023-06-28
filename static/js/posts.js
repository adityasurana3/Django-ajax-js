const hello = document.querySelector('#hello-world')
const spinnerBox = document.querySelector('#spinner-box')

console.log("Hello WOrld")
// $.ajax({
//     type: 'GET',
//     url: 'hello-world/',
//     success: function(response){
//         hello.innerHTML = response.text;
//     },
//     error: function(err){
//         hello.innerHTML = err;
//     }
// })
$.ajax({
    type: "GET",
    url: "data/",
    success: function(response){
        const data=response.data_list
        spinnerBox.classList.add('not-visible')
        data.forEach(element => {
            hello.innerHTML += `<p>${element.title} - ${element.body}</p>`
        });
    },
    error: function(error){
        console.log(error);
    }
})
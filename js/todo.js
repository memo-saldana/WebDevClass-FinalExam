var token = localStorage.getItem('token');
if (token) {
  token = token.replace(/^"(.*)"$/, '$1'); // Remove quotes from token start/end.
}


var todos = document.querySelectorAll("input[type=checkbox]");

function loadTodos() {
  $.ajax({
    url: 'https://webdevclass-finalexambackend.herokuapp.com/todos',
    headers: {
        'Content-Type':'application/json',
        'Authorization': 'Bearer ' + token
    },
    method: 'GET',
    dataType: 'json',
    success: function(data){
      // console.log(data)
      let n = 0
      for( let i = 0; i < data.length; i++) {
        // aqui va su código para agregar los elementos de la lista
        addTodo(data[i]._id, data[i].description, data[i].completed)
        if(data[i].completed){
          n++;
        }
      }
      if(n == data.length){
        $('#select-all').text('Unselect all')
      }
    },
    error: function(error_msg) {
      alert((error_msg['responseText']));
    }
  });
}

loadTodos()


// o con jquery
// $('input[name=newitem]').keypress(function(event){
//     var keycode = (event.keyCode ? event.keyCode : event.which);
//     if(keycode == '13'){
//         $.ajax({})
//     }
// });

var input = document.querySelector("input[name=newitem]");

input.addEventListener('keypress', function (event) {
  if (event.charCode === 13) {
    json_to_send = {
      "description" : input.value
    };
    json_to_send = JSON.stringify(json_to_send);
    $.ajax({
      url: 'https://webdevclass-finalexambackend.herokuapp.com/todos',
      headers: {
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + token
      },
      method: 'POST',
      dataType: 'json',
      data: json_to_send,
      success: function(data){
        // console.log(data)
        // agregar código aqui para poner los datos del todolist en el el html
        addTodo(data._id, data.description, data.completed)
      },
      error: function(error_msg) {
        alert((error_msg['responseText']));
      }
    });
    input.value = '';
  }
})


function addTodo(id, todoText, completed) {
  let todo = $('ul#todo-list')
  if(completed){
    let completedTodo = todo
        .append(`<li>
                    <input type="checkbox" name="todo" value="${id}" onchange="onChange(this)" checked>
                    <span contenteditable="true" onblur="editTodo(this)">${todoText}</span>
                    <i class="fas fa-times" onclick="removeTodo(this)"></i>
                 </li>`)
    completedTodo.addClass('done');
  }
  else{
    todo
        .append(`<li>
                    <input type="checkbox" name="todo" value="${id}" onchange="onChange(this)">
                    <span contenteditable="true" onblur="editTodo(this)">${todoText}</span>
                    <i class="fas fa-times" onclick="removeTodo(this)"></i>
                 </li>`)
  }
}
const myID = '151'
const baseURL = 'https://altcademy-to-do-list-api.herokuapp.com';
var statusFilter;

let includeNewTaskRow = function(newTask , id, completed) {  
  let shouldCheckTask = completed ? 'checked' : '';
  let classToChekedTask = completed ? 'completed-task' : '';
    $('#my-current-list').append(`<li class='text-left d-flex justify-content-between'>
                                    <div class='d-inline'>
                                        <input type='checkbox' class='checkbox-item mr-2' ${shouldCheckTask}>
                                        <span class='${classToChekedTask} task-name'>${newTask}</span>
                                    </div>
                                    <div>
                                        <span class='delete-item'> x </span>
                                        <span class='id-item d-none'>${id} <span>
                                    </div>
                                    </li>`);    
}

let showTasks = function(status){   
  $.ajax({
        type: 'GET',
        url: `${baseURL}/tasks?api_key=${myID}`,
        dataType: 'json',
        success: function (response, textStatus) {
          for(let task of response.tasks){
            //console.log(typeof task.completed);
            if (status === 'all') {
              includeNewTaskRow(task.content, task.id, task.completed);
              statusFilter = 'all';
            }
            else if(status === 'active' && !task.completed) {
              includeNewTaskRow(task.content, task.id, task.completed);
              statusFilter = 'active';
            }
            else if (status === 'completed' && task.completed) {
              includeNewTaskRow(task.content, task.id, task.completed);
              statusFilter = 'completed'
            }
          }          
        },

        error: function (request, textStatus, errorMessage) {
          console.log(errorMessage);
        }
      });
}

var timeoutAdd;
let insertActivity = function() {
    clearTimeout(timeoutAdd);
    timeoutAdd = setTimeout( function(){     
        $.ajax({
            type: 'POST',
            url: `${baseURL}/tasks?api_key=${myID}`,
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
              task: {
                content: $('#new-item').val(),
              }
            }),
            success: function (response, textStatus) {
              if(statusFilter !== 'completed') {
                includeNewTaskRow(response.task.content, response.task.id , false);
              }              
              $('#new-item').val('');
            },
            error: function (request, textStatus, errorMessage) {
              console.log(errorMessage);
            }
          });

    } , 1000);
}

let deleteItem = function() {
    let intireRow = $(this).closest('li');
    let idToDelete = intireRow.find('.id-item').text();
    //console.log(`${idToDelete}`);
    $.ajax({
      type: 'DELETE',
      url: `${baseURL}/tasks/${idToDelete}?api_key=${myID}`,
      success: function (response, textStatus) {
        console.log(response);
        intireRow.remove();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
}

var timeoutChange;
let changeItem = function() {
  let intireRow = $(this).closest('li');
  let idToChange = ( intireRow.find('.id-item').text() ).replace(/\s+/g, ''); //This replace thing is becouse the id is comming whith a bunch os SPACE character
  let textTask = intireRow.find('.task-name');
  //console.log(textTask.text());

  let adressToAPI = $(this).is(':checked') ? `/tasks/${idToChange}/mark_complete?api_key=${myID}` : `/tasks/${idToChange}/mark_active?api_key=${myID}`;
  clearTimeout(timeoutChange);
  timeoutChange = setTimeout(function(){
    $.ajax({
      type: 'PUT',
      url: `${baseURL}/${adressToAPI}`,
      contentType: 'applicantion/json',
      dataType: 'json',
      success: function(response, textStatus) {
        //console.log(response);
        textTask.toggleClass('completed-task')
      },
      error: function (request, textStatus, errorMessage){
        console.log(errorMessage);
      }
    });
  }, 500);  
}

let clearTable = function() {
  $('#my-current-list').html('');
}

var timeoutChangeTable
let showAllTasks = function(){
  clearTimeout(timeoutChangeTable);
  if(statusFilter !== 'all'){
    timeoutChangeTable = setTimeout( function(){
      clearTable();
      showTasks('all');
    } , 500)
  }
}

let showActiveTasks = function() {
  clearTimeout(timeoutChangeTable);
  if(statusFilter !== 'active') {
    timeoutChangeTable = setTimeout(function(){
      clearTable();
      showTasks('active');
    } , 500);
  }

}

let showCompletedTasks = function(){
  clearTimeout(timeoutChangeTable);
  if(statusFilter !== 'completed'){
    timeoutChangeTable = setTimeout(function(){
      clearTable();
      showTasks('completed');
    }, 500)
  }
}

$(document).ready( function(){
    showTasks('all');
    $(document).on('click' , '.btn-add-item' , insertActivity);
    $(document).on('click' , '.delete-item' , deleteItem);
    $(document).on('change' , '.checkbox-item' , changeItem);
    $(document).on('click', '#show-all-tasks', showAllTasks);
    $(document).on('click' , '#show-active-tasks', showActiveTasks);
    $(document).on('click' , '#show-completed-tasks' , showCompletedTasks);
});



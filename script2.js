document.addEventListener('DOMContentLoaded', (event) => {
    // Task 
    let newtaskbtn = document.querySelector("#newtaskbutton");
    let newtaskinput = document.getElementById("newtask");

    newtaskbtn.onclick = addTask;
    newtaskinput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    function addTask() {
        var newTask = newtaskinput.value.trim();
        if (newTask !== "") {
            var item = document.createElement("li");
            item.className = "list-group-item";

            var checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "form-check-input me-2";

            var taskText = document.createElement("span");
            taskText.className = "task-text";
            taskText.innerText = newTask;

            var deleteBtn = document.createElement("button");
            deleteBtn.className = "delete-btn btn btn-danger ms-2";
            deleteBtn.innerText = "Delete";
            deleteBtn.disabled = false;

            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    taskText.classList.add("checked");
                    moveTask(item, 'completed');
                } else {
                    taskText.classList.remove("checked");
                    moveTask(item, 'pending');
                }
            });

            deleteBtn.onclick = () => {
                item.remove();
            };

            item.appendChild(checkbox);
            item.appendChild(taskText);
            item.appendChild(deleteBtn);

            document.querySelector(".task-box").appendChild(item);

            newtaskinput.value = "";
            document.getElementById('all').click(); 
        }
    }

    // Tab switching
    document.getElementById("tasks").addEventListener("click", () => {
        document.getElementById("tasksect").classList.add("active");
        document.getElementById("tasksect").classList.remove("d-none");
        document.getElementById("timersect").classList.remove("active");
        document.getElementById("timersect").classList.add("d-none");
    });

    document.getElementById("timer").addEventListener("click", () => {
        document.getElementById("tasksect").classList.remove("active");
        document.getElementById("tasksect").classList.add("d-none");
        document.getElementById("timersect").classList.add("active");
        document.getElementById("timersect").classList.remove("d-none");
    });

    document.getElementById("all").addEventListener("click", () => filterTasks("all"));
    document.getElementById("pending").addEventListener("click", () => filterTasks("pending"));
    document.getElementById("completed").addEventListener("click", () => filterTasks("completed"));

    function filterTasks(filter) {
        let allTasks = document.querySelectorAll('.task-box .list-group-item');
        allTasks.forEach(task => {
            if (filter === 'all') {
                task.style.display = 'flex';
            } else if (filter === 'pending') {
                task.style.display = task.querySelector('input[type="checkbox"]').checked ? 'none' : 'flex';
            } else if (filter === 'completed') {
                task.style.display = task.querySelector('input[type="checkbox"]').checked ? 'flex' : 'none';
            }
        });
    }

    function moveTask(taskItem, target) {
        let targetContainer = document.getElementById(`${target}tasks`);
        targetContainer.querySelector('.task-box').appendChild(taskItem.cloneNode(true));
        taskItem.remove();
    }

    // Timer management
    const timerButtons = {
        focus: 25 * 60,
        shortbreak: 1 * 10,
        longbreak: 30 * 60
    };
    let timerInterval;
    let currentTime = timerButtons.focus; 
    let currentMode = 'focus'; 

    document.getElementById('focus').addEventListener('click', () => setTimer(timerButtons.focus, 'focus'));
    document.getElementById('shortbreak').addEventListener('click', () => setTimer(timerButtons.shortbreak, 'shortbreak'));
    document.getElementById('longbreak').addEventListener('click', () => setTimer(timerButtons.longbreak, 'longbreak'));
    document.getElementById('start').addEventListener('click', () => startTimer());
    document.getElementById('stop').addEventListener('click', () => stopTimer());
    document.getElementById('restart').addEventListener('click', () => restartTimer());

    function setTimer(duration, mode) {
        currentTime = duration;
        currentMode = mode; 
        displayTime();
        stopTimer();
    }

    function startTimer() {
        stopTimer(); 
        timerInterval = setInterval(() => {
            let minutes = parseInt(currentTime / 60, 10);
            let seconds = parseInt(currentTime % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            document.getElementById('time-left').textContent = minutes + ":" + seconds;

            if (--currentTime < 0) {
                clearInterval(timerInterval);
                playFullscreenVideo(); // Play fullscreen video when timer completes
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function restartTimer() {
        stopTimer();
        currentTime = timerButtons[currentMode]; 
        displayTime();
    }

    function displayTime() {
        let minutes = parseInt(currentTime / 60, 10);
        let seconds = parseInt(currentTime % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.getElementById('time-left').textContent = minutes + ":" + seconds;
    }

    function playFullscreenVideo() {
        let video = document.getElementById('fullscreenVideo');
        video.style.display = 'block';

        // Request fullscreen
        video.requestFullscreen();

        // Play video
        video.play();

        // When video ends, exit fullscreen and hide video
        video.onended = () => {
            document.exitFullscreen();
            video.style.display = 'none';
        };
    }

    displayTime(); 

    //toggle icon navbar
    document.getElementById('menu-icon').addEventListener('click', function() {
    document.querySelector('nav ul').classList.toggle('active');
});


});

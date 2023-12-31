// set task list

let tasks = [];

chrome.storage.sync.get("tasks", (res) => {
    tasks = res.tasks ? res.tasks : [];
    tasks.forEach((t, taskNum) => {
        renderTask(taskNum);
    });
})

const storeTasks = (tasks) => {
    chrome.storage.sync.set({
        tasks,
    });
};
const addTaskBtn = document.getElementById("addTaskBtn");

addTaskBtn.addEventListener("click", ()=>{addTask();});

const renderTask = (taskNum) => {
    const taskList = document.getElementById("task-list");
    const taskListInnerDiv = document.createElement("div");
    const taskInput = document.createElement("input");
    taskInput.type = "text";
    taskInput.placeholder = "Please Write Your Task";
    taskInput.className = "task-input";
    taskInput.value = tasks[taskNum];
    taskInput.addEventListener("change", ()=>{
        tasks[taskNum] = taskInput.value;
        storeTasks(tasks);
    })

    const taskInputDel = document.createElement("input");
    taskInputDel.value = "X";
    taskInputDel.type = "button";
    taskInputDel.className = "task-delete";
    taskInputDel.addEventListener("click", () => {
        deleteTask(taskNum);
    })

    taskListInnerDiv.appendChild(taskInput);
    taskListInnerDiv.appendChild(taskInputDel);
    taskList.appendChild(taskListInnerDiv);
};

const addTask = () => {
    const taskNum = tasks.length;
    tasks[taskNum] = "";
    renderTask(taskNum);
};  

const deleteTask = (taskNum) => {
    tasks.splice(taskNum, 1);
    storeTasks(tasks);
    const taskContainer = document.getElementById("task-list");
    taskContainer.textContent = "";
    tasks.forEach((task, taskNum) => {
        renderTask(taskNum);
    });
};

// set timer

let timer = 0;
let isActive = false;

const time = document.getElementById("time");
const timerBtn = document.getElementById("timer-btn");

const displayTimer = (timer, maxTime) => {
    timer = maxTime*60 - timer;
    let min = Math.floor(timer/60).toString();
    let sec = (timer%60).toString();
    if(min.length == 1)min = "0"+min;
    if(sec.length == 1)sec = "0"+sec;
    time.textContent = `${min}:${sec}`;
};
const setTimerBtn = (isActive) => {
    if(isActive){
        timerBtn.textContent = "Stop Timer";
    }
    else{
        timerBtn.textContent = "Start Timer";
    }
};

timerBtn.addEventListener("click", () => {
    chrome.storage.local.get("isActive", (res) => {
        isActive = !res.isActive;
        chrome.storage.local.set({
            isActive : !res.isActive,
        });
        // setTimerBtn(isActive);
    })
})
chrome.alarms.onAlarm.addListener((alarm) => {
    chrome.storage.local.get(["timer", "isActive","timeOption"], (res) => {
        timer = res.timer ? res.timer : 0;
        isActive = res.isActive ? res.isActive : 0;
        const timeOption = res.timeOption ? res.timeOption : 25;
        displayTimer(timer, timeOption);
        setTimerBtn(isActive);
    });
});

const resetBtn = document.getElementById("reset-btn");
resetBtn.addEventListener("click", ()=>{
    chrome.storage.local.set({
        timer : 0,
        isActive : false,
    })
    chrome.storage.local.get(["timeOption"], (res)=>{
        displayTimer(0, res.timeOption);
    })
})

// animate pomodoro

const pomodoroIcon = document.getElementById("pomodoro-icon")

pomodoroIcon.addEventListener("click", () => {
    const pomodoroIconDiv = document.getElementById("pomodoro-icon-div");
    pomodoroIcon.style.transform = "translateX(-150%)";
    const inputPomodoroTime = document.createElement("input");
    inputPomodoroTime.id = "pomodoro-time-input";
    inputPomodoroTime.type = "number";
    inputPomodoroTime.min = 1;
    inputPomodoroTime.max = 60;
    inputPomodoroTime.placeholder = "Pomodoro Time in mins";
    inputPomodoroTime.addEventListener("change", (event) => {
        const val = Number(event.target.value);
        if(val < 1 || val > 60){
            inputPomodoroTime.value = 25;
        }
    })

    const inputPomodoroTimeBtn = document.createElement("input");
    inputPomodoroTimeBtn.id = "pomodoro-time-button";
    inputPomodoroTimeBtn.type = "button";
    inputPomodoroTimeBtn.value = "Set";

    inputPomodoroTimeBtn.addEventListener("click", ()=> {
        pomodoroIcon.style.transform = "translateX(0%)";
        const newTime = Number(inputPomodoroTime.value);
        if(newTime >= 1 && newTime < 61){
            console.log((newTime > 1));
            chrome.storage.local.set({
            timeOption : newTime ? newTime : timeOption,
            });
        }
        else{
            chrome.storage.local.set({
                timeOption : 25,
            });
        }
        inputPomodoroTime.remove();
        inputPomodoroTimeBtn.remove();

    })
    pomodoroIconDiv.appendChild(inputPomodoroTime);
    pomodoroIconDiv.appendChild(inputPomodoroTimeBtn);
});
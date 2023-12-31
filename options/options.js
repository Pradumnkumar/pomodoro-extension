const timeOption = document.getElementById("time-option");
timeOption.addEventListener("change", (event) => {
    const val = Number(event.target.value);
    if(val < 1 || val > 60){
        timeOption.value = 25;
    }
})

const saveBtn = document.getElementById("save-time-option");
saveBtn.addEventListener("click", ()=>{
    chrome.storage.local.set({
        timer: 0,
        timeOption: timeOption.value,
        isActive: false,
    })
})

chrome.storage.local.get(["timeOption"], (res) => {
    timeOption.value = res.timeOption ? res.timeOption : 25;
})
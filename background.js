chrome.alarms.create("timer", {
    periodInMinutes : 1/60
})

chrome.alarms.onAlarm.addListener((alarm) => {
    chrome.storage.local.get(["timer", "isActive","timeOption"], (res) => {
        timer = res.timer ? res.timer : 0;
        isActive = res.isActive ? res.isActive : false;
        const timeOption = res.timeOption ? res.timeOption : 25;
        if(isActive){
            timer = timer + 1;
            if(timer == 60*timeOption){
                chrome.storage.local.set({
                    timer : 0,
                    isActive : false,
                })
                chrome.notifications.create({
                    type: "basic",
                    title: "Pomodoro Timer",
                    message : `${timer/60} mins have passed`,
                    iconUrl : "icons/icon.png",
                });
            }
            else{
                chrome.storage.local.set({
                    timer,
                })
            }
        }
    });
})
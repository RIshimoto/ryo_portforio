'use strict';
{
    const timer=document.getElementById('timer');
    const count=document.getElementById(`count`);
    const start=document.getElementById('start');
    const stop =document.getElementById('stop');
    const reset=document.getElementById('reset');
    const rest=document.getElementById('rest');

    let startTime;
    let timeLeft;
    let timeId;
    let timeoutId;
    let elapsedTime=0;
    let sec1=5;//集中する時間
    let sec2=3;//中休憩
    let sec3=20;//大休憩
    let active_term=4;//何タームやって大休憩するか
    let state=0;
    let term=1;

    var timeToCountDown=sec1*1000;

    //残り時間を表示するためにミリ秒を渡すと分と秒に直してくれる関数
    function updateTimer(t){
        var d=new Date(t);
        var m=String(d.getMinutes()).padStart(2,'0');
        var s=String(d.getSeconds()).padStart(2,'0');
        var ms=String(d.getMilliseconds()).padStart(3,'0');
        timer.textContent=`${m}:${s}.${ms}`;
    }

    function countDown(){
        if(term<active_term){
            setButtonStateRunning();
        }else{
            setButtonStateRunning2();
        }
        timeLeft=timeToCountDown-(Date.now()-startTime+elapsedTime);
        updateTimer(timeLeft);
        if(state===0){
        count.textContent=`${term}ターム`;
        }else if(state===1){
            count.textContent=`${term}ターム~休憩~`;
        }

        if(state===1&&timeLeft<0){
            timeToCountDown=sec1*1000;
            startTime=Date.now();
            elapsedTime=0;
            state=0;
            term+=1;
        }else if(state===0&&timeLeft<0){
            timeToCountDown=sec2*1000;
            startTime=Date.now();
            elapsedTime=0;
            state=1;
        }

        timeId=setTimeout(countDown,1);
    }

    function Rest(){
        clearInterval(timeId);
        count.textContent=`休憩ターム`;
        timeToCountDown=sec3*1000;
        timeLeft=timeToCountDown-(Date.now()-startTime+elapsedTime);
        updateTimer(timeLeft);
        timeoutId=setTimeout(Rest,1);
        if(timeLeft<0){
            clearInterval(timeoutId);
            startTime=Date.now();
            term=1;
            countDown();
        }
    }

    //start
    function setButtonStateInitial(){
        start.classList.remove('inactive');
        stop.classList.add('inactive');
        reset.classList.add('inactive')
        rest.classList.add('inactive');
    }
    //stop
    function setButtonStateRunning(){
        start.classList.add('inactive');
        stop.classList.remove('inactive');
        reset.classList.add('inactive');
        rest.classList.add('inactive');
    }
    //stop,rest
    function setButtonStateRunning2(){
        start.classList.add('inactive');
        stop.classList.remove('inactive');
        reset.classList.add('inactive');
        rest.classList.remove('inactive');
    }
    //start,reset
    function setButtonStateStopped(){
        start.classList.remove('inactive');
        stop.classList.add('inactive');
        reset.classList.remove('inactive');
        rest.classList.add('inactive');
    }
    //start,reset,rest
    function setButtonStateStopped2(){
        start.classList.remove('inactive');
        stop.classList.add('inactive');
        reset.classList.remove('inactive');
        rest.classList.remove('inactive');
    }

    setButtonStateInitial();

    start.addEventListener('click',()=>{
        if(start.classList.contains('inactive')===true){
            return;
        }
        setButtonStateRunning();//canpush...stop
        startTime=Date.now();
        countDown();
    });

    stop.addEventListener('click',()=>{
        if(stop.classList.contains('inactive')===true){
            return;
        }
        if(term<active_term){
            setButtonStateStopped();//canpush...start,reset
        }else{
            setButtonStateStopped2();//canpush...start,reset,rest
        }
        clearTimeout(timeId);
        clearTimeout(timeoutId);
        elapsedTime+=Date.now()-startTime;
    });

    reset.addEventListener('click',()=>{
        if(reset.classList.contains('inactive')===true){
            return;
        }
        setButtonStateInitial();//canpush...start
        timer.textContent=" 25:00.000";
        elapsedTime=0;
        state=0;
        term=1;
        count.textContent=`${term}ターム`;
    });

    rest.addEventListener('click',()=>{
        if(rest.classList.contains('inactive')===true){
            return;
        }
        setButtonStateRunning();//canpush...stop
        startTime=Date.now();
        elapsedTime=0;
        Rest();
    });
}

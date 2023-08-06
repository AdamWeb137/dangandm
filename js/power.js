
function set_up_btn(id,conditional,func){
    if (conditional){
        document.querySelector("#"+id).addEventListener("click", func);
    }else{
        document.querySelector("#"+id).style.display="none";
    }
}

function set_up_power(){
    set_up_btn("shutdown-btn",lightdm.can_shutdown,()=>{
        lightdm.shutdown();
    });
    set_up_btn("restart-btn",lightdm.can_restart,()=>{
        lightdm.restart();
    });
    set_up_btn("hibernate-btn",lightdm.can_hibernate,()=>{
        lightdm.hibernate();
    });
    set_up_btn("suspend-btn",lightdm.can_suspend,()=>{
        lightdm.suspend();
    });
}
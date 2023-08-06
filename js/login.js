let greeter_ready=false;

function get_username(){
    if(last_shown_user_type == "user_inp"){
        return document.querySelector("#"+last_shown_user_type).value;
    }
    return document.querySelector("#user_name p").innerHTML;
}

function get_password(){
    return document.querySelector("#pass_inp").value;
}

function get_session(){
    return document.querySelector("#session").getAttribute("value") ?? "gnome-xorg";
}

let put_in_pass=false;
function start_auth(event) {
    if(!greeter_ready) return;
    console.log("start auth");
    document.querySelector("#go").style.display="none";
    document.querySelector("#spin").style.display="block";
    document.querySelector("#error_msg_container").style.display="none";
    document.querySelector("#pass_inp").disabled=true;
    document.querySelector("#user_inp").disabled=true;
    // lightdm.cancel_authentication();
    // lightdm.authenticate(get_username());
    // await wait(1000);
    put_in_pass=true;
    lightdm.respond(get_password());
    // lightdm.start_session("gnome-xorg");
}

// lightdm.show_prompt.connect((text, type) => {
//     if(type == 1){
//         lightdm.respond(get_password());
//     }
// });

lightdm.authentication_complete.connect(async ()=>{
    if(!lightdm.is_authenticated){
        console.log("fail");
        failed_auth();
        return;
    }
    console.log("complete");
    lightdm.start_session(get_session());
});

function failed_auth(event){
    if(!put_in_pass)return;
    put_in_pass=false;
    lightdm.cancel_authentication();
    document.querySelector("#pass_inp").disabled=false;
    document.querySelector("#user_inp").disabled=false;
    document.querySelector("#go").style.display="flex";
    document.querySelector("#spin").style.display="none";
    document.querySelector("#error_msg_container").style.display="flex";
    setTimeout(()=>{
        document.querySelector("#error_msg_container").style.display="none";
    },2000);
    // wipe_inp();
    document.querySelector("#pass_inp").value="";
    if(last_shown_user_type != "user_inp"){
        document.querySelector("#pass_inp").focus();
        lightdm.authenticate(get_username());
    }else{
        document.querySelector("#user_inp").value="";
        document.querySelector("#user_inp").focus();
    }
}

async function wait(ms){
    return new Promise((resolve) => {
        setTimeout(() => resolve(), ms);
    });
}

window.addEventListener("GreeterReady", ()=>{
    greeter_ready=true;
});
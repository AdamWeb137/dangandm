function set_random_background() {
    let rand = Math.floor(Math.random()*94);
    document.querySelector("#background").style.backgroundImage=`url("./imgs/bgs/bdg${rand}.png")`;
}

function render_time () {
    let d = new Date();
    let h = d.getHours();
    let m = d.getMinutes();
    let post = (h >= 12) ? "PM" : "AM";
    h = h % 12;
    h = (h == 0) ? 12 : h;
    let t = `${h}:${(m < 10) ? "0" : ""}${m} ${post}`;
    document.querySelector("#timep").innerHTML = t;
}

let user_list = lightdm.users;


function wipe_inp(){
    const user_inp = document.querySelector("#user_inp");
    const pass_inp = document.querySelector("#pass_inp");
    user_inp.value="";
    pass_inp.value="";
};

function handle_user_drop(event) {

    if(!can_change_user) return;

    const drop_btn = document.querySelector("#user_drop");
    const user_select = document.querySelector("#user_select");
    const user_name = document.querySelector("#user_name");
    const select_cover = document.querySelector("#user_select_cover");
    const user_inp = document.querySelector("#user_inp");
    const pass_inp = document.querySelector("#pass_inp");

    const display_select=(st)=>{
        select_cover.style.display=st;
        user_select.style.display=st;
    };

    if(user_select.style.display=="none"){
        drop_btn.querySelector("b").innerHTML="^"//"∧";
        user_name.style.display="none";
        user_inp.style.display="none";
        user_select.innerHTML="";
        let pfp = document.querySelector("#user_pfp")
        user_select.id = "user_select";
        for(let user of user_list){
            let user_select_btn = document.createElement("P");
            user_select_btn.setAttribute("value",user.username);
            user_select_btn.innerHTML = user.username;
            user_select_btn.addEventListener("click",()=>{
                pfp.style.backgroundImage=`url("${user.image}")`;
                display_select("none");
                user_name.querySelector("p").innerHTML=user.username;
                user_name.style.display="flex";
                last_shown_user_type="user_name";
                wipe_inp();
                drop_btn.querySelector("b").innerHTML="v";
                pass_inp.focus();
                lightdm.cancel_authentication();
                lightdm.authenticate(user.username);
            });
            user_select.appendChild(user_select_btn);
        }
        let manual_select_btn = document.createElement("P");
        manual_select_btn.setAttribute("value","manual");
        manual_select_btn.innerHTML = "Manual Login";
        manual_select_btn.addEventListener("click",()=>{
            pfp.style.backgroundImage=`url("./imgs/grayman.png")`;
            user_inp.style.display="block";
            display_select("none");
            last_shown_user_type="user_inp";
            drop_btn.querySelector("b").innerHTML="v";
            wipe_inp();
            user_inp.focus();
        });
        user_select.appendChild(manual_select_btn);
        display_select("block");
    }else{
        drop_btn.querySelector("b").innerHTML="v";
        display_select("none");
        document.querySelector(`#${last_shown_user_type}`).style.display=(last_shown_user_type == "user_name") ? "flex" : "block";
    }
}

let last_shown_user_type="user_inp";

// let session_list = ["Gnome","Gnome Classic"];
let session_list = lightdm.sessions;
function handle_session_drop(event) {
    if(!can_change_session) return;
    const session = document.querySelector("#session");
    const sess_select = document.querySelector("#session_select");
    const sess_cover = document.querySelector("#session_select_cover");

    const display_select=(st)=>{
        sess_cover.style.display=st;
        sess_select.style.display=st;
    };

    // if (session.style.display != "none"){
    session.style.display="none";
    sess_select.innerHTML="";

    let keys=new Set();

    for(let sess of session_list){
        if(keys.has(sess.key))continue;
        keys.add(sess.key);
        let sess_btn = document.createElement("P");
        sess_btn.setAttribute("value",sess.name);
        sess_btn.innerHTML=sess.name;
        sess_btn.addEventListener("click",()=>{
            session.querySelector("p").innerHTML=sess.name;
            session.setAttribute("value",sess.key);
            display_select("none");
            session.style.display="block";
        });
        sess_select.appendChild(sess_btn);
    }
    display_select("block");
    // }
}

let can_change_user = true;
function stick_user(){
    can_change_user=false;
    document.querySelector("#user_drop").classList.remove("canclick");
}
let can_change_session = true;
function stick_session(){
    can_change_session = false;
    document.querySelector("#session").classList.remove("canclick");
}

function set_users(){

    const user_name = document.querySelector("#user_name");
    const user_inp = document.querySelector("#user_inp");
    const pass_inp = document.querySelector("#pass_inp");

    const change_user = (user)=>{
        user_name.querySelector("p").innerHTML = user.username;
        user_name.style.display = "flex";
        user_inp.style.display = "none";
        document.querySelector("#user_pfp").style.backgroundImage=`url("${user.image}")`;
        last_shown_user_type = "user_name";

        for(let sess of session_list){
            if(sess.key==user.session){
                document.querySelector("#session p").innerHTML=sess.name;
                document.querySelector("#session").setAttribute("value",sess.key);
            }
        }

        lightdm.cancel_authentication();
        lightdm.authenticate(user.username);
        pass_inp.focus();
    };

    for(let u of user_list){
        if(u.logged_in){
            change_user(u);
            stick_user();
            stick_session();
            // if(lightdm.lock_hint){
            //     stick_session();
            // }
            return;
        }
    }

    if(user_list.length > 0){
        change_user(user_list[0]);
        return;
    }

    document.querySelector("#user_inp").focus();
}

let current_theme=0;

window.addEventListener("load",()=>{
    set_random_background();
    document.querySelector("#user_drop").addEventListener("click",handle_user_drop);
    document.querySelector("#session").addEventListener("click",handle_session_drop);
    document.querySelector("#logo").addEventListener("click",()=>{
        current_theme = (current_theme == 1) ? 0 : 1;
        set_theme(current_theme);
    });
    document.querySelector("#user_inp").addEventListener("keypress",(kev)=>{
        if(kev.key == "Enter"){
            kev.preventDefault();
            lightdm.cancel_authentication();
            lightdm.authenticate(get_username());
            document.querySelector("#pass_inp").focus();
        }
    });
    document.querySelector("#pass_inp").addEventListener("keypress",(kev)=>{
        if(kev.key == "Enter"){
            kev.preventDefault();
            start_auth();
        }
    });
    document.querySelector("#pass_inp").addEventListener("click",()=>{
        if(!lightdm.in_authentication && last_shown_user_type == "user_inp" && get_username() != ""){
            lightdm.authenticate(get_username());
        }
    });
    document.querySelector("#go").addEventListener("click",start_auth);

    let d = new Date();
    if(d.getHours() >= 20) current_theme=1;
    render_time();
    setTimeout(()=>{setInterval(render_time,60000);},(60-d.getSeconds())*1000);

    set_theme(current_theme);
    set_up_power();

    let set_sess=false;
    for(let sess of session_list){
        if(sess.name==lightdm.default_session){
            document.querySelector("#session p").innerHTML=sess.name;
            document.querySelector("#session").setAttribute("value",sess.key);
            set_sess=true;
            break;
        }
    }
    if(!set_sess){
        document.querySelector("#session p").innerHTML=session_list[0].name;
        document.querySelector("#session").setAttribute("value",session_list[0].key);
    }
    set_users();
    // document.querySelector("#user_inp").focus();
});
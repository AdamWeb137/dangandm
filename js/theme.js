function set_theme(theme) {
    const css_vars = {
        "border_color":["#fd9800","#1b8ad7"],
        "hover_color":["#ffb74b","#6cbaf1"],
        "time_shadow":["orange","blue"],
        "back_color":["rgba(95, 95, 95, 0.5)","rgba(95, 95, 95, 0.5)"]
    };
    const theme_imgs = {
        "shutdown_btn":"power2",
        "restart_btn":"restart2",
        "suspend_btn":"suspend2",
        "hibernate_btn":"hibernate2",
        "semi":"semi",
        "eight":"eight",
        "logo":"",
        "top":"top2"
    };
    let r = document.querySelector(":root");
    for(let css_var in css_vars){
        r.style.setProperty("--"+css_var.replace("_","-"),css_vars[css_var][theme]);
    }
    for(let img in theme_imgs){
        document.querySelector(`#${img.replace("_","-")}`).src=`./imgs/ui/${(theme) ? "night" : "day"}${theme_imgs[img]}.png`;
    }
}
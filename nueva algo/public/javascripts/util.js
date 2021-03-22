
function collapseNavBar() {
    if (document.getElementById("nav-side").getAttribute("hiding")==="true") {
        
        document.getElementById('nav-side').setAttribute("class","col-sm-3 nav-col");
        document.getElementById('nav-side').setAttribute("hiding","false");
        document.getElementById('nav-side').style.display="block";
        
        document.getElementById('content').setAttribute("class","col-sm-9  content-col");
    }else {
        document.getElementById('nav-side').setAttribute("class","col-sm0 nav-col");
        document.getElementById('nav-side').style.display="none";
        
        document.getElementById('nav-side').setAttribute("hiding","true");
        
        document.getElementById('content').setAttribute("class","col-sm-12 content-col");
    }
}
AOS.init();
var clickedButton = false;

function showText() {
    if(document.getElementById("firstName").value === "" || document.getElementById("TextArea").value ==="")
    {
        alert("Please enter a Firstname and a text!");
        return;
    }

    alert(document.getElementById("firstName").value + " says " + document.getElementById("TextArea").value);
}
function showAnimation() {
    var c = document.getElementById("idProgress").childNodes;
    var b = 0;

    if (!clickedButton) {
        clickedButton = true;
    }
    else
    {
        clickedButton = false;
    }
    
    for (i = 0; i < c.length; i++) {
        if (c[i].classList == "progress")
        {
            if (clickedButton) {
                c[i].childNodes[1].classList.add("progress-bar-animated");
            }
            else 
            {
                c[i].childNodes[1].classList.remove("progress-bar-animated");
            }
        }
    }
}


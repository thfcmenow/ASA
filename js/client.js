$("input").css("border-color","ced4da")
    $("input").css("background-color","white")
    if (localStorage.getItem("pass") !== "") {
        $("#password").val(localStorage.getItem("pass"))
    }
    highlight = (obj,major) => {
        highlightFail = true
        obj.css("border-color","red")
        if (major) {
            obj.css("background-color","yellow")
            $("#search").html("Locked")
        }
    }
    deleteMe = (id) => {
        let sure = confirm("Are you Sure?")
        if (sure) {
            $("#" + id).fadeOut(500)
            $.get("/delete", { id: id, pass: $("#password").val() }, function (res) {
                  console.log(res)
             })
        }
    }
    renderResults = (main) => {
        let build = ""
        if (main[0].hasOwnProperty("password")) {
            if (!main[0].password)
            {
                highlight($("#password"),true)
                return false
            }
        }
        main.forEach(function (item) {
            console.log(item.allinfo)
            build += "<tr id='" + item.id + "'>"
            build += "<td><a href='" + item.url + "' target='_blank'>" + item.title + "</a>"
            build += "<table><tr><td><div class='alert alert-secondary'>"
            if (item.allinfo.hasOwnProperty("custom_fields")) {
                for (const key in item.allinfo.custom_fields) {
                    build += "<p>" + `${key}: ${item.allinfo.custom_fields[key]}` + "</p>"
                }
            }
            build += "</div></td></tr></table>"
            build += "</td>"
            build += "<td>" + item.id + "</td>"
            build += "<td><button class='btn btn-warning' onclick='deleteMe(\"" + item.id + "\")'>Delete</button></td>"
            build += "</tr>"
        })
        $("#more").show()
        $("#results").prepend(build)
        $(".table").show()
        $("#search").html("Search")
        $("#search").attr("disabled", false)
    }
    $("#more").click(function(){
        $(".alert-secondary:first").is(":visible") ? $(".alert-secondary").hide() : $(".alert-secondary").show()
    })
    $("#search").click(function () {
        highlightFail = false
        $("input").css("border-color","ced4da")
        if ($("#password").val() !=="") {
            localStorage.setItem('pass', $("#password").val());
        } else {
            highlight($("#password"))
        }
        let thisISanID = false
        let input = $("#searchterm").val()
        input.replace(/ /g, "").length == 32 ? thisISanID = true : ""
        console.log("Is this an ID serch?: ",thisISanID)
        let lob = $("#lob").val()
        console.log("lob:",lob)
        if (input == "") {
            highlight($("#searchterm"))
        }
        if (!thisISanID) {
            if (lob == "") {
                highlight($("#lob"))
            }
        }
        if (highlightFail) return false
        $("input").css("border-color","ced4da")
        $(this).html("Wait")
        $(this).attr("disabled", true)
        $("#results").html("")
        if (thisISanID) {
            $.get("/idonly", { id: input, pass: $("#password").val() }, function (res) {
                main = JSON.parse("[" + res + "]")
                renderResults(main)
            })
        } else {
            $.get("/info", { main: input, filename: lob, count: $("#count").val(), pass: $("#password").val() }, function (res) {
                
                main = JSON.parse("[" + res + "]")
                console.log(main)
                renderResults(main)
            })
        }
    })
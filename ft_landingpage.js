window.addEventListener("load", function() {
    const modal = document.getElementById('myModal');
    const close = document.getElementsByClassName("close")[0];
    const applyBtn = document.getElementById("apply-btn");
    const form = document.getElementById('my-form');

    const btns = document.querySelectorAll("#apply-btn");
    btns.forEach(applyBtn => {
        applyBtn.addEventListener("click", function() {
            modal.style.display = "block";
        });
        close.onclick = function() {
            modal.style.display = "none";
        }
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    })
    const forms = document.querySelectorAll('#my-form');
    forms.forEach(form => {
        form.addEventListener('submit', event => {
            event.preventDefault();
            const data = new FormData(form);
            const action = form.action;
            document.getElementById("signup").setAttribute("value", "Loading...")
            fetch(action, {
                method: 'POST',
                body: data,
            })
            .then(() => {
                window.location.href = "thankyou-page.html";
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    });
});

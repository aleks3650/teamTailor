
const getCandidatesButton = document.getElementById("get-candidates");
const candidatesDiv = document.getElementById("candidates");

getCandidatesButton.addEventListener("click", () => {
    fetch("http://localhost:3000/candidates")
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            candidatesDiv.innerHTML = data.message;
        })
        .catch((error) => console.error(error));
});

var form = document.getElementById('mainForm');
var candidatesList = [];
var cardsContainer = document.getElementById('cards-container');

if (window['env']['ecServerEndpoint']) {
  window.ecServerEndpoint = 'http://' + window['env']['ecServerEndpoint'];
  form.addEventListener('submit', handleFormSubmit);
  getAllCandidates();
} else {
  form.innerHTML =
    '<div class="alert alert-danger" role="alert">' +
    "Couldn't find server's address. Please try again or report this to devs" +
    '</div>';
}

function getAllCandidates() {
  fetch(window.ecServerEndpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((res) => {
      candidatesList = res.Candidates;
      showAllCandidates(candidatesList);
    })
    .catch((err) => {
      cardsContainer.innerHTML =
        '<div class="alert alert-danger" role="alert">' +
        'Error in adding the candidate. Please try again or report this to devs' +
        '</div>';
    });
}
function handleFormSubmit(ev) {
  ev.preventDefault();
  var formData = new FormData(ev.target);
  var Name = formData.get('name');
  var ImageUrl = formData.get('imageUrl');
  var alertContainer = document.getElementById('alertContainer');
  fetch(window.ecServerEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ Name, ImageUrl }),
  })
    .then((res) => res.json())
    .then((res) => {
      getAllCandidates();
      form.reset();
      $('#customModal').modal('hide');
      // alertContainer.innerHTML =
      // 	'<div class="alert alert-success" role="alert">' +
      // 	'Candidate added succesfully!' +
      // 	'</div>';
    })
    .catch((err) => {
      alertContainer.innerHTML =
        '<div class="alert alert-danger" role="alert">' +
        'Error in adding the candidate. Please try again or report this to devs' +
        '</div>';
    });
}

function deleteCandidate(Name) {
  fetch(window.ecServerEndpoint, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ Name }),
  })
    .then((res) => res.json())
    .then((res) => {
      candidatesList = res.Candidates;
      showAllCandidates(candidatesList);
      getAllCandidates();
    })
    .catch((err) => {
      alertContainer.innerHTML =
        '<div class="alert alert-danger" role="alert">' +
        'Error in adding the candidate. Please try again or report this to devs' +
        '</div>';
    });
}

function showAllCandidates(candidatesList) {
  if (!candidatesList || candidatesList.length === 0) {
    cardsContainer.innerHTML = `<h1>No Candidates</h1>`;
  } else {
    var candidatesCardsContainer = '';
    candidatesList.map((candidate) => {
      candidatesCardsContainer += `<div class="card-container">
          <div class="card">
            <!-- <div class="close-icon">x</div> -->
            <div class="card-background-container">
              <div class="card-background"></div>
              <div class="card-background-image">
                <img src=${candidate.ImageUrl} width="150px" height="150px" class="image"/>
              </div>
            </div>
            <div class="card-content-container">
              <div class="card-content">
                <div>${candidate.Name}</div>
                <div class="delete-Button" onClick="deleteCandidate('${candidate.Name}')">Delete</div>
              </div>
            </div>
          </div>
        </div>`;
    });
    cardsContainer.innerHTML =
      `<div class="cards-container" id="cards-container">` +
      candidatesCardsContainer +
      `</div>`;
  }
}

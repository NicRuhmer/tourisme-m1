// Récupère l'élément avec l'ID "user_name"
const userNameElement = document.getElementById('user_name');

// Vérifie si l'élément existe
if (userNameElement) {

    // Récupère le nom de l'utilisateur à partir de la session
    const userName = 'Nico Ruhmer';
    // Met à jour l'élément avec le nom de l'utilisateur
    userNameElement.innerHTML = userName;
}
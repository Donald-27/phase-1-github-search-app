// index.js

// Define URLs for the GitHub API endpoints
const userSearchUrl = 'https://api.github.com/search/users?q=';
const userReposUrl = 'https://api.github.com/users/';

// Select elements from the DOM
const form = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const userList = document.querySelector('#user-list');
const repoList = document.querySelector('#repo-list');
const searchTypeBtn = document.querySelector('#search-type-btn'); // Button to toggle between users and repos

let isUserSearch = true; // Track if we're searching for users or repos

// Event listener for the search form submission
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    if (isUserSearch) {
      searchUsers(query);
    } else {
      searchRepos(query);
    }
  }
});

// Function to search users by name
function searchUsers(query) {
  fetch(`${userSearchUrl}${query}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json'
    }
  })
    .then((response) => response.json())
    .then((data) => {
      displayUsers(data.items);
    })
    .catch((error) => {
      console.error('Error fetching users:', error);
    });
}

// Function to display users in the DOM
function displayUsers(users) {
  userList.innerHTML = ''; // Clear previous results
  users.forEach(user => {
    const userItem = document.createElement('li');
    userItem.innerHTML = `
      <a href="${user.html_url}" target="_blank">
        <img src="${user.avatar_url}" alt="${user.login}" width="50" height="50">
        ${user.login}
      </a>
    `;
    userItem.addEventListener('click', () => fetchUserRepos(user.login));
    userList.appendChild(userItem);
  });
}

// Function to fetch and display repositories for a specific user
function fetchUserRepos(username) {
  fetch(`${userReposUrl}${username}/repos`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json'
    }
  })
    .then((response) => response.json())
    .then((data) => {
      displayRepos(data);
    })
    .catch((error) => {
      console.error('Error fetching repositories:', error);
    });
}

// Function to display repositories in the DOM
function displayRepos(repos) {
  repoList.innerHTML = ''; // Clear previous results
  repos.forEach(repo => {
    const repoItem = document.createElement('li');
    repoItem.innerHTML = `
      <a href="${repo.html_url}" target="_blank">
        ${repo.name}
      </a>
    `;
    repoList.appendChild(repoItem);
  });
}

// Toggle the search type between users and repos
searchTypeBtn.addEventListener('click', () => {
  isUserSearch = !isUserSearch; // Toggle search type
  searchTypeBtn.textContent = isUserSearch ? 'Search Repositories' : 'Search Users'; // Update button text
});


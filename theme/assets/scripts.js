console.log('Theme loaded');
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname === '/pages/leaderboard') {
    fetch('http://localhost:3000/leaderboard/top100')
      .then(response => response.json())
      .then(data => {
        const list = document.getElementById('leaderboard-list');
        list.innerHTML = '';
        data.forEach((user, index) => {
          const entry = document.createElement('p');
          entry.textContent = `#${index + 1}: ${user.tier} - ${user.points} points`;
          list.appendChild(entry);
        });
      })
      .catch(error => console.error('Error fetching leaderboard:', error));
  }
});
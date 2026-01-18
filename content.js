function getFriendsInGame() {
  const tiles = document.querySelectorAll('.friends-carousel-tile');
  const friends = [];
  tiles.forEach(tile => {
    const icon = tile.querySelector('.game.icon-game');
    if (icon) {
      friends.push({
        username: tile.querySelector('.friends-carousel-display-name')?.innerText || 'Unknown',
        game: icon.getAttribute('title') || 'Unknown game',
        avatar: tile.querySelector('img')?.src || ''
      });
    }
  });
  return friends;
}

let prev = {};
function checkUpdates() {
  const curr = getFriendsInGame();
  const updates = curr.filter(f => !prev[f.username] || prev[f.username].game !== f.game);
  if (updates.length) {
    chrome.runtime.sendMessage({ type: 'updateFriends', friends: curr });
  }
  prev = Object.fromEntries(curr.map(f => [f.username, f]));
}

setInterval(checkUpdates, 10000);
checkUpdates();

async function loadFriends() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab.url.includes('roblox.com/home')) {
    document.getElementById('friendList').innerHTML =
      '<p style="color:#888;">Please open <b>https://www.roblox.com/home</b> to view friends.</p>';
    return;
  }

  // Fetch live data from Roblox page
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
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
  }).then(results => {
    const friends = results[0].result;
    const container = document.getElementById('friendList');
    container.innerHTML = '';
    if (!friends.length) {
      container.innerHTML = '<p style="color:#888;">No friends in-game.</p>';
      return;
    }

    friends.forEach(f => {
      const div = document.createElement('div');
      div.style.cssText = 'display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #333;padding:6px 0;';
      div.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;">
          <img src="${f.avatar}" style="width:32px;height:32px;border-radius:50%;">
          <div style="line-height:1.2;">
            <b style="color:#00ff99;">${f.username}</b><br>
            <span style="color:#bbb;font-size:11px;">Playing: ${f.game}</span>
          </div>
        </div>
        <button style="background:linear-gradient(180deg,#00b06f 0%,#00a65a 100%);border:1px solid #008f4a;color:#fff;font-weight:bold;border-radius:6px;padding:4px 10px;cursor:pointer;">Play</button>
      `;
      container.appendChild(div);
    });
  });
}

document.addEventListener('DOMContentLoaded', loadFriends);

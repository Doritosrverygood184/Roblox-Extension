let friendData = {};

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === 'updateFriends') {
    const newFriends = msg.friends;
    newFriends.forEach(f => {
      if (!friendData[f.username] || friendData[f.username].game !== f.game) {
        friendData[f.username] = f;
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          const activeTab = tabs[0];
          if (!activeTab.url.includes('roblox.com')) {
            chrome.scripting.executeScript({
              target: { tabId: activeTab.id },
              func: showNotificationOverlay,
              args: [f]
            });
          }
        });
      }
    });
  }
});

function showNotificationOverlay(friend) {
  const old = document.getElementById('robloxNotif_' + friend.username);
  if (old) old.remove();

  const notif = document.createElement('div');
  notif.id = 'robloxNotif_' + friend.username;
  Object.assign(notif.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '280px',
    height: '85px',
    background: '#2c2c2c',
    border: '1px solid #444',
    borderRadius: '6px',
    padding: '8px 10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
    fontSize: '13px',
    zIndex: '999999',
    opacity: '0',
    transition: 'opacity 0.3s ease'
  });

  const row = document.createElement('div');
  Object.assign(row.style, { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flex: '1' });

  const left = document.createElement('div');
  Object.assign(left.style, { display: 'flex', alignItems: 'center', gap: '8px', flex: '1' });
  left.innerHTML = `
    <img src="${friend.avatar}" style="width:40px;height:40px;border-radius:50%;">
    <div style="line-height:1.2;">
      <b style="color:#00ff99;">${friend.username}</b><br>
      <span style="color:#bbb;font-size:11px;">Now playing: ${friend.game}</span>
    </div>
  `;

  const playBtn = document.createElement('button');
  playBtn.textContent = 'Play';
  Object.assign(playBtn.style, {
    background: 'linear-gradient(180deg, #00b06f 0%, #00a65a 100%)',
    border: '1px solid #008f4a',
    color: '#fff',
    fontWeight: 'bold',
    borderRadius: '6px',
    padding: '6px 14px',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'background 0.2s ease, transform 0.1s ease',
    boxShadow: '0 2px 0 #007c3f'
  });
  playBtn.onmouseenter = () => {
    playBtn.style.background = 'linear-gradient(180deg, #00c67a 0%, #00b66a 100%)';
    playBtn.style.transform = 'scale(1.04)';
  };
  playBtn.onmouseleave = () => {
    playBtn.style.background = 'linear-gradient(180deg, #00b06f 0%, #00a65a 100%)';
    playBtn.style.transform = 'scale(1)';
  };
  playBtn.onclick = () => alert('Open Roblox homepage to join this friend.');

  row.appendChild(left);
  row.appendChild(playBtn);
  notif.appendChild(row);

  const barWrap = document.createElement('div');
  Object.assign(barWrap.style, { width: '100%', height: '4px', background: '#333', borderRadius: '3px', overflow: 'hidden' });
  const bar = document.createElement('div');
  Object.assign(bar.style, { width: '0%', height: '100%', background: '#00ff99', transition: 'width 0.1s linear' });
  barWrap.appendChild(bar);
  notif.appendChild(barWrap);

  document.body.appendChild(notif);
  setTimeout(() => (notif.style.opacity = '1'), 10);

  let progress = 0;
  const dur = 10000;
  const step = 100;
  const timer = setInterval(() => {
    progress += (step / dur) * 100;
    bar.style.width = `${progress}%`;
    if (progress >= 100) clearInterval(timer);
  }, step);

  setTimeout(() => {
    notif.style.opacity = '0';
    setTimeout(() => notif.remove(), 500);
  }, dur);
}

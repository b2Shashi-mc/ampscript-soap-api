document.addEventListener('DOMContentLoaded', () => {
  populateObjectList();
});

const sfmcObjects = [
  'Account', 'AccountUser', 'Automation', 'BounceEvent', 'ClickEvent',
  'DataExtension', 'ListSubscribers', 'NotSentEvent', 'OpenEvent',
  'QueryDefinition', 'SendSummary', 'SentEvent',
  'Subscribers', 'TriggeredSendSummary', 'UnsubEvent'
];

function populateObjectList() {
  const listContainer = document.getElementById('object-list');
  sfmcObjects.forEach(obj => {
    const item = document.createElement('div');
    item.className = 'list-item';
    item.textContent = obj;
    item.addEventListener('click', () => selectObject(item, obj));
    listContainer.appendChild(item);
  });
}

function selectObject(selectedEl, objectName) {
  document.querySelectorAll('.list-item').forEach(el => el.classList.remove('selected'));
  selectedEl.classList.add('selected');

  const button = document.getElementById('generate-code');
  button.disabled = false;
  button.textContent = `Generate AMPScript for ${objectName}`;
  button.dataset.object = objectName;
}

async function fetchCode(objectName) {
  const url = `https://api.github.com/repos/b2Shashi-mc/ampscript-soap-api/contents/${objectName}.amp`;
  try {
    const res = await fetch(url, { headers: { Accept: 'application/vnd.github.v3.raw' } });
    if (!res.ok) throw new Error('GitHub fetch failed');
    return await res.text();
  } catch (err) {
    alert("Error fetching the code. Please try again.");
    console.error(err);
    return null;
  }
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

document.getElementById('generate-code').addEventListener('click', async e => {
  const objectName = e.target.dataset.object;
  if (!objectName) return;

  const code = await fetchCode(objectName);
  if (code) {
    await navigator.clipboard.writeText(code);
    showToast('AMPScript copied to clipboard!');
  }
});

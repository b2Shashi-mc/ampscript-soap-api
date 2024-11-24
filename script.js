document.addEventListener('DOMContentLoaded', () => {
    populateObjectList();
});

// List of SOAP API objects
const sfmcObjects = ['Account', 'AccountUser', 'Automation', 
                    'BounceEvent', 'ClickEvent','DataExtension',
                    'ListSubscribers','NotSentEvent','OpenEvent',
                    'QueryDefinition','SendSummary','SentEvent',
                    'Subscribers','TriggeredSendSummary','UnsubEvent'];

// Function to populate the object list
function populateObjectList() {
    const listContainer = document.getElementById('object-list');
    sfmcObjects.forEach(obj => {
        const listItem = document.createElement('div');
        listItem.className = 'list-item';
        listItem.innerHTML = `
            <input type="radio" name="sfmcObject" value="${obj}" id="${obj}">
            <label for="${obj}">${obj}</label>
        `;
        listItem.addEventListener('click', () => selectItem(listItem, obj));
        listContainer.appendChild(listItem);
    });
}

// Function to handle item selection
function selectItem(item, objectName) {
    // Remove 'selected' class from all items
    const allItems = document.querySelectorAll('.list-item');
    allItems.forEach(i => i.classList.remove('selected'));

    // Add 'selected' class to the clicked item
    item.classList.add('selected');

    // Update button text
    const button = document.getElementById('generate-code');
    button.textContent = `Generate Code for ${objectName}`;
}

// Function to fetch code from GitHub
async function fetchCodeFromGitHub(objectName) {
    const githubUrl = `https://api.github.com/repos/b2Shashi-mc/ampscript-soap-api/contents/${objectName}.amp`;
    try {
        const response = await fetch(githubUrl, {
            headers: {
                'Accept': 'application/vnd.github.v3.raw' // Fetch raw content
            }
        });
        if (!response.ok) throw new Error('Failed to fetch code');
        return await response.text();
    } catch (error) {
        alert("Error fetching code. Please try again later.");
        console.error(error);
        return null;
    }
}

// Function to copy text to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const modal = document.getElementById("copyModal");
        modal.classList.add("show");

        // After 3 seconds, fade out the modal
        setTimeout(() => {
            modal.classList.remove("show");
        }, 2000); // 2 seconds
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

// Event listener for the "Generate Code" button
document.getElementById('generate-code').addEventListener('click', async () => {
    const selectedObject = document.querySelector('input[name="sfmcObject"]:checked');
    if (!selectedObject) {
        alert('Please select a SOAP API object.');
        return;
    }

    const objectName = selectedObject.value;
    const code = await fetchCodeFromGitHub(objectName);
    if (code) {
        copyToClipboard(code);
    } else {
        alert('Failed to fetch or copy code.');
    }
});

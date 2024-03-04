document.addEventListener('mouseover', function (event) {
    chrome.storage.sync.get(['extensionEnabled', 'bot_dict'], function (data) {
        if (data.extensionEnabled) {
            let target = event.target;
            if (isTargetValid(target)) {
                handleTargetHover(target, data.bot_dict || {});
            }
        }
    });
});

function isTargetValid(target) {
    const isLargeEnough = target.offsetWidth > 200 && target.offsetHeight > 200;
    const isImage = target.tagName === 'IMG';
    // Split URL by '?' and check the first part for file extensions
    const imgUrl = target.src.split('?')[0];
    const isGif = isImage && (imgUrl.endsWith('.gif') || imgUrl.endsWith('.webp') || imgUrl.endsWith('.gifv'));
    const isVideoWithSrc = target.tagName === 'VIDEO' && target.hasAttribute('src');
    const isVideoWithSourceTag = target.tagName === 'VIDEO' && target.querySelector('source') !== null;

    return (isLargeEnough && isImage) || isGif || isVideoWithSrc || isVideoWithSourceTag;
}




function handleTargetHover(target, bot_dict) {
    let debounceTimer;
    const triggerButton = createTriggerButton();

    positionTriggerButtonNearTarget(triggerButton, target);

    target.addEventListener('mouseenter', () => showOptionsButton(debounceTimer, triggerButton));
    target.addEventListener('mouseleave', () => hideOptionsButton(debounceTimer, triggerButton));

    triggerButton.addEventListener('mouseenter', () => showOptionsButton(debounceTimer, triggerButton));
    triggerButton.addEventListener('mouseleave', () => hideOptionsButton(debounceTimer, triggerButton));

    triggerButton.onclick = function () {
        displayPopupMenu(bot_dict, triggerButton, target);
    };
}

function createTriggerButton() {
    let triggerButton = document.createElement('button');
    triggerButton.className = 'trigger-button';
    triggerButton.id = 'triggerButton';
    triggerButton.textContent = 'Save';


    document.body.appendChild(triggerButton);

    return triggerButton;
}

function positionTriggerButtonNearTarget(triggerButton, target) {
    const rect = target.getBoundingClientRect();
    triggerButton.style.left = `${rect.left + window.scrollX}px`;
    triggerButton.style.top = `${rect.top + window.scrollY - triggerButton.offsetHeight}px`;
}

function showOptionsButton(debounceTimer, triggerButton) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        triggerButton.style.display = 'block';
    }, 100); // Adjust delay as needed.
}

function hideOptionsButton(debounceTimer, triggerButton) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        triggerButton.style.display = 'none';
    }, 100); // Adjust delay as needed.
}

function displayPopupMenu(bot_dict, triggerButton, target) {
    let menu = createPopupMenu();
    populateMenuWithBotActions(bot_dict, menu, target);
    positionMenuUnderButton(menu, triggerButton);
}

function createPopupMenu() {
    let existingMenu = document.getElementById('botDictMenu');
    if (existingMenu) existingMenu.remove();

    let menu = document.createElement('div');
    menu.className = 'bot-dict-menu';

    let exitButton = document.createElement('button');
    exitButton.textContent = 'Exit';
    exitButton.className = 'bot-dict-menu-button'

    exitButton.onclick = function () {
        menu.remove();
    };
    menu.appendChild(exitButton);

    return menu;
}

function populateMenuWithBotActions(bot_dict, menu, target) {
    Object.entries(bot_dict).forEach(([key, value]) => {
        let button = document.createElement('button');
        button.className = 'bot-dict-menu-button';
        button.textContent = key; // 'key' variable for the button text

        button.onclick = function () {
            sendImageToTelegram(target, value);
            menu.remove();
        };
        menu.appendChild(button);
    });

    document.body.appendChild(menu);
}


function positionMenuUnderButton(menu, triggerButton) {
    const buttonRect = triggerButton.getBoundingClientRect();
    menu.style.left = `${buttonRect.left + window.scrollX}px`;
    menu.style.top = `${buttonRect.bottom + window.scrollY}px`;
}

function sendImageToTelegram(target, chat_id) {
    let imageUrl = getImageUrlFromTarget(target);

    fetch('https://localhost:5000/fetch_and_send_to_telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: imageUrl, chat_id: chat_id }),
    })
    .then(response => response.json())
    .then(result => console.log('Success:', result))
    .catch(error => console.error('Error:', error));
}

function getImageUrlFromTarget(target) {
    if (target.hasAttribute('srcset')) {
        let srcset = target.getAttribute('srcset').split(',').map(src => {
            let parts = src.trim().split(' ');
            return { url: parts[0], width: parseInt(parts[1], 10) };
        });
        srcset.sort((a, b) => b.width - a.width);
        return srcset[0].url;
    }
    // Check for image src
    else if (target.src) {
        return target.src;
    }
    // Check for video source
    else if (target.tagName.toLowerCase() === 'video') {
        if (target.hasAttribute('src')) {
            return target.src;
        } else {
            let sources = target.getElementsByTagName('source');
            return sources.length > 0 ? sources[0].src : '';
        }
    }
    return '';
}
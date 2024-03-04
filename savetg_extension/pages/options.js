document.addEventListener('DOMContentLoaded', function() {
    // Load and display existing bot_dict entries
    function updateBotList() {
        chrome.storage.sync.get(['bot_dict'], function(data) {
            const botList = data.bot_dict || {};
            const listElement = document.getElementById('botList');
            listElement.innerHTML = ''; // Clear existing list
            Object.entries(botList).forEach(([chat_name, chat_id]) => {
              const item = document.createElement('div');

              // Create a delete button for each item
              const deleteBtn = document.createElement('button');
              deleteBtn.textContent = 'X';
              deleteBtn.onclick = function() {
                  // Remove this entry from bot_dict
                  delete botList[chat_name];
                  chrome.storage.sync.set({ 'bot_dict': botList }, function() {
                      updateBotList(); // Refresh the list after deletion
                  });
              };

              // Append the delete button before the text content
              item.appendChild(deleteBtn);

              // Append the text content after the delete button
              const textContent = document.createTextNode(`${chat_name}: ${chat_id}`);
              item.appendChild(textContent);

              listElement.appendChild(item);
          });

        });
    }

    updateBotList(); // Initial list update

    document.getElementById('save').addEventListener('click', function() {
        const chat_id = document.getElementById('chat_id').value;
        const chat_name = document.getElementById('chat_name').value;
        if (!chat_id || !chat_name) {
            alert('Both Chat ID and Chat Name are required.');
            return;
        }
        chrome.storage.sync.get(['bot_dict'], function(data) {
            const bot_dict = data.bot_dict || {};
            bot_dict[chat_name] = chat_id; // Add or update the entry
            chrome.storage.sync.set({ 'bot_dict': bot_dict }, function() {
                console.log('Bot dict updated');
                updateBotList(); // Refresh the list

                // Clear the input fields
                document.getElementById('chat_id').value = '';
                document.getElementById('chat_name').value = '';
            });
        });
    });

    document.getElementById('addDict').addEventListener('click', function() {
        const dictInput = document.getElementById('dictInput').value;
        try {
            const inputDict = JSON.parse(dictInput); // Parse input string to object
            if (typeof inputDict !== 'object' || Array.isArray(inputDict)) {
                alert('Please enter a valid JSON object.');
                return;
            }
            chrome.storage.sync.get(['bot_dict'], function(data) {
                const bot_dict = data.bot_dict || {};
                Object.keys(inputDict).forEach(key => {
                    bot_dict[key] = inputDict[key]; // Merge or overwrite entries
                });
                chrome.storage.sync.set({ 'bot_dict': bot_dict }, function() {
                    console.log('Bot dict updated with new dictionary');
                    updateBotList(); // Refresh the list

                    // Optionally clear the text area
                    document.getElementById('dictInput').value = '';
                });
            });
        } catch (e) {
            alert('Invalid JSON format.');
        }
    });

    document.getElementById('turnOn').addEventListener('click', function() {
        chrome.storage.sync.set({ 'extensionEnabled': true }, function() {
            console.log('Extension is turned on');
            alert('Extension turned on successfully!');
            // Update UI or do additional tasks as needed
        });
    });

    document.getElementById('turnOff').addEventListener('click', function() {
        chrome.storage.sync.set({ 'extensionEnabled': false }, function() {
            console.log('Extension is turned off');
            alert('Extension turned off successfully!');
            // Update UI or do additional tasks as needed
        });
    });
});

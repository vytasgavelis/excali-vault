const websiteName = 'https://excalidraw.com/';
const USER_DIAGRAMS_STATE_KEY_NAME = "excalidraw";

document.getElementById("print-storage-button").addEventListener("click", () => {
    chrome.storage.local.get(USER_DIAGRAMS_STATE_KEY_NAME, function(data) {
       if (Object.keys(data).length === 0) {
           console.log('storage empty');
           console.log(data);
       } else {
           console.log('storage not empty');
           console.log(data);
       }
    });

});

document.getElementById("print-storage-button").addEventListener("click", () => {
    chrome.storage.local.clear();
})

document.getElementById("save-button").addEventListener("click", async () => {
    const name = document.getElementById("drawing-name").value;
    // chrome.storage.local.get(USER_DIAGRAMS_STATE_KEY_NAME, function(data) {
    //     console.log('Value of myKey:', data["excalidraw"]);
    //     const item = {};
    //     item[name] = data["excalidraw"];
    //     chrome.storage.local.set(item, function () {
    //         console.log('Settings saved');
    //     });
    // });


    // Get the active tab
    const tabs = await chrome.tabs.query({active: true, currentWindow: true});
    const tabId = tabs[0].id;

    // Call the function and get the value using await
    const diagram = await getDiagramFromTab(tabId);
    console.log(diagram);
    // const currentDiagram = localStorage.getItem("excalidraw");
    // let currentList = localStorage.getItem("diagramsList");
    // if (currentList === null) {
    //     const newCurrentList = [];
    //     localStorage.setItem("diagramsList", JSON.stringify(newCurrentList));
    // }

    chrome.storage.local.get(USER_DIAGRAMS_STATE_KEY_NAME, function(data) {
        if (Object.keys(data).length === 0) {
            const currentList = [];
        } else {
            const currentList = data;
        }

        console.log(diagram);
    });
});

function getDiagramFromTab(tabId) {
    return new Promise((resolve, reject) => {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: () => {
                const value = localStorage.getItem("excalidraw");

                // Resolve the Promise with the value
                resolve(value);
            },
        });
    });
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.key === "excalidraw") {
        console.log('value in local storage:')
        const diagramData = message.value;
        // const value = message.value;
        // // handle the value
        // console.log(value);
        // chrome.storage.local.set({excalidraw: value}, function() {
        //     console.log("Value set in local storage");
        // });
        // console.log("value in local storage");
    }
});



//
// document.getElementById("reload-button").addEventListener("click", () => {
//     chrome.storage.local.get(null, function(items) {
//         var allKeys = Object.keys(items);
//         // Get the parent element where the list will be appended
//         const parentElement = document.getElementById("parent");
//         parentElement.innerHTML = "";
//
//         // Create an unordered list element
//         const ul = document.createElement("ul");
//
//         // Loop through the allKeys and create list items
//         for (let i = 0; i < allKeys.length; i++) {
//             const li = document.createElement("li"); // Create a list item element
//             li.textContent = allKeys[i]; // Set the text content of the list item
//             ul.appendChild(li); // Append the list item to the unordered list element
//         }
//
//         // Append the unordered list to the parent element
//         parentElement.appendChild(ul);
//
//         const li_objects = document.querySelectorAll("li")
//
//         for (let i = 0; i < li_objects.length; i++) {
//             li_objects[i].addEventListener("click", function() {
//                 chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//                     const tabId = tabs[0].id;
//                     const value = items[allKeys[i]];
//                     chrome.scripting.executeScript({
//                         target: {tabId: tabId},
//                         func: (value) => {
//                             localStorage.setItem("excalidraw", value);
//                         },
//                         args: [value]
//                     });
//                 });
//             });
//         }
//     });
// });
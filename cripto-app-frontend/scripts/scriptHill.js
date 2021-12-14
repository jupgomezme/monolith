const apiEndpoint = "https://ktfcs3i7n0.execute-api.us-east-1.amazonaws.com/prod/main";

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ '

const textChecker = (allegedValidText) => {
    allegedValidText = allegedValidText.toUpperCase();

    for (let i = 0; i < allegedValidText.length; i++) {
        const char = allegedValidText[i]
        if (!letters.includes(char)) {
            return false
        }
    }

    return true

}

function createTable(tableData) {
    var table = document.createElement('table');
    var tableBody = document.createElement('tbody');
  
    tableData.forEach(function(rowData) {
      var row = document.createElement('tr');
  
      rowData.forEach(function(cellData) {
        var cell = document.createElement('td');
        cell.style.padding = "10px"
        cell.appendChild(document.createTextNode(cellData));
        row.appendChild(cell);
      });
  
      tableBody.appendChild(row);
    });
  
    table.appendChild(tableBody);

    const cardEncryptionKey = document.getElementById("cardEncryptionKey");
    cardEncryptionKey.innerHTML = "";
    cardEncryptionKey.appendChild(table);
  }

const onClickFormEncrypt = () => {
    const inputTextValue = document.getElementById("inputTextEncrypt").value;
    const inputKeyValue = document.getElementById("inputKeyEncrypt").value;

    if (!inputTextValue) {
        alert("Please introduce some text!")
        return;
    }

    if (!textChecker(inputTextValue)) {
        alert("Please use alphabetic characters exclusively");
        return;
    }

    if (inputKeyValue) {
        if (!textChecker(inputKeyValue)) {
            alert("Please introduce a valid key!")
            return;
        }
    }

    const data = {
        algorithm: "hill",
        action: "cipher",
        data: inputTextValue.toUpperCase(),
        key: inputKeyValue.toUpperCase()
    }

    fetch(apiEndpoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((response) => {
        return response.json()
    }).then((responseJson) => {
        const { data_processed } = responseJson;

        if (data_processed === "Invalid key") {
            alert("You entered a wrong key, please review!")
            return;
        }


        const cardEncryptionText = document.getElementById("cardEncryptionText");


        const encryptionResultsDiv = document.getElementById("encryptionResultsDiv");
        encryptionResultsDiv.style.display = "flex";

        cardEncryptionText.innerHTML = data_processed[0]
        createTable(data_processed[1])

    }).catch((error) => {
        console.log("Error with request to the Api!")
        console.log(error)
    })

}

const submitButtonEncrypt = document.getElementById("submitButtonEncrypt")
submitButtonEncrypt.addEventListener("click", onClickFormEncrypt)




const onClickFormDecrypt = () => {
    const inputTextValue = document.getElementById("inputTextDecrypt").value;
    const inputKeyValue = document.getElementById("inputKeyDecrypt").value;

    if (!inputTextValue) {
        alert("Please introduce some text!")
        return;
    }

    if (!textChecker(inputTextValue)) {
        alert("Please use alphabetic characters exclusively");
        return;
    }

    if (!inputKeyValue) {
        alert("Please introduce the key!")
        return;
    }

    if (!textChecker(inputKeyValue)) {
        alert("Please introduce a valid key!")
        return;
    }

    const data = {
        algorithm: "hill",
        action: "decipher",
        data: inputTextValue.toUpperCase(),
        key: inputKeyValue.toUpperCase()
    }

    fetch(apiEndpoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((response) => {
        return response.json()
    }).then((responseJson) => {
        const { data_processed } = responseJson;

        if (data_processed === "Invalid key") {
            alert("You entered a wrong key, please review!")
            return;
        }

        const cardDecryptionText = document.getElementById("cardDecryptionText");

        const decryptionResultsDiv = document.getElementById("decryptionResultsDiv");
        decryptionResultsDiv.style.display = "flex";

        cardDecryptionText.innerHTML = data_processed[0]

    }).catch((error) => {
        alert("You entered a wrong key, please review!")
        console.log("Error with request to the Api!")
        console.log(error)
    })

}

const submitButtonDecrypt = document.getElementById("submitButtonDecrypt")
submitButtonDecrypt.addEventListener("click", onClickFormDecrypt)


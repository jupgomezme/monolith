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

const onClickFormEncrypt = () => {
    const inputTextValue = document.getElementById("inputTextEncrypt").value;

    if (!inputTextValue) {
        alert("Please introduce some text!")
        return;
    }

    if (!textChecker(inputTextValue)) {
        alert("Please use alphabetic characters exclusively");
        return;
    }

    const data = {
        algorithm: "displacementAnalysis",
        action: null,
        data: inputTextValue.toUpperCase(),
        key: null
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

        const cardEncryptionText = document.getElementById("cardEncryptionText");
        const cardEncryptionKey = document.getElementById("cardEncryptionKey");


        const encryptionResultsDiv = document.getElementById("encryptionResultsDiv");
        encryptionResultsDiv.style.display = "flex";

        cardEncryptionText.innerHTML = data_processed[0]
        cardEncryptionKey.innerHTML = data_processed[1]

    }).catch((error) => {
        console.log("Error with request to the Api!")
        console.log(error)
    })

}

const submitButtonEncrypt = document.getElementById("submitButtonEncrypt")
submitButtonEncrypt.addEventListener("click", onClickFormEncrypt)



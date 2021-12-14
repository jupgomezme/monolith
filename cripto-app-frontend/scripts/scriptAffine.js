const apiEndpoint = "https://ktfcs3i7n0.execute-api.us-east-1.amazonaws.com/prod/main";

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ '
const numbersAndComma = "0123456789,"

const MCD = (a, b) => {
    let temporal; //Para no perder b
    while (b !== 0) {
        temporal = b;
        b = a % b;
        a = temporal;
    }
    return a;
};

const keyChecker = (allegedKeyString) => {

    for (let i = 0; i < allegedKeyString.length; i++) {
        const char = allegedKeyString[i]
        if (!numbersAndComma.includes(char)) {
            return false
        }
    }

    let allegedKey;
    try {
        allegedKey = allegedKeyString.split(",").map((element) => {
            return parseInt(element)
        });
    } catch (error) {
        return false;
    }
    if (allegedKey.length !== 2) {
        return false
    }
    const a = allegedKey[0];
    const b = allegedKey[1];

    if (typeof a !== "number" || typeof b !== "number") {
        return false
    }

    if (a <= 0 || a >= 26 || b <= 0 || b >= 26) {
        return false
    }

    if (MCD(a, 26) != 1) {
        return false
    }

    return true


}

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
        if (!keyChecker(inputKeyValue)) {
            alert("Please introduce a valid key!")
            return;
        }
    }

    let finalKey = null;
    if (inputKeyValue) {
        finalKey = inputKeyValue.split(",").map((element) => {
            return parseInt(element)
        })
    }

    const data = {
        algorithm: "affine",
        action: "cipher",
        data: inputTextValue.toUpperCase(),
        key: finalKey
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




const onClickFormDecrypt = () => {
    const inputTextValue = document.getElementById("inputTextDecrypt").value;
    const inputKeyValue = document.getElementById("inputKeyDecrypt").value;

    if (!inputTextValue) {
        alert("Please introduce the text!")
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

    if (!keyChecker(inputKeyValue)) {
        alert("Please introduce a valid key!")
        return;
    }

    const data = {
        algorithm: "affine",
        action: "decipher",
        data: inputTextValue.toUpperCase(),
        key: inputKeyValue.split(",").map((element) => {
            return parseInt(element)
        })
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

        const cardDecryptionText = document.getElementById("cardDecryptionText");

        const decryptionResultsDiv = document.getElementById("decryptionResultsDiv");
        decryptionResultsDiv.style.display = "flex";

        cardDecryptionText.innerHTML = data_processed[0]

    }).catch((error) => {
        console.log("Error with request to the Api!")
        console.log(error)
    })

}

const submitButtonDecrypt = document.getElementById("submitButtonDecrypt")
submitButtonDecrypt.addEventListener("click", onClickFormDecrypt)
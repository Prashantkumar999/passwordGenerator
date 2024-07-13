const ipSlider = document.getElementById('slider');
const ipassLength = document.getElementById('passlen');
const passwordWindow = document.getElementById('passwordDisplay');
const upperCaseCheck = document.getElementById('uppercase');
const lowerCaseCheck = document.getElementById('lowercase');
const numbersCheck = document.getElementById('numbers');
const symbolsCheck = document.getElementById('symbols');
const copyMsgText = document.getElementById('copymsg');
const copyBtn = document.getElementById('copy-btn');
const genBtn = document.getElementById('generateBtn');
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const colorIndicator = document.getElementById('indicator');
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

// Note: This line is now fixed
// default values
let password = "";
let passLength = 10;
let checkCount = 1;

handleSlider();

// set password length
function handleSlider() {
    ipSlider.value = passLength;
    ipassLength.innerText = passLength;
}

// set indicator
function setIndicator(color) {
    colorIndicator.style.backgroundColor = color;
}

// get random numbers
function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomNumber() {
    return getRandomInteger(0, 9);
}

// generate lowercase
function generateLowerCase() {
    return String.fromCharCode(getRandomInteger(97, 127)); // Fixed range for lowercase
}

// generate uppercase
function generateUpperCase() {
    return String.fromCharCode(getRandomInteger(65, 91)); // Fixed range for uppercase
}

// generate symbols
function geneateSymbol() { // Typo corrected
    const randomSymbol = getRandomInteger(0, symbols.length);
    return symbols.charAt(randomSymbol);
}


// calculate strength
function passwordStrengthCal() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;
    if (upperCaseCheck.checked) hasUpper = true;
    if (lowerCaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNumber = true;
    if (symbolsCheck.checked) hasSymbol = true;
    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passLength >= 8) {
        setIndicator("#0f0");
    } else if ((hasLower || hasUpper) && (hasNumber || hasSymbol) && passLength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}




async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordWindow.value);
        copyMsgText.innerHTML = "Copied";
    } catch (error) {
        copyMsgText.innerText = 'Failed';
    }

    copyMsgText.style.display = 'block';
    copyBtn.style.display = 'none';

    setTimeout(() => {
        copyMsgText.style.display = 'none';
        copyBtn.style.display = 'block';
    }, 2000);
}



// shuffle password
function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


// on checkbox change
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    });

    //special condition
    if (passLength < checkCount) {
        passLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckBoxChange);
})



ipSlider.addEventListener('input', (e) => {
    passLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener("click", () => {
    if (passwordWindow.value) {
        copyContent();
    }
})


genBtn.addEventListener('click', () => {
    if (checkCount == 0) {
        return;
    }

    if (passLength < checkCount) {
        passLength = checkCount;
        handleSlider();
    }

    //remove old password
    password = "";

    //let's put the stuff mentioned by checkboxes

    let funArr = [];

    if (upperCaseCheck.checked) {
        funArr.push(generateUpperCase);
    }

    if (lowerCaseCheck.checked) {
        funArr.push(generateLowerCase);
    }

    if (symbolsCheck.checked) {
        funArr.push(geneateSymbol);
    }

    if (numbersCheck.checked) {
        funArr.push(getRandomNumber);
    }


    //compulsory adddition
    for (let i = 0; i < funArr.length; i++) {
        password += funArr[i]();
    }


    //remaining adddition
    for (let i = 0; i < passLength - funArr.length; i++) {
        let randomIndex = getRandomInteger(0, funArr.length - 1);
        password += funArr[randomIndex]();
    }

    // shuffle the password
    password = shufflePassword(Array.from(password));


    // show in UI
    passwordWindow.value = password;
    passwordStrengthCal();
})

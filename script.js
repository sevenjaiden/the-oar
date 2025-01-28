async function generateText() { 
    try {
        const response = await fetch('dedications.txt');
        if (!response.ok) {
            throw new Error('Failed to load the text file.');
        }

        const text = await response.text(); 
        const markovChain = generateMarkovChain(text);
        const randomText = generateRandomText(markovChain, 10); 

        typeWriter('output', randomText); 

    } catch (error) {
        console.error('Error:', error);
    }
}

function generateMarkovChain(text) {
    const words = text.split(/\s+/); 
    const markovChain = {};

    for (let i = 0; i < words.length - 1; i++) {
        const word = words[i];
        const nextWord = words[i + 1];

        if (!markovChain[word]) {
            markovChain[word] = [];
        }
        markovChain[word].push(nextWord);
    }

    return markovChain;
}

function generateRandomText(markovChain, maxLength) {
    const keys = Object.keys(markovChain);
    const sentenceEnders = ['.', '!', '?'];

    const capitalizedWords = keys.filter(word => /^[A-Z]/.test(word));


    let word = capitalizedWords[Math.floor(Math.random() * capitalizedWords.length)] || keys[Math.floor(Math.random() * keys.length)];
    let result = [word];

    for (let i = 0; i < maxLength - 1; i++) {
        const nextWords = markovChain[word];
        if (!nextWords || nextWords.length === 0) break;
        word = nextWords[Math.floor(Math.random() * nextWords.length)];
        result.push(word);

     
        if (sentenceEnders.includes(word[word.length - 1])) {
            break;
        }
    }

  
    let lastWord = result[result.length - 1];
    if (!sentenceEnders.includes(lastWord[lastWord.length - 1])) {
        result[result.length - 1] += '.';
    }

    return result.join(' ');
}

//type itself out
function typeWriter(elementId, text, delay = 150) {
    let i = 0;
    const targetElement = document.getElementById(elementId);
    targetElement.textContent = ''; 

    function type() {
        if (i < text.length) {
            targetElement.textContent += text.charAt(i);
            i++;
            setTimeout(type, delay);
        }
    }

    type();
}

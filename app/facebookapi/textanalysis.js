import natural from 'natural';
import stopwords from './stopwords'
import types from '../reducers/types'

function turnMessagesIntoDocuments(messages: types.messagesType, timeperiod = 3600 * 3) { // 3600 is 1 hour
    messages.reverse();
    const documents = [];
    let document = [];
    let messageIndex = 0;
    while (messageIndex < messages.length - 1) {
        const currentMessage = messages[messageIndex];
        const nextMessage = messages[messageIndex + 1];
        if (nextMessage.timestamp_ms - currentMessage.timestamp_ms < timeperiod * 1000) {
            document.push(currentMessage)
        } else if (document.length !== 0) {
            documents.push(document)
            document = []
        }
        messageIndex += 1;
    }

    // push last document
    if (typeof messages[messageIndex] !== "undefined") {
        document.push(messages[messageIndex])
        documents.push(document)
    }
    
    const tokenizer = new natural.WordTokenizer();

    return documents.map(document => {
        const words = []
        document.forEach(message => {
            tokenizer.tokenize(message.content.toLowerCase())
                .filter(word => stopwords.indexOf(word) < 0) // stop words
                .filter(word =>  !(/^\d+$/.test(word))) // digits
                .forEach(word => { words.push(word) })
        })
        return words
    })
}

function isMessageTextOnly(message) {
    return !(
        (typeof message.content === "undefined") ||
        Object.prototype.hasOwnProperty.call(message, "photos") ||
        Object.prototype.hasOwnProperty.call(message, "gifs") ||
        Object.prototype.hasOwnProperty.call(message, "sticker")
    );
}

function countMessages(documents) {
    const totalDocuments = documents.length
    let totalTerms = 0;
    const count = {}
    documents.forEach(document => {
        document.forEach(word => {
            if (typeof count[word] === "undefined") {
                count[word] = { docCount: 0, wordCount: 0, messages: [] }
            }
            count[word].wordCount += 1
            totalTerms += 1
        })

        // filter to uniques and add to doccount
        document.filter(function(item, pos, self) {
            return self.indexOf(item) == pos;
        }).forEach(word => {
            count[word].docCount += 1
        })
    })
    return {
        count,
        totalDocuments,
        totalTerms
    };
}

export function analyseWordFrequency(messages: types.messagesType) {
    // copy messages
    const messagesCopy = messages.filter(message => isMessageTextOnly(message))
    // create a word frequency model
    const documents = turnMessagesIntoDocuments(messagesCopy)

    const { 
        count,
        totalDocuments,
        totalTerms
    } = countMessages(documents)

    const scores = Object.keys(count).map(word => {
        // null check to fix max's problem?
        if (!isNaN(count[word].wordCount) && !isNaN(count[word].docCount)) {
            const tf = count[word].wordCount / totalTerms
            const idf = Math.log(totalDocuments / count[word].docCount)
            const score = tf * idf
            return {word, score, tf, idf, count: count[word]}
        }
        console.error("NaN DocCount/WordCount for: ", count[word])
        return { word, score: 0, tf: 0, idf: 0, count: 0 } 
    })
    scores.sort((a, b) => b.score - a.score)

    return scores;
}
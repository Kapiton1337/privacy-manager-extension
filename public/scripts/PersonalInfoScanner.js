/*global chrome*/

(function scanForPersonalInfo() {
    const phoneNumberRegex = /(\+7|8)?\s*(\(\d{3}\)|\d{3})\s*[\- ]?\d{3}[\- ]?\d{2}[\- ]?\d{2}/g;
    const birthDateRegex = /\d{2}(?:[./-]|(?:\s?янв(?:аря)?|фев(?:раля)?|мар(?:та)?|апр(?:еля)?|мая|июн(?:я)?|июл(?:я)?|авг(?:уста)?|сен(?:тября)?|окт(?:ября)?|ноя(?:бря)?|дек(?:абря)?))\d{2}(?:[./-])?\d{4}/g;
    const bankCardRegex = /(\d{4}[ -]?){3}\d{4}/g;

    const textContent = document.body.innerText;
    const phoneNumbers = textContent.match(phoneNumberRegex);
    const birthDates = textContent.match(birthDateRegex);
    const bankCards = textContent.match(bankCardRegex);

    const foundData = {
        phoneNumbers: phoneNumbers,
        birthDates: birthDates,
        bankCards: bankCards
    };

    if ((phoneNumbers && phoneNumbers.length) || (birthDates && birthDates.length) || (bankCards && bankCards.length)) {
        chrome.runtime.sendMessage({ action: "foundInfo", data: foundData });
    }
})();



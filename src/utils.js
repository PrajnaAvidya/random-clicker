import Big from "big.js";

export default {
    round: function(value) {
        if (isNaN(value)) {
            return 0;
        }
        if (value < 10) {
            return Number((value).toFixed(1));
        } else if (value <= 999999) {
            return Math.floor(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
            // display pretty formatted number
            let displayedValue = Big(value);
            let suffixes = ["", "", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion", "decillion"];
            let index = Math.floor((displayedValue.e) / 3);
            if (index >= suffixes.length) {
                // outside of range
                return value.toExponential(3);
            }
            let suffix = suffixes[Math.floor((displayedValue.e) / 3)];
            let sigFig = (displayedValue.e % 3);
            displayedValue.e = 3 + sigFig;
            return displayedValue.div(1000).toPrecision(4 + sigFig) + ' ' + suffix;
        }
    },

    currency: function(value) {
        if (isNaN(value)) {
            return 0;
        }
        if (value <= 999999) {
            return Math.floor(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
            // display pretty formatted number
            let displayedValue = Big(value);
            let suffixes = ["", "", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion", "decillion"];
            let index = Math.floor((displayedValue.e) / 3);
            if (index >= suffixes.length) {
                // outside of range
                return value.toExponential(3);
            }
            let suffix = suffixes[Math.floor((displayedValue.e) / 3)];
            let sigFig = (displayedValue.e % 3);
            displayedValue.e = 3 + sigFig;
            return displayedValue.div(1000).toPrecision(4 + sigFig) + ' ' + suffix;
        }
    },

    convertObjectToBig: function(objectData) {
        let bigData = {};
        for (let key in objectData) {
            if (isNaN(objectData[key])) {
                bigData[key] = objectData[key];
            } else {
                bigData[key] = Big(objectData[key]);
            }
        }
        return bigData;
    },

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    },

    splitLines(input, len = 100) {
        let curr = len, prev = 0, output = [];
        
        while (input[curr]) {
            if (input[curr++] == ' ') {
                output.push(input.substring(prev,curr));
                prev = curr;
                curr += len;
            }
        }
        output.push(input.substr(prev));
        
        return output;
    }
};

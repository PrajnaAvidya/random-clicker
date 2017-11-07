import axios from 'axios';
import Utils from './utils.js';

export default {
    async getTitles(titleCount=400) {
        let redditRequest = await axios.get('https://www.reddit.com/r/SubredditSimulator.json?limit=100');
        if (redditRequest.status != 200) {
            console.log("Warning: couldn't connect to reddit API");
            return [];
        }

        let titles = [];
        let after = redditRequest.data.data.after;
        while (titles.length < titleCount) {
            redditRequest.data.data.children.forEach(function (thread) {
                if (thread.data.author != "Deimorz") {
                    titles.push(thread.data.title);
                }
            });

            redditRequest = await axios.get('https://www.reddit.com/r/SubredditSimulator.json?limit=100&after=' + redditRequest.data.data.after);
            if (redditRequest.status != 200) {
                console.log("Warning: couldn't connect to reddit API");
                return titles;
            }
        }
        
        titles = Utils.shuffleArray(titles);
        return titles;
    }
};

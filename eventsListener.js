const Web3 = require('web3');
const DiscourseAbi = require('./abi/DiscourseHub.json');
const T = require('./twit');
require('dotenv').config();



const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.INFURA_ENDPOINT_WS_RINKEBY));
let discourseHub = new web3.eth.Contract(DiscourseAbi, process.env.DISCOURSE_CONTRACT_ADDRESS);

const listenEvents = () => {
    var eventsBlocks = new Set();
    discourseHub.events.PledgeFunds({
        fromBlock: 0
    }, function (error, event) { console.log(event); })
    .on('data', function(event){
        let blockNumber = event.blockNumber;
        if (!eventsBlocks.has(blockNumber)) {
            eventsBlocks.add(blockNumber);
            // tweetFundingUpdate(event.returnValues);
        }
    })
    .on('changed', function(event){
        console.log('changed:', event);
    })
    .on('error', console.error);
}

const tweetFundingUpdate = async (data) => {
    let tweet = `${data._from} has funded ${web3.utils.fromWei(data._amount, 'ether')} ETH!`;
    let tweetId = await T.post('statuses/update', { status: tweet }).catch(err => {
        console.log('err');
    });
    console.log("tweeted: ", tweetId.id);
}

module.exports = listenEvents;
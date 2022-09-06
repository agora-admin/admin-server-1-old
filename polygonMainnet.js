const Web3 = require('web3');
const DiscourseAbi = require('./abi/DiscourseHub.json');

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.ALCHEMY_ENDPOINT_POLYGON));
let discourseHub = new web3.eth.Contract(DiscourseAbi, process.env.DISCOURSE_CONTRACT_ADDRESS_POLYGON);
let account = web3.eth.accounts.privateKeyToAccount(process.env.ADMIN_PRIVATE_KEY_MAINNET);
web3.eth.accounts.wallet.add(account);

const isDisputed = (id) => {
    return new Promise((resolve, reject) => {
        discourseHub.methods.isDisputed(id).call()
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err);
            })
    })
}

const getBalance = () => {
    return new Promise((resolve, reject) => {
        web3.eth.getBalance(process.env.ADMIN_WALLET_MAINNET).then(balance => {
            resolve(balance);
        })
        .catch(err => {
            reject(err);
        })
    })
}

const setSpeaker = async (body) => {
    return new Promise((resolve, reject) => {
        discourseHub.methods.setSpeakerAddress(+body.id, body.handle, body.address).send({
            from: account.address,
            gas: 1000000
        })
        .then(result => {
            console.log(result);
            resolve(result);
        })
        .catch(err => {
            reject(err);
        })
    })
}

const getApprovedSpeakerAddresses = (id) => {
    return new Promise((resolve, reject) => {
        discourseHub.methods.getApprovedSpeakerAddresses(id).call().then(result => {
            resolve(result);
        }).catch(err => {
            reject(err);
        })
    })
}

const terminateProposal = async (id) => {
    return new Promise((resolve, reject) => {
        discourseHub.methods.terminateProposal(id).send({
            from: account.address,
            gas: 1000000
        })
        .then(result => {
            resolve(result);
        })
        .catch(err => {
            reject(err);
        })
    })
}


const getTotalProposals = () => {
    return new Promise((resolve, reject) => {
        discourseHub.methods.getTotalProposals().call()
        .then(result => {
            resolve(result);
        })
        .catch(err => {
            reject(err);
        })
    })
}

const isAdmin = () => {
    return new Promise((resolve, reject) => {
        discourseHub.methods.isAdmin(account.address).call().then(isAdmin => {
            resolve(isAdmin);
        }).catch(err => {
            reject(err);
        })
    })
}

const getBlock = () => {
    return new Promise((resolve, reject) => {
        web3.eth.getBlockNumber().then(block => {
            resolve(block);
        })
        .catch(err => {
            reject(err);
        })
    })
}


module.exports =  {
    isDisputed,
    getBalance,
    setSpeaker,
    terminateProposal,
    getTotalProposals,
    getApprovedSpeakerAddresses,
    isAdmin,
    getBlock
}
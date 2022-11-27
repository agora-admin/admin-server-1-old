const Web3 = require('web3');
const DiscourseAbi = require('./abi/DiscourseHub.json');

const web3 = new Web3(new Web3.providers.HttpProvider('https://aurora-testnet.infura.io/v3/a4d6ff8d0a7c4b93a9a4ac41adc048c8'));
let discourseHub = new web3.eth.Contract(DiscourseAbi, process.env.DISCOURSE_CONTRACT_ADDRESS_AURORA);
let account = web3.eth.accounts.privateKeyToAccount(process.env.ADMIN_PRIVATE_KEY);
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
        web3.eth.getBalance(process.env.ADMIN_WALLET).then(balance => {
            resolve(balance);
        })
            .catch(err => {
                reject(err);
            })
    })
}

const setSchedule = async (body) => {
    return new Promise(async (resolve, reject) => {
        discourseHub.methods.scheduleDiscourse(+body.id, +body.timestamp).send({
            from: account.address,
            gasLimit: 1000000,
            gasPrice: await web3.eth.getGasPrice()
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

const setSpeaker = async (body) => {
    return new Promise(async (resolve, reject) => {
        discourseHub.methods.setSpeakerAddress(+body.id, body.handle, body.address).send({
            from: account.address,
            gasLimit: 1000000,
            gasPrice: await web3.eth.getGasPrice()
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
            console.log(result);
            resolve(result);
        }).catch(err => {
            reject(err);
        })
    })
}

const terminateProposal = async (id) => {
    return new Promise(async (resolve, reject) => {
        discourseHub.methods.terminateProposal(id).send({
            from: account.address,
            gasLimit: 1000000,
            gasPrice: await web3.eth.getGasPrice()
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

module.exports = {
    isDisputed,
    getBalance,
    setSpeaker,
    setSchedule,
    terminateProposal,
    getTotalProposals,
    getApprovedSpeakerAddresses,
    isAdmin,
    getBlock
}
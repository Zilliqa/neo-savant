import { schnorr, getAddressFromPrivateKey } from '@zilliqa-js/crypto';

const generateZilliqaAccount = async () => {
    const privateKey = await schnorr.generatePrivateKey();

    const address = await getAddressFromPrivateKey(privateKey);
    return {
        address,
        privateKey
    };
}


const generateMultipleZilliqaAccounts = async (count) => {
    let accounts = [];
    for (let i = 1; i <= count; i++) {
        const acc = await generateZilliqaAccount();

        await accounts.push(acc);
    }

    return accounts;
};


export { generateZilliqaAccount, generateMultipleZilliqaAccounts };
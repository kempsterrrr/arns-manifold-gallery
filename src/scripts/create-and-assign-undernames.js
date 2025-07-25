import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { ARIO, ANT, ArweaveSigner } from '@ar.io/sdk';
// import { sanitizeUndername } from '../lib/utils.ts';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const data = JSON.parse(readFileSync(join(__dirname, '../data/collection_metadata.json'), 'utf8'));
const wallet = process.env.NODE_ENV === 'production' 
  ? JSON.parse(process.env.WALLET_JSON)
  : JSON.parse(readFileSync(join(__dirname, '../../wallet.json'), 'utf8'));

if (!process.env.ARNS_NAME) {
    throw new Error('ARNS_NAME environment variable is not set');
}

const ARNS_NAME = process.env.ARNS_NAME;

// count the number of items in the data
// create undernames for each item in the data named after the item
// assign the arweave transactions inside each items image property to the relevant undername using setUndernameRecord

const ario = ARIO.mainnet({ signer: new ArweaveSigner(wallet) });

async function countItemsInCollection (data) {
    const count = Object.keys(data).length;
    console.log(`${count} items in collection`);
    console.log(typeof count)
    return count;
}

async function fetchArnsName () {
    try {
        console.log(`Fetching ARNS record for name: ${ARNS_NAME}`);
        const arns = await ario.getArNSRecord({ name: ARNS_NAME });
        console.log('ARNS record:', arns);
        if (!arns) {
            throw new Error(`ARNS name "${ARNS_NAME}" not found or not accessible`);
        }
        return arns;
    } catch (error) {
        console.error('Error fetching ARNS record:', error);
        throw error;
    }
}

async function increaseUndernameLimit({name, qty}) {
    const result = await ario.increaseUndernameLimit({ name: name, increaseCount: qty});
    console.log(result)
    return
}

async function createAndAssignUndernames({ant, undername, transactionId, ttlSeconds}) {
    let txId;
    try {
        // Sanitize the undername using the shared function
        // const sanitizedUndername = sanitizeUndername(undername);
        
        // Extract just the transaction ID from the Arweave URL
        // Remove everything before and including the last '/'
        txId = transactionId.split('/').pop();
        
        const result = await ant.setUndernameRecord({
            name: ARNS_NAME,  // The parent ARNS name
            undername: undername,
            transactionId: txId,
            ttlSeconds: ttlSeconds,
        });
        
        console.log(`Created undername ${undername} with transaction ID: ${txId}`);
        return result;
    } catch (error) {
        console.error(`Error creating undername ${undername} with transaction ID: ${txId}:`, error);
        throw error;
    }
}

async function main() {
    const itemCount = await countItemsInCollection(data);
    const arns = await fetchArnsName();
    const arnsUndernameLimit = arns.undernameLimit
    console.log(`${arnsUndernameLimit} undernames available`)

    const ant = await ANT.init({
        signer: new ArweaveSigner(wallet),
        processId: arns.processId
    });

    const records = await ant.getRecords()
    const unassignedUndernames = arnsUndernameLimit - Object.keys(records).length - 1
    
    if (itemCount > unassignedUndernames) {
        const undernamesNeeded = itemCount - unassignedUndernames;
        await increaseUndernameLimit({name: ARNS_NAME, qty: undernamesNeeded});
        console.log(`Increased undername limit by ${undernamesNeeded}`)
    } else {
        console.log(`No need to increase undername limit`);
    }

    // Use Promise.all to handle all async operations
    const undernamePromises = Object.entries(data).map(async ([id, item], index) => {
        // Sanitize the undername before passing it to createAndAssignUndernames
        // const sanitizedUndername = sanitizeUndername(item.name);
        const undernameNumber = index + 1;
        const undernameNumberToString = undernameNumber.toString();
        const transactionId = item.image;
        const ttlSeconds = 900;
        // console.log(`Creating undername for item ${undernameNumberToString} of ${item.name} with TxId ${transactionId}`);
        // return
        return createAndAssignUndernames({ant, undername: undernameNumberToString, transactionId, ttlSeconds});
    });

    try {
        const results = await Promise.all(undernamePromises);
        console.log('All undernames created successfully:', results);
    } catch (error) {
        console.error('Error creating undernames:', error);
    }
}

main()

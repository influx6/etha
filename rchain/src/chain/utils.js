import EC from "elliptic"
import sha256 from "crypto-js/sha256.js"
import { v1 as UUIDV1 } from "uuid";

const { ec } = EC
const SECP256K1 = new ec("secp256k1")

export default class ChainUtil {
    static genKeyPair() {
        return SECP256K1.genKeyPair()
    }

    static id() {
        return UUIDV1();
    }

    static hashData(data) {
        if (data instanceof String) return sha256(data).toString();
        return sha256(JSON.stringify(data)).toString();
    }

    static verifySignature(signature, publicKey, dataHash) {
        decodedPublicKey = SECP256K1.keyFromPublic(publicKey, 'hex');
        return decodedPublicKey.verify(dataHash, signature);
    }

}
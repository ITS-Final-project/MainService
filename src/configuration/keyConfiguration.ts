import fs from 'fs';

interface IPublicKey {
    getPublicKey(): string;
}

interface IPrivateKey {
    getPrivateKey(): string;
}

class MSKeyConfiguration implements IPublicKey, IPrivateKey {
    private publicKey: string;
    private privateKey: string;

    constructor() {
        this.publicKey = fs.readFileSync('./keys/mspublic.key', 'utf8');
        this.privateKey = fs.readFileSync('./keys/msprivate.key', 'utf8');
    }

    getPublicKey(): string {
        return this.publicKey;
    }

    getPrivateKey(): string {
        return this.privateKey;
    }
}

class USKeyConfiguration implements IPublicKey {
    private publicKey: string;

    constructor() {
        this.publicKey = fs.readFileSync('./keys/uspublic.key', 'utf8');
    }

    getPublicKey(): string {
        return this.publicKey;
    }
}

class PYKeyConfiguration implements IPublicKey {
    private publicKey: string;

    constructor() {
        this.publicKey = fs.readFileSync('./keys/pypublic.key', 'utf8');
    }

    getPublicKey(): string {
        return this.publicKey;
    }
}

export { IPublicKey, IPrivateKey, MSKeyConfiguration, USKeyConfiguration, PYKeyConfiguration };
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
dotenv_1.default.config();
const port = process.env.PORT;
const hashSalt = process.env.hashSalt || 100;
console.log(hashSalt);
app.post('/api/v1/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    const findUser = yield db_1.User.findOne({ email });
    if (findUser) {
        console.log("User Exists");
        return res.status(400).json({ error: 'User Exists' });
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, hashSalt);
    const user = new db_1.User({
        email,
        password: hashedPassword
    });
    user.save()
        .then(() => {
        console.log('User saved successfully');
    })
        .catch((error) => {
        console.error('Error saving user:', error);
    });
    res.status(200).json({ message: 'Signedup successfully' });
}));
app.post('/api/v1/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    const findUser = yield db_1.User.findOne({ email });
    if (!findUser) {
        console.log("User Does not Exist");
        return res.status(400).json({ error: 'User Does not Exist' });
    }
    const isMatch = yield bcrypt_1.default.compare(password, findUser.password);
    if (!isMatch) {
        console.log("Wrong Password");
        return res.status(400).json({ error: 'Wrong Password' });
    }
    res.status(200).json({ message: 'Signedup successfully' });
}));
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

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
const body_parser_1 = __importDefault(require("body-parser"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const axios_1 = __importDefault(require("axios"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
const staticCredentials = [
    { email: 'user1@example.com', password: 'pass12345' },
    { email: 'user2@example.com', password: 'pass45645' },
    { email: 'user3@example.com', password: 'pass78945' }
];
const secretKey = 'your-secret-key';
app.get('/', (req, res) => {
    res.send('Test');
});
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = staticCredentials.find(cred => cred.email === email && cred.password === password);
    if (user) {
        const token = jsonwebtoken_1.default.sign({ email }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    }
    else {
        res.status(401).json({ message: 'Authentication failed' });
    }
});
app.get('/api/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const query = req.query.query;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
    console.log(token);
    if (!token) {
        res.status(401).json({ message: 'Authorization token missing' });
        return;
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
        const response = yield axios_1.default.get(`https://api.tvmaze.com/search/shows?q=${query}`);
        const shows = response.data;
        res.status(200).json(shows);
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
}));
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

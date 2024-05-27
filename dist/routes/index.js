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
const __1 = __importDefault(require(".."));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
const port = 3000; // Port number for the server to listen on
//get all~
app.post('/getemails', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // post username ,password , postnumber , keyword to search
    const { username, password, postnumber, keyword } = req.body;
    if (!username || !password || !postnumber || !keyword) {
        console.log({ username, password, postnumber, keyword });
        return res.status(400).send("Please provide all required fields");
    }
    return (0, __1.default)(username, password, postnumber, keyword).then((data) => {
        res.send(data);
    });
}));
app.listen(port, () => {
    console.log("listening on port 3000");
});

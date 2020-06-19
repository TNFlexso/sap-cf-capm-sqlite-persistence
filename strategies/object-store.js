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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var aws = __importStar(require("aws-sdk"));
var cfenv = __importStar(require("cfenv"));
var ObjectStore = /** @class */ (function () {
    function ObjectStore() {
        var _this = this;
        this.getS3Client = function (parameters) {
            if (parameters && parameters.bucket && parameters.access_key_id && parameters.secret_access_key) {
                _this.credentials = new aws.Credentials(parameters.access_key_id, parameters.secret_access_key);
                _this.region = parameters.region;
                _this.bucket = parameters.bucket;
            }
            else {
                var appEnv = cfenv.getAppEnv({ vcapFile: "default-vcapfile.json" });
                if (appEnv.services.objectstore) {
                    var objectStoreCredentials = appEnv.getServiceCreds(appEnv.services.objectstore[0].name);
                    _this.credentials = new aws.Credentials(objectStoreCredentials.access_key_id, objectStoreCredentials.secret_access_key);
                    _this.bucket = objectStoreCredentials.bucket;
                    _this.region = objectStoreCredentials.region;
                }
                else {
                    throw 'No credentials found for Object Storage Service';
                }
            }
            aws.config.update({
                credentials: _this.credentials,
                region: _this.region
            });
            return new aws.S3({ apiVersion: '2006-03-01' });
        };
        this.loadData = function (key, parameters) { return __awaiter(_this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getS3Client(parameters).getObject({
                            Bucket: this.bucket,
                            Key: key
                        }).promise()];
                    case 1:
                        data = _a.sent();
                        if (data.Body) {
                            return [2 /*return*/, JSON.parse(data.Body.toString())];
                        }
                        else {
                            throw "Error while fetching backup from object store";
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        this.persistData = function (key, data, parameters) {
            var strData = JSON.stringify(data);
            return _this.getS3Client(parameters).putObject({
                Body: Buffer.from(strData),
                Bucket: _this.bucket,
                Key: key
            }).promise();
        };
    }
    return ObjectStore;
}());
exports.ObjectStore = ObjectStore;
//# sourceMappingURL=object-store.js.map
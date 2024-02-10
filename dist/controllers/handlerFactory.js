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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOne = void 0;
const deleteOne = (Model) => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doc = yield Model.findByIdAndDelete(req.params.id);
        if (!doc) {
            return res.status(404).json({
                status: "fail",
                msg: "No document found with that ID"
            });
        }
        res.status(200).json({
            status: "success",
            msg: "Document deleted successfully"
        });
    }
    catch (error) {
        res.status(400).json({
            status: "fail",
            msg: error.message
        });
    }
});
exports.deleteOne = deleteOne;

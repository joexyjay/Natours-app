"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUser = exports.createUser = exports.getAllUsers = void 0;
const getAllUsers = (req, res) => {
    res.status(500).json({
        msg: 'Internal server error',
        data: 'error'
    });
};
exports.getAllUsers = getAllUsers;
const createUser = (req, res) => {
    res.status(500).json({
        status: 'failed',
        msg: 'not defined'
    });
};
exports.createUser = createUser;
const getUser = (req, res) => {
    res;
};
exports.getUser = getUser;
const updateUser = (req, res) => {
    res;
};
exports.updateUser = updateUser;
const deleteUser = (req, res) => {
    res;
};
exports.deleteUser = deleteUser;

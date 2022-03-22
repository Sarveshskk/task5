const express = require("express");
const md5 = require("md5");
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
require("dotenv").config();
const db = require("../models/index");
const User = db.User;
const Address = db.Address;


exports.register = async (req, res) => {
    try {
        if (req.body.password == req.body.cnfpassword) {
            const user = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                username: req.body.username,
                password: md5(req.body.password),
            }
            User.create(user);
            const token = jwt.sign(
                { id: user.id },
                process.env.TOKEN_KEY,
                {
                    expiresIn: 60000,
                }
            );
            res.status(200).send({ jwttoken: token });

        } else {
            res.status(403).send("password and confirm password must be match");
        }
    }
    catch (error) {
        res.status(400).send(error)
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message);
    });
};

exports.login = async (req, res) => {
    try {
        let username = req.body.username
        let password = md5(req.body.password)
        let foundUser = await User.findOne({
            where: {
                username: username,
            }
        });
        if (foundUser) {
            if (foundUser.password === password) {
                const token = jwt.sign(
                    { id: foundUser.id },
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: 60000,
                    }
                );
                res.status(200).send({ jwttoken: token });
            } else {
                res.status(403).send("User password incorrect.");
            }
        } else {
            res.status(401).send("User not regestered.");
        }
    } catch (error) {
        res.status(400).send(err);
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message);
    });
};

exports.deleteUser = async (req, res) => {
    try {
        let user = req.user;
        let deletedUser = await User.destroy({
            where: {
                id: user["id"]
            }
        });
        if (!deletedUser) {
            res.status(400).send("user not deleted");
        }
        res.status(200).send("user deleted successfully");
    } catch (error) {
        res.status(400).send(error)
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message);
    });
};

exports.pagination = async (req, res) => {
    try {
        let page = req.params["page"];
        let size = 10;
        let skipPage = (page - 1) * size;
        const result = await User.findAll({
            limit: size,
            offset: skipPage,
        })
        if (!result) {
            res.status(404).send("page not found");
        }
        res.status(200).send(result);
    }
    catch (error) {
        res.status(400).send(error)
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message);
    });
};

exports.getData = async (req, res) => {
    try {
        let user_id = req.params["id"];
        let user = await User.findOne({
            where: {
                id: user_id,
            },
            include: [{
                model: Address
            }]
        });
        res.status(200).send(user)
    }
    catch (error) {
        res.status(400).send(error)
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message);
    });
};

exports.forgotPassword = async (req, res) => {
    try {
        let username = req.body.username;
        let foundUser = await User.findOne({
            where: {
                username: username,
            }
        });
        if (!foundUser) {
            res.status(404).send("user not found");
        }
        const pswdResetToken = jwt.sign(
            { id: foundUser.id },
            process.env.TOKEN_KEY,
            {
                expiresIn: "10m",
            }
        );
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: 'sarvesh@excellencetechnologies.in',
            from: 'sarvesh@excellencetechnologies.in',
            subject: 'Reset password',
            text: 'please follow this link to reset password',
            html: `'please follow this link to reset password---<strong>http://localhost:3000/user/verifyResetPassword/${pswdResetToken}</strong>`,

        };
        (async () => {
            try {
                await sgMail.send(msg);
            } catch (error) {
                console.error(error);

                if (error.response) {
                    console.error(error.response.body)
                }
            }
        })();
        res.status(200).send({ pswdresettoken: pswdResetToken });
    } catch (error) {
        res.status(400).send(error)
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message);
    });
};

exports.resetPassword = async (req, res) => {
    try {
        let resetToken = req.params['token'];
        const user = jwt.verify(resetToken, process.env.TOKEN_KEY);
        let userData = await User.findOne({
            where: {
                id: user['id'],
            }
        });
        if (!userData) {
            res.status(401).send("unautrorised token")
        }
        if (req.body.password == req.body.cnfpassword) {
            let password = md5(req.body.password);
            await User.update({ password: password }, {
                where: {
                    id: user["id"]
                }
            });
            res.status(200).send("update password successfull")
        } else {
            res.status(400).send("please type password carefully")
        }
    } catch (error) {
        res.status(400).send(error)
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message);
    });
};

exports.imgUpload = (req, res) => {
    try {
        if (!req.file) {
            res.status(400).send({
                message: "image not upload"
            })
        }
        res.status(200).send("image uploaded successfully")
    } catch (error) {
        res.status(400).send(error)
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message);
    });
};

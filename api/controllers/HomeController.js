var knex = require("../config/knex");
var RoomBs = require("../models/RoomModel")
var UserBs = require("../models/UserModel")
var BookingBs = require("../models/BookingModel")
var RequestBs = require("../models/RequestModel")
var BlockBs = require("../models/BlockModel")
const jwt = require('jsonwebtoken');

const accessTokenSecret = 'youraccesstokensecret';

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

class HomeController {
    constructor(router) {
        this.router = router;
        this.registerRouter();
    }

    registerRouter() {
        this.router.get("/account", (req, resp, next) =>
            this.getAccount(req, resp, next)
        );

        this.router.get("/blocks", (req, resp, next) =>
            this.getAllBlocks(req, resp, next)
        );

        this.router.get("/blocks-rooms", authenticateJWT, (req, resp, next) =>
            this.getBlocksRooms(req, resp, next)
        );
        this.router.post("/create-block", authenticateJWT, (req, resp, next) =>
            this.createBlock(req, resp, next)
        );
        this.router.post("/update-block", authenticateJWT, (req, resp, next) =>
            this.updateBlock(req, resp, next)
        );
        this.router.get("/rooms", (req, resp, next) =>
            this.getRooms(req, resp, next)
        );
        this.router.post("/create-room", authenticateJWT, (req, resp, next) =>
            this.createRoom(req, resp, next)
        );
        this.router.post("/update-room", authenticateJWT, (req, resp, next) =>
            this.updateRoom(req, resp, next)
        );
        this.router.post("/delete-room", authenticateJWT, (req, resp, next) =>
            this.deleteRoom(req, resp, next)
        );
        this.router.get("/users", authenticateJWT, (req, resp, next) =>
            this.getUsers(req, resp, next)
        );
        this.router.post("/create-user", authenticateJWT, (req, resp, next) =>
            this.createUser(req, resp, next)
        );
        this.router.post("/update-user", authenticateJWT, (req, resp, next) =>
            this.updateUser(req, resp, next)
        );

        this.router.get("/bookings", (req, resp, next) =>
            this.getBookings(req, resp, next)
        );
        this.router.post("/create-booking", (req, resp, next) =>
            this.createBooking(req, resp, next)
        );
        this.router.post("/update-booking", authenticateJWT, (req, resp, next) =>
            this.updateBooking(req, resp, next)
        );
        this.router.post("/delete-booking", authenticateJWT, (req, resp, next) =>
            this.deleteBooking(req, resp, next)
        );

        this.router.get("/requests", (req, resp, next) =>
            this.getRequests(req, resp, next)
        );
        this.router.post("/create-request", authenticateJWT, (req, resp, next) =>
            this.createRequest(req, resp, next)
        );
        this.router.post("/update-request", authenticateJWT, (req, resp, next) =>
            this.updateRequest(req, resp, next)
        );
    }

    async getAccount(req, resp, next) {
        let request = req.query || {}

        let user = await UserBs.query(q => {
            q.where("email", request.email || "")
            q.whereRaw("?? like ?", [
                "idnp",
                `%${request.idnp}`
            ])
        })
            .fetch({
                withRelated: [
                    "bookings.room.block",
                    "requests.room_from.block",
                    "requests.room_to.block",
                ]
            }).catch(e => console.log('getAccount', e))

        if (!user) {
            return resp.json({
                status: false
            })
        }

        return resp.json({
            status: true,
            item: user
        })
    }

    async getAllBlocks(req, resp, next) {
        knex("blocks").select("*")
            .then(data => {
                return resp.json({
                    status: true,
                    data: data
                })
            })
    }

    async getBlocksRooms(req, resp, next) {
        return BlockBs
            .fetchAll({
                withRelated: [
                    "rooms",
                ]
        })
            .then(r => {
                let data = r ? r.serialize() : []
                return resp.json({
                    status: true,
                    data: data
                })
            })
            .catch(e => console.log('getBlocksRooms error', e))
    }

    async updateBlock(req, resp, next) {
        let request = req.body

        console.log("request", request)

        let data = {
            nr: request.nr || "",
            address: request.address || "",
            description: request.description || ""
        }

        knex("blocks")
            .where("id", request.id)
            .update({
                ...data
            })
            .then(r => {
                return resp.json({
                    status: true,
                })
            })
    }

    async createBlock(req, resp, next) {
        let request = req.body

        let data = {
            nr: request.nr || "",
            address: request.address || "",
            description: request.description || ""
        }

        knex("blocks")
            .insert(data)
            .then(r => {
                return resp.json({
                    status: true,
                })
            })
    }

    async deleteBlock(req, resp, next) {
        let request = req.body

        knex("blocks")
            .where("id", request.id)
            .del()
            .then(r => {
                return resp.json({
                    status: true,
                })
            })
    }

    async getRooms(req, resp, next) {
        let request = req.query || {}
        console.log("request:", request)

        RoomBs
            .query(q => {
                if (request.block) {
                    q.where("block_id", request.block)
                }
                if (request.etaj) {
                    q.where("etaj", request.etaj)
                }
                if (request.guests) {
                    q.where("capacity", ">=", request.guests)
                }
                if (request.type && request.type === 'available') {
                    q.where("type", "<>", 'rezervat')
                }
            })
            .fetchAll({
                withRelated: [
                    "block",
                    "bookings.user"
                ]
            })
            .then(r => {
                let data = r ? r.serialize() : []
                return resp.json({
                    status: true,
                    data: data
                })
            })
            .catch(e => console.log('GetRooms error', e))

        // knex("rooms").select("*")
        //     .then(data => {
        //         return resp.json({
        //             status: true,
        //             data: data
        //         })
        //     })
    }

    async updateRoom(req, resp, next) {
        let request = req.body

        console.log("request", request)

        let data = {
            nr: request.nr || "",
            camera: request.camera || "",
            capacity: request.capacity || "",
            block_id: request.block_id || "",
            etaj: request.etaj || "",
            type: request.type || "",
        }

        knex("rooms")
            .where("id", request.id)
            .update({
                ...data
            })
            .then(r => {
                return resp.json({
                    status: true,
                })
            })
    }

    async createRoom(req, resp, next) {
        let request = req.body

        let data = {
            nr: request.nr || "",
            camera: request.camera || "",
            capacity: request.capacity || "",
            block_id: request.block_id || "",
            etaj: request.etaj || "",
            type: request.type || "",
        }

        knex("rooms")
            .insert(data)
            .then(r => {
                return resp.json({
                    status: true,
                })
            })
    }

    async deleteRoom(req, resp, next) {
        let request = req.body

        knex("rooms")
            .where("id", request.id)
            .del()
            .then(r => {
                return resp.json({
                    status: true,
                })
            })
    }

    async getUsers(req, resp, next) {
        let request = req.query || {}

        knex("users").select("*")
            .then(data => {
                return resp.json({
                    status: true,
                    data: data
                })
            })
    }

    async createUser(req, resp, next) {
        let request = req.body

        let data = {
            type: request.type || "",
            name: request.name || "",
            email: request.email || "",
            year: request.year || "",
            grupa: request.grupa || "",
            departament: request.departament || "",
            necesita_cazare: request.necesita_cazare ? 1 : 0 || "",
        }

        knex("users")
            .insert(data)
            .then(r => {
                return resp.json({
                    status: true,
                })
            })
    }

    async updateUser(req, resp, next) {
        let request = req.body

        let data = {
            type: request.type || "",
            name: request.name || "",
            email: request.email || "",
            year: request.year || "",
            grupa: request.grupa || "",
            departament: request.departament || "",
            necesita_cazare: request.necesita_cazare ? 1 : 0 || "",
        }

        knex("users")
            .where("id", request.id)
            .update({
                ...data
            })
            .then(r => {
                return resp.json({
                    status: true,
                })
            })
    }

    async getBookings(req, resp, next) {
        let request = req.query || {}

        BookingBs.query(q => {
            if (request.block) {
                q.whereExists(
                    knex("rooms").whereRaw("??.?? = ??.??", [
                        "bookings", "room_id",
                        "rooms", "id"
                    ]).whereExists(
                        knex("blocks").whereRaw("??.?? = ??.?? and ??.?? = ?", [
                            "rooms", "block_id",
                            "blocks", "id",
                            "blocks", "nr",
                            request.block
                        ])
                    )
                )
            }
            if (request.etaj) {
                q.whereExists(
                    knex("rooms").whereRaw("??.?? = ??.?? and ?? = ?", [
                        "bookings", "room_id",
                        "rooms", "id",
                        "etaj", request.etaj
                    ])
                )
            }
            if (request.room) {
                q.whereExists(
                    knex("rooms").whereRaw("??.?? = ??.?? and ?? = ?", [
                        "bookings", "room_id",
                        "rooms", "id",
                        "nr", request.room
                    ])
                )
            }
            if (request.email) {
                q.whereExists(
                    knex("users").whereRaw("??.?? = ??.?? and ?? like ?", [
                        "bookings", "user_id",
                        "users", "id",
                        "email",
                        `%${request.email}%`
                    ])
                )
            }
            if (request.active) {
                q.whereRaw("?? < ? and ?? >= ?", [
                    "start_date",
                    new Date(),
                    "end_date",
                    new Date()
                ])
            }
        })
            .fetchAll({
            withRelated: [
                "user",
                "room"
            ]
        })
            .then(r => {
                let data = r ? r.serialize() : []
                return resp.json({
                    status: true,
                    data: data
                })
            })

        // knex("bookings").select("*")
        //     .then(data => {
        //         return resp.json({
        //             status: true,
        //             data: data
        //         })
        //     })
    }

    async createBooking(req, resp, next) {
        let request = req.body

        let data = {
            start_date: request.start_date || "",
            end_date: request.end_date || "",
            room_id: request.room_id || "",
            user_id: request.user_id || "",
        }

        knex("bookings")
            .insert(data)
            .then(r => {
                return resp.json({
                    status: true,
                })
            })
    }

    async updateBooking(req, resp, next) {
        let request = req.body

        let data = {
            start_date: request.start_date || "",
            end_date: request.end_date || "",
            room_id: request.room_id || "",
            user_id: request.user_id || "",
        }

        knex("bookings")
            .where("id", request.id)
            .update({
                ...data
            })
            .then(r => {
                return resp.json({
                    status: true,
                })
            })
    }

    async deleteBooking(req, resp, next) {
        let request = req.body

        knex("bookings")
            .where("id", request.id)
            .del()
            .then(r => {
                return resp.json({
                    status: true,
                })
            })
    }

    async getRequests(req, resp, next) {
        let request = req.query || {}

        RequestBs.query(q => {

            if (request.room_from_id) {
                q.whereExists(
                    knex("rooms").whereRaw("??.?? = ??.?? and ?? = ?", [
                        "requests", "room_from_id",
                        "rooms", "id",
                        "nr", request.room_from_id
                    ])
                )
            }
            if (request.room_to_id) {
                q.whereExists(
                    knex("rooms").whereRaw("??.?? = ??.?? and ?? = ?", [
                        "requests", "room_to_id",
                        "rooms", "id",
                        "nr", request.room_to_id
                    ])
                )
            }
            if (request.email) {
                q.whereExists(
                    knex("users").whereRaw("??.?? = ??.?? and ?? like ?", [
                        "requests", "user_id",
                        "users", "id",
                        "email",
                        `%${request.email}%`
                    ])
                )
            }
            if (request.status) {
                q.where('status', request.status)
            }
        })
            .fetchAll({
                withRelated: [
                    "user",
                    "room_from",
                    "room_to"
                ]
            })
            .then(r => {
                let data = r ? r.serialize() : []
                return resp.json({
                    status: true,
                    data: data
                })
            })

        // knex("requests").select("*")
        //     .then(data => {
        //         return resp.json({
        //             status: true,
        //             data: data
        //         })
        //     })
    }

    async createRequest(req, resp, next) {
        let request = req.body

        let data = {
            room_from_id: request.room_from_id || "",
            room_to_id: request.room_to_id || "",
            user_id: request.user_id || "",
            status: request.status || "draft"
        }

        knex("requests")
            .insert(data)
            .then(r => {
                return resp.json({
                    status: true,
                })
            })
    }

    async updateRequest(req, resp, next) {
        let request = req.body

        let data = {
            user_id: request.user_id || "",
            status: request.status || "",
            user_to_id: request.user_to_id || "",
            user_from_id: request.user_from_id || "",
        }

        knex("requests")
            .where("id", request.id)
            .update({
                ...data
            })
            .then(r => {
                return resp.json({
                    status: true,
                })
            })
    }
}

module.exports = HomeController